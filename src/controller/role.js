import User from "../modal/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createRole = async (req, res) => {
    // console.log("createUser------",req.body);
    try {
      const { name } = req.body;
      const createRole = await User( { name });
      await createRole.save();
      res.status(201).json(createRole);
      
    } catch (error) {
      res.status(500).json("internal server error");
    }
  
  
  
  };
export const fetchRole = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    const { name,  } = req.body;
   res.status(200).json({message:"roles fetched successfully",findRole});
    console.log(findRole, "findRole");
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
export const findRoleId = async (req, res) => {
  // console.log("createUser------",req.body);
  try {
    
    const findRole = await Role.findById(req.params.id);
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




