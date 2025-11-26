import bcrypt from 'bcryptjs'

export const hashPassword = async (password, saltRounds = 12) => {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}

export const comparePassword = (Password, hashedPassword) => bcrypt.compare(Password, hashedPassword)

export const isPasswordModified = (document, field = 'password') => document.isModified(field)
