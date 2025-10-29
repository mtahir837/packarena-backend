import ProductQuote from "../modal/productQuote.js";
import Product from "../modal/product.js";

// Create Product Quote
export const createQuote = async (req, res) => {
    try {
        const { productId, name, email, phone, quantity, length, width, depth, unit } = req.body;
        
        // Validation
        if (!productId || !name || !email || !phone || !quantity || !length || !width || !depth || !unit) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (!["in", "cm", "mm"].includes(unit.toLowerCase())) {
            return res.status(400).json({ message: "Unit must be 'in', 'cm', or 'mm'" });
        }
        
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }
        
        const newProductQuote = new ProductQuote({
            productId,
            name,
            email,
            phone,
            quantity,
            length,
            width,
            depth,
            unit: unit.toLowerCase()
        });
        
        await newProductQuote.save();
        
        const populatedProductQuote = await ProductQuote.findById(newProductQuote._id)
            .populate('productId', 'name slug description images');
        
        res.status(201).json({
            message: "Product quote request created successfully",
            productQuote: populatedProductQuote
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get All Product Quotes
export const fetchQuotes = async (req, res) => {
    try {
        const productQuotes = await ProductQuote.find()
            .sort({ createdAt: -1 })
            .populate('productId', 'name slug image description');
        
        res.status(200).json({
            message: "Product quotes fetched successfully",
            productQuotes,
            count: productQuotes.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

