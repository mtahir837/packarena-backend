import express from 'express';
import mongoose from 'mongoose';
import { createUser, deleteId, fetchUser, findId, updateId } from './controller/user.controller.js';

const app = express();
const port = 3000;
app.use(express.json());
// mtahir8444_db_user
// eKwgU8Q21XmGfBxT
// mongodb+srv://mtahir8444_db_user:eKwgU8Q21XmGfBxT@cluster0.mongodb.net/myDatabase
 const connectDB= async ()=>{
    mongoose.connect("mongodb://localhost:27017/learn-node")
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ Connection error:", err));
 } 
 connectDB()
app.post("/create-user", createUser)
app.get("/fetch-user", fetchUser)
app.get("/find/:id", findId)
app.delete("/delete/:id", deleteId)
app.put("/update/:id", updateId)

app.listen(port, () => {
    console.log(`Example app listening on port localhot:${port}!`);
});


