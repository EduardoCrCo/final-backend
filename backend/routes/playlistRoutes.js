import Router from "express";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlistController.js";
import {
  createPlaylistValidation,
  addVideoToPlaylistValidation,
  validateObjectId,
} from "../middleware/validation.js";

const router = Router();

// Rutas básicas de playlists
router.get("/", getUserPlaylists);
router.post("/", createPlaylistValidation, createPlaylist);
router.delete("/:id", validateObjectId, deletePlaylist);

// Rutas para manejo de videos en playlists
router.post(
  "/:id/add",
  validateObjectId,
  addVideoToPlaylistValidation,
  addVideoToPlaylist
);
router.delete(
  "/:id/remove/:videoId",
  validateObjectId,
  removeVideoFromPlaylist
);

export default router;
