import express from 'express';
import mongoose from 'mongoose';
import { createUser, deleteId, fetchUser, findId, updateId, signup, login, forgetPassword, resetPassword } from './controller/user.controller.js';
import { createCategory, fetchCategories, getCategoryById, updateCategory, deleteCategory } from './controller/category.controller.js';
import { createProduct, fetchProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct } from './controller/product.controller.js';
import { createQuote, fetchQuotes } from './controller/productQuote.controller.js';
import { createCustomQuote, fetchCustomQuotes } from './controller/customQuote.controller.js';
import dotenv from 'dotenv';
dotenv.config();    
const app = express();
const port = 3001;
app.use(express.json());
// mtahir8444_db_user
// eKwgU8Q21XmGfBxT
// mongodb+srv://mtahir8444_db_user:eKwgU8Q21XmGfBxT@cluster0.mongodb.net/myDatabase
 const connectDB= async ()=>{
    mongoose.connect (process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ Connection error:", err));
 } 
 connectDB()
 app.get("/", (req, res) => {
    res.send("Hello World");
 })
app.post("/create-user", createUser)
app.get("/fetch-user", fetchUser)
app.get("/find/:id", findId)
app.delete("/delete/:id", deleteId)
app.put("/update/:id", updateId)
app.post("/signup", signup)
app.post("/login", login)
app.post("/forget-password", forgetPassword)
app.post("/reset-password", resetPassword)

// Category Routes
app.post("/category", createCategory)
app.get("/category", fetchCategories)
app.get("/category/:id", getCategoryById)
app.put("/category/:id", updateCategory)
app.delete("/category/:id", deleteCategory)

// Product Routes
app.post("/product", createProduct)
app.get("/product", fetchProducts)
app.get("/product/:id", getProductById)
app.get("/product/category/:categoryId", getProductsByCategory)
app.put("/product/:id", updateProduct)
app.delete("/product/:id", deleteProduct)

// Product Quote Routes
app.post("/create-quote", createQuote)
app.get("/all-quotes", fetchQuotes)

// Custom Quote Routes
app.post("/custom-quote", createCustomQuote)
app.get("/custom-quote", fetchCustomQuotes)

app.listen(port, () => {
    console.log(`Example app listening on port localhot:${port}!`);
});
// IyTheQpV2tQ2FFSQ
// tahirk8444_db_user
