import Product from "../modal/product.js";
import Category from "../modal/category.js";

export const createProduct = async (req, res) => {
    try {
        const { name, slug, description, images, subDescription, category } = req.body;
        
        if (!name || !slug || !category) {
            return res.status(400).json({ message: "Name, slug, and category are required" });
        }
        
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this slug already exists" });
        }
        
        const newProduct = new Product({
            name,
            slug,
            description,
            images: images || [],
            subDescription,
            category
        });
        
        await newProduct.save();
        
        const populatedProduct = await Product.findById(newProduct._id)
            .populate('category', 'name slug image description heading subheading');
        
        res.status(201).json({
            message: "Product created successfully",
            product: populatedProduct
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate('category', 'name slug image description heading subheading');
        
        res.status(200).json({
            message: "Products fetched successfully",
            products,
            count: products.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug image description heading subheading subDescription');
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        const products = await Product.find({ category: categoryId })
            .sort({ createdAt: -1 })
            .populate('category', 'name slug image description heading subheading');
        
        res.status(200).json({
            message: "Products fetched successfully",
            category: categoryExists,
            products: products,
            count: products.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, slug, description, images, subDescription, category } = req.body;
        
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }
        
        if (slug) {
            const existingProduct = await Product.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingProduct) {
                return res.status(400).json({ message: "Product with this slug already exists" });
            }
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (images !== undefined) updateData.images = images;
        if (subDescription !== undefined) updateData.subDescription = subDescription;
        if (category) updateData.category = category;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name slug image description heading subheading');
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

