import Router from 'express'
import auth from '../middleware/auth.js'
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from '../controllers/playlistController.js'

const router = Router()

// Rutas básicas de playlists
router.get('/', auth, getUserPlaylists)
router.post('/', auth, createPlaylist)
router.delete('/:id', auth, deletePlaylist)

// Rutas para manejo de videos en playlists
router.post('/:id/add', auth, addVideoToPlaylist)
router.delete('/:id/remove/:videoId', auth, removeVideoFromPlaylist)

export default router
