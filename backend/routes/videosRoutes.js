import Router from "express";
import auth from "../middleware/auth.js";
import {
  getAllVideos,
  searchVideos,
  addVideoFromSearch,
  findVideoByYoutubeId,
  likeVideo,
  saveVideo,
  deleteVideoByYoutubeId,
} from "../controllers/videosController.js";

const router = Router();

router.get("/", getAllVideos);

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  return auth(req, res, (err) => {
    if (err) {
      req.user = null;
    }
    return next();
  });
};

router.get("/search", optionalAuth, searchVideos);

router.post("/add", auth, addVideoFromSearch);

router.get("/find/:youtubeId", auth, findVideoByYoutubeId);

router.post("/:id/like", auth, likeVideo);
router.post("/:id/save", auth, saveVideo);

router.delete("/:youtubeId", auth, deleteVideoByYoutubeId);

export default router;
