import { Router } from 'express'
import { signup, signin } from '../controllers/usersController.js'
import {
  signupValidation,
  signinValidation,
} from '../middleware/validation.js'

const router = Router()

// Rutas de autenticación
router.post('/signup', signupValidation, signup)
router.post('/signin', signinValidation, signin)

export default router
