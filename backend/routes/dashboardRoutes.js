import Router from "express";
import {
  getUsersStats,
  getUserStatsById,
  getVideosStats,
  getVideoStatsById,
} from "../controllers/dashboardController.js";

const router = Router();

router.get("/users-stats", getUsersStats);

router.get("/users-stats/:userId", getUserStatsById);

router.get("/videos-stats", getVideosStats);

router.get("/videos-stats/:videoId", getVideoStatsById);

export default router;
