import Video from "../models/videosModel.js";
import Review from "../models/reviewModel.js";
import Playlist from "../models/playlistModel.js";
import { searchYouTube, getVideoDetails } from "../services/youtubeApi.js";
import handleFailError from "../utils/handleErrors.js";

// GET /videos/search?q=drone
export const searchVideos = async (req, res, next) => {
  try {
    const { q } = req.query;

    console.log("🔍 Backend: Search request received:", {
      query: q,
      hasUser: !!req.user,
      userId: req.user?.userId,
      authHeader: !!req.headers.authorization,
    });

    if (!q || q.trim() === "") {
      return res.status(400).json({
        message: "Parámetro 'q' de búsqueda es requerido",
      });
    }

    console.log("📡 Backend: Calling YouTube API for query:", q);
    const results = await searchYouTube(q, 10);

    console.log("✅ Backend: YouTube API results:", results.length);

    const formattedResults = results.map((video) => ({
      id: video.videoId,
      title: video.title,
      type: "youtube",
      video: {
        videoId: video.videoId,
        title: video.title,
        thumbnails: video.thumbnails,
        channelName: video.channelName,
      },
    }));

    res.json({
      message: "Búsqueda completada exitosamente",
      count: formattedResults.length,
      results: formattedResults,
    });
  } catch (error) {
    console.error(
      "❌ Backend: Error in searchVideos controller:",
      error.message
    );

    if (error.message.includes("YouTube API")) {
      return res.status(502).json({
        message: `Error al conectar con YouTube: ${error.message}`,
      });
    }
    next(error);
  }
};

// GET /videos/find/:youtubeId - Buscar video por youtubeId
export const findVideoByYoutubeId = async (req, res, next) => {
  try {
    const { youtubeId } = req.params;

    console.log("🔍 Backend: Finding video by youtubeId:", youtubeId);

    const video = await Video.findOne({ youtubeId }).orFail(handleFailError);

    console.log("✅ Backend: Video found:", video._id);
    res.json({
      message: "Video encontrado exitosamente",
      video,
    });
  } catch (error) {
    console.error("❌ Backend: Error finding video:", error);
    next(error);
  }
};

// POST /videos/:id/like
export const likeVideo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    console.log(
      "💖 Backend: Processing like for video:",
      id,
      "by user:",
      userId
    );

    const video = await Video.findById(id).orFail(handleFailError);

    const isAlreadyLiked = video.likes.includes(userId);

    if (isAlreadyLiked) {
      // Remover like
      video.likes = video.likes.filter(
        (likeUserId) => !likeUserId.equals(userId)
      );
      console.log("👎 Backend: Like removed");
    } else {
      // Agregar like
      video.likes.push(userId);
      console.log("👍 Backend: Like added");
    }

    video.likesCount = video.likes.length;
    await video.save();

    console.log("✅ Backend: Video updated with", video.likesCount, "likes");
    res.json(video);
  } catch (err) {
    console.error("❌ Backend: Error processing like:", err);
    res.status(500).json({ message: "Error al dar like" });
  }
};

