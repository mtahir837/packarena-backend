import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["user", "admin"], default: "user",
        unique: true,
      },
  
})
const Role = mongoose.model("Role", userSchema);
export default Role;