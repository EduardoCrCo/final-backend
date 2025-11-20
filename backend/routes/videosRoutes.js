import Router from "express";
import auth from "../middleware/auth.js";
import {
  searchVideos,
  likeVideo,
  saveVideo,
} from "../controllers/videosController.js";

//import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/search", auth, searchVideos);
router.post("/:id/like", auth, likeVideo);
router.post("/:id/save", auth, saveVideo);

export default router;
