import bcrypt from "bcryptjs";

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
