import CustomQuote from "../modal/customQuote.js";

// Create Custom Quote
export const createCustomQuote = async (req, res) => {
    try {
        const { name, email, phone, length, width, depth, quantity, description } = req.body;
        
        // Validation
        if (!name || !email || !phone || !length || !width || !depth || !quantity) {
            return res.status(400).json({ message: "Name, email, phone, length, width, depth, and quantity are required" });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }
        
        const newCustomQuote = new CustomQuote({
            name,
            email,
            phone,
            length,
            width,
            depth,
            quantity,
            description
        });
        
        await newCustomQuote.save();
        
        res.status(201).json({
            message: "Custom quote request created successfully",
            customQuote: newCustomQuote
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get All Custom Quotes
export const fetchCustomQuotes = async (req, res) => {
    try {
        const customQuotes = await CustomQuote.find()
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Custom quotes fetched successfully",
            customQuotes,
            count: customQuotes.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

