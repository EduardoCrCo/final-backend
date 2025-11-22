import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getAllUsers,
  deactivateAccount,
} from "../controllers/users.js";

const router = Router();

// Validación para URL
const urlValidation = Joi.string().uri().messages({
  "string.uri": "Debe ser una URL válida",
});

// Validación para actualizar perfil
const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede tener más de 30 caracteres",
    }),
    about: Joi.string().allow("").max(200).messages({
      "string.max": "La descripción no puede tener más de 200 caracteres",
    }),
  }),
});

// Validación para actualizar avatar
const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: urlValidation.required().messages({
      "any.required": "La URL del avatar es requerida",
    }),
  }),
});

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
