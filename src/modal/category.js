import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    heading: {
        type: String,
        required: false
    },
    subheading: {
        type: String,
        required: false
    },
    subDescription: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;

