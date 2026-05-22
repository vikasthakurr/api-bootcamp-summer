import { verifyToken } from "../utils/jwt.utils.js";
import { error } from "../utils/response.utils.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return error(res, "Unauthorized", 401);

  try {
    const decoded = verifyToken(authHeader.split(" ")[1]);
    req.user = decoded;
    next();
  } catch {
    return error(res, "Invalid or expired token", 401);
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return error(res, "Forbidden", 403);
    next();
  };
