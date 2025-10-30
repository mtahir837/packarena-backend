import Cart from "../modal/cart.js";
import Product from "../modal/product.js";
import User from "../modal/user.js";

// Add to cart or update quantity if product already exists
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;

        // Validate required fields
        if (!userId || !productId) {
            return res.status(400).json({ 
                message: "User ID and Product ID are required" 
            });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ 
                message: "Quantity must be a positive integer" 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart for user
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Check if product already exists in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId.toString()
            );

            if (existingItemIndex !== -1) {
                // Update quantity if product exists
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();

        // Populate cart with product details
        const populatedCart = await Cart.findById(cart._id)
            .populate('user', 'name email')
            .populate('items.product', 'name slug description images category');

        res.status(200).json({
            message: "Item added to cart successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// View cart for a specific user
export const viewCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                message: "User ID is required" 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find cart for user
        const cart = await Cart.findOne({ user: userId })
            .populate('user', 'name email')
            .populate({
                path: 'items.product',
                select: 'name slug description images subDescription',
                populate: {
                    path: 'category',
                    select: 'name slug'
                }
            });

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    },
                    items: [],
                    totalItems: 0
                }
            });
        }

        // Calculate total items count
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        res.status(200).json({
            message: "Cart fetched successfully",
            cart: {
                ...cart.toObject(),
                totalItems
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Update quantity of a cart item
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity === undefined) {
            return res.status(400).json({ 
                message: "User ID, Product ID, and quantity are required" 
            });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ 
                message: "Quantity must be a positive integer" 
            });
        }

        // Find cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find item in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                message: "Product not found in cart" 
            });
        }

        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        // Populate cart with product details
        const populatedCart = await Cart.findById(cart._id)
            .populate('user', 'name email')
            .populate({
                path: 'items.product',
                select: 'name slug description images',
                populate: {
                    path: 'category',
                    select: 'name slug'
                }
            });

        res.status(200).json({
            message: "Cart item updated successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ 
                message: "User ID and Product ID are required" 
            });
        }

        // Find cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find and remove item
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                message: "Product not found in cart" 
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        // Populate cart with product details
        const populatedCart = await Cart.findById(cart._id)
            .populate('user', 'name email')
            .populate({
                path: 'items.product',
                select: 'name slug description images',
                populate: {
                    path: 'category',
                    select: 'name slug'
                }
            });

        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                message: "User ID is required" 
            });
        }

        // Find and update cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        // Populate cart with user details
        const populatedCart = await Cart.findById(cart._id)
            .populate('user', 'name email');

        res.status(200).json({
            message: "Cart cleared successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
