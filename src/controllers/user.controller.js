import User from "../models/user.model.js";
import { success, error } from "../utils/response.utils.js";

// GET /users — admin only
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return success(res, users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id — own profile or admin
export const getUserById = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id)
      return error(res, "Forbidden", 403);

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return error(res, "User not found", 404);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

// PUT /users/:id
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id)
      return error(res, "Forbidden", 403);

    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);

    // Assign fields manually so pre('save') hook runs for password hashing
    Object.assign(user, req.body);
    await user.save();

    const { password: _, ...userData } = user.toObject();
    return success(res, userData);
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id — admin only
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, { message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
