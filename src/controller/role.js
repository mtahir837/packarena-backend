import Role from "../modal/role.js";

export const createRole = async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Role name is required" });
      }
      
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: "Role already exists" });
      }
      
      const createRole = new Role({ name });
      await createRole.save();
      res.status(201).json({ message: "Role created successfully", role: createRole });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error", error: error.message });
    }
  };

export const fetchRole = async (req, res) => {
  try {
    const findRole = await Role.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "roles fetched successfully", roles: findRole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const findRoleId = async (req, res) => {
  try {
    const findRole = await Role.findById(req.params.id);
    if (!findRole) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(200).json({ message: "role fetched successfully", role: findRole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const deleteRoleId = async (req, res) => {
  try {
    const findRole = await Role.findByIdAndDelete(req.params.id);
    if (!findRole) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(200).json({ message: "deleted successfully", role: findRole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateRoleId = async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedRole) {
      return res.status(404).json({ message: "role not found" });
    }
    
    res.status(200).json({ message: "updated role successfully", role: updatedRole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};




