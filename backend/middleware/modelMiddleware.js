import { hashPassword, isPasswordModified } from "../services/hashService.js";

/**
 * Middleware para hashear contraseñas automáticamente
 * Separado del modelo para mejor separación de responsabilidades
 */
export const hashPasswordMiddleware = async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!isPasswordModified(this, "password")) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para actualizar updatedAt
 */
export const updateTimestampMiddleware = function () {
  this.set({ updatedAt: new Date() });
};
