import Router from 'express'
import auth from '../middleware/auth.js'
import {
  getUsersStats,
  getUserStatsById,
  getVideosStats,
  getVideoStatsById,
} from '../controllers/dashboardController.js'

const router = Router()

// Las rutas ya tienen autenticación aplicada en app.js, no necesitamos duplicarla

// GET /dashboard/users-stats - Obtener estadísticas de todos los usuarios
router.get('/users-stats', getUsersStats)

// GET /dashboard/users-stats/:userId - Obtener estadísticas de un usuario específico
router.get('/users-stats/:userId', getUserStatsById)

// GET /dashboard/videos-stats - Obtener estadísticas de todos los videos
router.get('/videos-stats', getVideosStats)

// GET /dashboard/videos-stats/:videoId - Obtener estadísticas de un video específico
router.get('/videos-stats/:videoId', getVideoStatsById)

export default router
