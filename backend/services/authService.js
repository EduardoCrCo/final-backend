import User from "../models/usersModel.js";
import { comparePassword } from "./hashService.js";
import { createAuthError } from "../utils/handleErrors.js";

class AuthService {
  static async findUserByCredentials(email, password) {
    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user) {
      throw createAuthError("Email o contraseña incorrectos");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw createAuthError("Email o contraseña incorrectos");
    }

    return user;
  }

  static async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  static async userExistsByEmail(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  static async isUserActive(userId) {
    const user = await User.findById(userId);
    return user?.isActive || false;
  }
}

export default AuthService;
