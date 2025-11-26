import { Router } from "express";
import {
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getAllUsers,
  deactivateAccount,
} from "../controllers/usersController.js";
import {
  updateProfileValidation,
  updateAvatarValidation,
} from "../middleware/validation.js";

const router = Router();

router.get("/me", getCurrentUser);

router.patch("/me", updateProfileValidation, updateProfile);

router.patch("/me/avatar", updateAvatarValidation, updateAvatar);

router.delete("/me", deactivateAccount);

router.get("/", getAllUsers);

export default router;
