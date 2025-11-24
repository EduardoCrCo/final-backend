import bcrypt from "bcryptjs";

/**
 * Servicio para operaciones de hashing
 * Separado del modelo para bajo acoplamiento
 */
// class HashService {
//   static async hashPassword(password, saltRounds = 12) {
//     const salt = await bcrypt.genSalt(saltRounds);
//     return await bcrypt.hash(password, salt);
//   }

//   static async comparePassword(plainPassword, hashedPassword) {
//     return await bcrypt.compare(plainPassword, hashedPassword);
//   }

//   static async isPasswordModified(document, field = "password") {
//     return document.isModified(field);
//   }
// }

// export default HashService;
export const hashPassword = async (password, saltRounds = 12) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const isPasswordModified = (document, field = "password") => {
  return document.isModified(field);
};
