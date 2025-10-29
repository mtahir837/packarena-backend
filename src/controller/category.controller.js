import Category from "../modal/category.js";
import Product from "../modal/product.js";

export const createCategory = async (req, res) => {
    try {
        const { name, slug, image, description, heading, subheading, subDescription } = req.body;
        
        if (!name || !slug) {
            return res.status(400).json({ message: "Name and slug are required" });
        }
        
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this slug already exists" });
        }
        
        const newCategory = new Category({
            name,
            slug,
            image,
            description,
            heading,
            subheading,
            subDescription
        });
        
        await newCategory.save();
        
        res.status(201).json({
            message: "Category created successfully",
            category: newCategory
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const fetchCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: "Categories fetched successfully",
            categories,
            count: categories.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        // Get all products in this category
        const products = await Product.find({ category: req.params.id })
            .select('name slug images description')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Category fetched successfully",
            category: {
                ...category.toObject(),
                products: products,
                productCount: products.length
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name, slug, image, description, heading, subheading, subDescription } = req.body;
        
        if (slug) {
            const existingCategory = await Category.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingCategory) {
                return res.status(400).json({ message: "Category with this slug already exists" });
            }
        }
        
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, slug, image, description, heading, subheading, subDescription },
            { new: true, runValidators: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.status(200).json({
            message: "Category deleted successfully",
            category: deletedCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

