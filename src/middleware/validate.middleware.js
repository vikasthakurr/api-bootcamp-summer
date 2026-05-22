import { error } from "../utils/response.utils.js";

// Zod validation middleware factory
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message).join(", ");
    return error(res, messages, 422);
  }
  req.body = result.data;
  next();
};
