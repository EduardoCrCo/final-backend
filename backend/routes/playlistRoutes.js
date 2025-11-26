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
  removeVideoFromPlaylistValidation,
} from "../middleware/validation.js";

const router = Router();

router.get("/", getUserPlaylists);
router.post("/", createPlaylistValidation, createPlaylist);
router.delete("/:id", validateObjectId, deletePlaylist);

router.post(
  "/:id/add",
  validateObjectId,
  addVideoToPlaylistValidation,
  addVideoToPlaylist
);
router.delete(
  "/:id/remove/:videoId",
  removeVideoFromPlaylistValidation,
  removeVideoFromPlaylist
);

export default router;
