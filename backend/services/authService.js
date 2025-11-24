import User from "../models/usersModel.js";
import { comparePassword } from "./hashService.js";
import { createAuthError } from "../utils/handleErrors.js";

/**
 * Servicio de autenticación
 * Maneja toda la lógica de login y credenciales
 */
class AuthService {
  /**
   * Encontrar usuario por credenciales y validar contraseña
   */
  static async findUserByCredentials(email, password) {
    // Buscar usuario activo con contraseña
    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user) {
      throw createAuthError("Email o contraseña incorrectos");
    }

    // Verificar contraseña
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw createAuthError("Email o contraseña incorrectos");
    }

    return user;
  }

  /**
   * Actualizar último login del usuario
   */
  static async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  /**
   * Verificar si un usuario existe por email
   */
  static async userExistsByEmail(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  /**
   * Verificar si un usuario está activo
   */
  static async isUserActive(userId) {
    const user = await User.findById(userId);
    return user?.isActive || false;
  }
}

export default AuthService;
