import Video from "../models/videosModel.js";
import { searchYouTube } from "../services/youtubeApi.js";

// GET /videos/search?q=drone
export const searchVideos = async (req, res) => {
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

  try {
    console.log("📡 Backend: Calling YouTube API for query:", q);
    const results = await searchYouTube(q, 10);

    console.log("✅ Backend: YouTube API results:", results.length);

    // Para búsquedas, siempre devolver solo los resultados sin guardar automáticamente
    console.log("📋 Backend: Returning search results without auto-saving");

    const formattedResults = results.map((video) => ({
      id: video.videoId,
      title: video.title,
      type: "youtube",
      video: {
        videoId: video.videoId,
        title: video.title,
        thumbnails: video.thumbnails, // Mantener formato array para compatibilidad
        channelName: video.channelName,
      },
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("❌ Backend: Error in searchVideos controller:", err.message);
    console.error("📚 Backend: Full error:", err);

    if (err.message.includes("YouTube API")) {
      return res.status(500).json({
        message: "Error al conectar con YouTube: " + err.message,
      });
    } else {
      return res.status(500).json({
        message: "Error interno del servidor al buscar videos",
      });
    }
  }
};

// GET /videos/find/:youtubeId - Buscar video por youtubeId
export const findVideoByYoutubeId = async (req, res) => {
  const { youtubeId } = req.params;

  console.log("🔍 Backend: Finding video by youtubeId:", youtubeId);

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    const video = await Video.findOne({ youtubeId });

    if (!video) {
      console.log("❌ Backend: Video not found with youtubeId:", youtubeId);
      return res.status(404).json({ message: "Video no encontrado" });
    }

    console.log("✅ Backend: Video found:", video._id);
    res.json(video);
  } catch (err) {
    console.error("❌ Backend: Error finding video:", err);
    res.status(500).json({ message: "Error al buscar video" });
  }
};

// POST /videos/:id/like
export const likeVideo = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  console.log("💖 Backend: Processing like for video:", id, "by user:", userId);

  try {
    const video = await Video.findById(id);

    if (!video) {
      console.log("❌ Backend: Video not found with ID:", id);
      return res.status(404).json({ message: "Video no encontrado" });
    }

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
    const videoToSave = {
      youtubeId: videoData.videoId,
      title: videoData.title,
      description: videoData.description || "",
      channelTitle: videoData.channelName,
      publishedAt: videoData.publishedAt || new Date(),
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

    console.log("💾 Backend: Saving selected video to DB:", videoToSave);

    const savedVideo = await Video.findOneAndUpdate(
      { youtubeId: videoData.videoId },
      videoToSave,
      { upsert: true, new: true }
    );

    console.log("✅ Backend: Selected video saved with ID:", savedVideo._id);

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
  const userId = req.user.userId;
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
