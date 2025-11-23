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

// Rutas de usuarios protegidas

// Obtener información del usuario actual
router.get("/me", getCurrentUser);

// Actualizar perfil del usuario actual
router.patch("/me", updateProfileValidation, updateProfile);

// Actualizar avatar del usuario actual
router.patch("/me/avatar", updateAvatarValidation, updateAvatar);

// Desactivar cuenta del usuario actual
router.delete("/me", deactivateAccount);

// Obtener todos los usuarios (para funciones administrativas)
router.get("/", getAllUsers);

export default router;
