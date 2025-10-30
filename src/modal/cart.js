import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, {
    _id: true
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

cartSchema.pre('save', function(next) {
    const seen = new Map();
    this.items = this.items.filter(item => {
        const productId = item.product.toString();
        if (seen.has(productId)) {
            // If product already exists, update quantity
            const existingIndex = seen.get(productId);
            this.items[existingIndex].quantity += item.quantity;
            return false;
        }
        seen.set(productId, this.items.length);
        return true;
    });
    next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
