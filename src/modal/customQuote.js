import mongoose from "mongoose";

const customQuoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    length: {
        type: Number,
        required: true,
        min: 0
    },
    width: {
        type: Number,
        required: true,
        min: 0
    },
    depth: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
});

const CustomQuote = mongoose.model("CustomQuote", customQuoteSchema);
export default CustomQuote;

