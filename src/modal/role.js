import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user",
        unique: true,
    },
}, {
    timestamps: true
})
const Role = mongoose.model("Role", roleSchema);
export default Role;