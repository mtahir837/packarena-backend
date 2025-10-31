import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createUser, deleteId, fetchUser, findId, updateId, signup, login, forgetPassword, resetPassword } from './controller/user.controller.js';
import { createCategory, fetchCategories, getCategoryById, updateCategory, deleteCategory } from './controller/category.controller.js';
import { createProduct, fetchProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct } from './controller/product.controller.js';
import { createQuote, fetchQuotes } from './controller/productQuote.controller.js';
import { createCustomQuote, fetchCustomQuotes } from './controller/customQuote.controller.js';
import { addToCart, viewCart, updateCartItem, removeFromCart, clearCart } from './controller/cart.controller.js';
import dotenv from 'dotenv';
dotenv.config();    
const app = express();
const port = 3002;
app.use(cors());
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
app.post("/api/create-user", createUser)
app.get("/api/fetch-user", fetchUser)
app.get("/api/find/:id", findId)
app.delete("/api/delete/:id", deleteId)
app.put("/api/update/:id", updateId)
app.post("/api/signup", signup)
app.post("/api/login", login)
app.post("/api/forget-password", forgetPassword)
app.post("/api/reset-password", resetPassword)

// Category Routes
app.post("/api/create-category", createCategory)
app.get("/api/get-all-category", fetchCategories)
app.get("/api/category/:id", getCategoryById)
app.put("/api/category/:id", updateCategory)
app.delete("/api/category/:id", deleteCategory)

// Product Routes
app.post("/api/create-product", createProduct)
app.get("/api/get-all-products", fetchProducts)
app.get("/api/product/:id", getProductById)
app.get("/api/product/category/:categoryId", getProductsByCategory)
app.put("/api/product/:id", updateProduct)
app.delete("/api/product/:id", deleteProduct)

// Product Quote Routes
app.post("/api/create-quote", createQuote)
app.get("/api/all-quotes", fetchQuotes)

// Custom Quote Routes
app.post("/api/create-custom-quote", createCustomQuote)
app.get("/api/all-custom-quote", fetchCustomQuotes)

// Cart Routes
app.post("/api/cart/add", addToCart)
app.get("/api/cart/:userId", viewCart)
app.put("/api/cart/update", updateCartItem)
app.delete("/api/cart/remove", removeFromCart)
app.delete("/api/cart/clear/:userId", clearCart)

app.listen(port, () => {
    console.log(`Example app listening on port localhot:${port}!`);
});
// IyTheQpV2tQ2FFSQ
// tahirk8444_db_user