// POST /videos/add - Guardar video seleccionado desde búsqueda
export const addVideoFromSearch = async (req, res) => {
  const { videoData } = req.body;

  console.log("🎯 Backend: Adding selected video:", videoData.videoId);

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // Obtener detalles completos del video incluyendo duración
    console.log("📹 Backend: Getting video details for duration...");
    let videoDuration = "N/A";

    try {
      const videoDetails = await getVideoDetails(videoData.videoId);
      videoDuration = videoDetails.duration;
      console.log("⏱️ Backend: Video duration obtained:", videoDuration);
    } catch (durationError) {
      console.warn(
        "⚠️ Backend: Could not get video duration:",
        durationError.message
      );
    }

    const videoToSave = {
      youtubeId: videoData.videoId,
      title: videoData.title,
      description: videoData.description || "",
      channelTitle: videoData.channelName,
      publishedAt: videoData.publishedAt || new Date(),
      duration: videoDuration, // Agregar duración
      thumbnails: {
        default: videoData.thumbnails[0]?.url || "",
        medium:
          videoData.thumbnails[1]?.url || videoData.thumbnails[0]?.url || "",
        high:
          videoData.thumbnails[2]?.url ||
          videoData.thumbnails[1]?.url ||
          videoData.thumbnails[0]?.url ||
          "",
      },
      owner: req.user.userId,
    };

    console.log(
      "💾 Backend: Saving selected video to DB with duration:",
      videoDuration
    );

    const savedVideo = await Video.findOneAndUpdate(
      { youtubeId: videoData.videoId },
      videoToSave,
      { upsert: true, new: true }
    );

    console.log("✅ Backend: Selected video saved with ID:", savedVideo._id);
    console.log("⏱️ Backend: Saved video duration:", savedVideo.duration);

    // Devolver en formato que espera el frontend
    const formattedVideo = {
      id: savedVideo.youtubeId,
      title: savedVideo.title,
      type: "youtube",
      video: {
        videoId: savedVideo.youtubeId,
        title: savedVideo.title,
        thumbnails: [
          { url: savedVideo.thumbnails.default },
          { url: savedVideo.thumbnails.medium },
          { url: savedVideo.thumbnails.high },
        ],
        channelName: savedVideo.channelTitle,
      },
    };

    res.json(formattedVideo);
  } catch (err) {
    console.error("❌ Backend: Error saving selected video:", err);
    res.status(500).json({ message: "Error al guardar el video seleccionado" });
  }
};

// POST /youtube/:id/save
export const saveVideo = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const video = await Video.findById(id);

    if (!video) return res.status(404).json({ message: "Video no encontrado" });

    if (!video.savedBy.includes(userId)) {
      video.savedBy.push(userId);
      video.savesCount = video.savedBy.length;
      await video.save();
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Error al guardar el video" });
  }
};

// DELETE /videos/:youtubeId - Eliminar video por youtubeId
export const deleteVideoByYoutubeId = async (req, res) => {
  const { youtubeId } = req.params;
  const { userId } = req.user;

  console.log(`🗑️ Backend: Deleting video ${youtubeId} by user ${userId}`);

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // Buscar el video por youtubeId
    const video = await Video.findOne({ youtubeId });

    if (!video) {
      console.log("❌ Backend: Video not found:", youtubeId);
      return res.status(404).json({ message: "Video no encontrado" });
    }

    // Verificar si el usuario es el propietario del video
    if (video.owner.toString() !== userId) {
      console.log(
        `❌ Backend: User ${userId} is not owner of video ${youtubeId}`
      );
      return res.status(403).json({
        message: "No tienes permisos para eliminar este video",
      });
    }

    // Eliminar el video y todas sus referencias
    console.log(`🧹 Backend: Cleaning up related data for video ${youtubeId}`);

    // 1. Eliminar reviews del video
    const deletedReviews = await Review.deleteMany({ videoId: youtubeId });
    console.log(`📝 Backend: Deleted ${deletedReviews.deletedCount} reviews`);

    // 2. Eliminar video de playlists
    const playlistsUpdate = await Playlist.updateMany(
      { "videos.youtubeId": youtubeId },
      { $pull: { videos: { youtubeId } } }
    );
    console.log(
      `📋 Backend: Updated ${playlistsUpdate.modifiedCount} playlists`
    );

    // 3. Eliminar el video de la base de datos
    await Video.findOneAndDelete({ youtubeId });

    console.log(
      `✅ Backend: Video ${youtubeId} and all related data deleted successfully`
    );

    res.json({
      message: "Video eliminado correctamente",
      deletedVideoId: youtubeId,
      deletedReviews: deletedReviews.deletedCount,
      updatedPlaylists: playlistsUpdate.modifiedCount,
    });
  } catch (err) {
    console.error("❌ Backend: Error deleting video:", err);
    res.status(500).json({
      message: "Error al eliminar el video",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};
