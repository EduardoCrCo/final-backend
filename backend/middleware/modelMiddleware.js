import { hashPassword, isPasswordModified } from "../services/hashService.js";

export const hashPasswordMiddleware = async function hashPasswordMiddleware(
  next
) {
  if (!isPasswordModified(this, "password")) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const updateTimestampMiddleware = function updateTimestampMiddleware() {
  this.set({ updatedAt: new Date() });
};
