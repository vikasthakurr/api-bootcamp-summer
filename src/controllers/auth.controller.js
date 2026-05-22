import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.utils.js";
import { success, error } from "../utils/response.utils.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return error(res, "Email already registered", 409);

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, role: user.role });

    return success(res, { token, user: { id: user._id, name, email } }, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return error(res, "Invalid credentials", 401);

    const token = signToken({ id: user._id, role: user.role });
    return success(res, { token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    next(err);
  }
};
