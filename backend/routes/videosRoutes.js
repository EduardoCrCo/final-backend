import Router from 'express'
import auth from '../middleware/auth.js'
import {
  searchVideos,
  addVideoFromSearch,
  findVideoByYoutubeId,
  likeVideo,
  saveVideo,
  deleteVideoByYoutubeId,
} from '../controllers/videosController.js'

const router = Router()

// Middleware de autenticación opcional
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  // Si no hay header de autorización, continuar sin usuario
  if (!authHeader) {
    req.user = null
    return next()
  }

  // Si hay header, validarlo con el middleware de auth normal
  auth(req, res, (err) => {
    if (err) {
      // Si el token es inválido, continuar sin usuario
      req.user = null
    }
    next()
  })
}

// Búsqueda de videos con autenticación opcional
router.get('/search', optionalAuth, searchVideos)

// Agregar video seleccionado desde búsqueda (requiere autenticación)
router.post('/add', auth, addVideoFromSearch)

// Buscar video por youtubeId (requiere autenticación)
router.get('/find/:youtubeId', auth, findVideoByYoutubeId)

// Like y save videos (requiere autenticación)
router.post('/:id/like', auth, likeVideo)
router.post('/:id/save', auth, saveVideo)

// Eliminar video por youtubeId (requiere autenticación)
router.delete('/:youtubeId', auth, deleteVideoByYoutubeId)

export default router
