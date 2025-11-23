import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import { signup, signin } from '../controllers/users.js'

const router = Router()

// Validación para registro
const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 30 caracteres',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'any.required': 'La contraseña es requerida',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'La descripción debe tener al menos 2 caracteres',
      'string.max': 'La descripción no puede tener más de 30 caracteres',
    }),
  }),
})

// Validación para inicio de sesión
const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),
    password: Joi.string().required().messages({
      'any.required': 'La contraseña es requerida',
    }),
  }),
})

// Rutas
router.post('/signup', signupValidation, signup)
router.post('/signin', signinValidation, signin)

export default router
