import User from "../modal/user.modal.js";

export const createUser = async (req, res) => {
  // console.log("createUser------",req.body);
  const { name, email, password } = req.body;
  const createUser = await User.create({ name, email, password });
  console.log(createUser, "createUser");
};
export const fetchUser = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    const { name, email, password } = req.body;
    const findUser = await User.find();
    res.status(200).json(findUser);
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
