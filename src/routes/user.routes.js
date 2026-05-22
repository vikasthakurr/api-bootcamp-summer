import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateUserSchema } from "../validators/user.validator.js";

const router = Router();

router.use(protect); // all user routes require auth

router.get("/", restrictTo("admin"), getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

export default router;
