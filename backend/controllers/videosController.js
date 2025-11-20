import Video from "../models/videosModel.js";
import { searchYouTube } from "../services/youtubeApi.js";

// GET /youtube/search?q=drone
export const searchVideos = async (req, res) => {
  const { q } = req.query;

  try {
    const results = await searchYouTube(q, 10);

    // Guardar o actualizar en DB
    const videos = await Promise.all(
      results.map((video) =>
        Video.findOneAndUpdate(
          { youtubeId: video.youtubeId },
          {
            ...video,
            owner: req.user.userId, // 👈 TU TOKEN
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar videos" });
  }
};

// POST /youtube/:id/like
export const likeVideo = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const video = await Video.findById(id);

    if (!video) return res.status(404).json({ message: "Video no encontrado" });

    // Si ya está liked, no lo hacemos doble
    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
      video.likesCount = video.likes.length;
      await video.save();
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Error al dar like" });
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
