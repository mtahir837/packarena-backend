import User from "../modal/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createUser = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User({ name, email, password: hashedPassword });
    await createUser.save();
    res.status(201).json(createUser);
    
  } catch (error) {
    res.status(500).json("internal server error");
  }



};
export const fetchUser = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    const { name, email, password } = req.body;
    const getUser = await User.find().sort({createdAt:-1}).select("-password");
   res.status(200).json({message:"users fetched successfully",getUser});
    console.log(findUser, "findUser");
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
export const findId = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    
    const findUser = await User.findById(req.params.id);
    if(!findUser){
        res.status(404).json({message:"useer not find"})
    }
    console.log(findUser,"finduser")
    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
export const deleteId = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    
    const findUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"deleted successfully"});
    console.log(findUser, "findUser");
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
export const updateId = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({message:"updated user successfully",updatedUser});
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    res.status(200).json({
      message: "Password reset token generated successfully",
      resetToken: resetToken, 
      expiresIn: "15 minutes",
      note: "In production, this token would be sent to your email"
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: new Date() } 
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    
    res.status(200).json({
      message: "Password reset successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
