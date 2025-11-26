import Video from "../models/videosModel.js";
import Review from "../models/reviewModel.js";
import Playlist from "../models/playlistModel.js";
import { searchYouTube, getVideoDetails } from "../services/youtubeApi.js";
import handleFailError from "../utils/handleErrors.js";

export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate("owner", "name email")
      .lean();

    const formattedVideos = videos.map((video) => ({
      id: video.youtubeId,
      title: video.title,
      type: "youtube",
      _id: video._id,
      liked: false,
      video: {
        videoId: video.youtubeId,
        title: video.title,
        thumbnails: [
          { url: video.thumbnails.default },
          { url: video.thumbnails.medium },
          { url: video.thumbnails.high },
        ].filter((t) => t.url),
        channelName: video.channelTitle,
        description: video.description,
        duration: video.duration,
        publishedAt: video.publishedAt,
      },
      owner: video.owner,
      likesCount: video.likesCount || 0,
      savesCount: video.savesCount || 0,
      createdAt: video.createdAt,
    }));

    res.json({
      message: "Videos obtenidos exitosamente",
      count: formattedVideos.length,
      videos: formattedVideos,
    });
  } catch (error) {
    console.error("Backend: Error getting all videos:", error);
    next(error);
  }
};

export const searchVideos = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        message: "Parámetro 'q' de búsqueda es requerido",
      });
    }

    const results = await searchYouTube(q, 10);

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

    return res.json({
      message: "Búsqueda completada exitosamente",
      count: formattedResults.length,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Backend: Error in searchVideos controller:", error.message);

    if (error.message.includes("YouTube API")) {
      return res.status(502).json({
        message: `Error al conectar con YouTube: ${error.message}`,
      });
    }
    return next(error);
  }
};

export const findVideoByYoutubeId = async (req, res, next) => {
  try {
    const { youtubeId } = req.params;

    const video = await Video.findOne({ youtubeId }).orFail(handleFailError);

    res.json({
      message: "Video encontrado exitosamente",
      video,
    });
  } catch (error) {
    console.error("Backend: Error finding video:", error);
    next(error);
  }
};

export const likeVideo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const video = await Video.findById(id).orFail(handleFailError);

    const isAlreadyLiked = video.likes.includes(userId);

    if (isAlreadyLiked) {
      video.likes = video.likes.filter(
        (likeUserId) => !likeUserId.equals(userId)
      );
    } else {
      video.likes.push(userId);
    }

    video.likesCount = video.likes.length;
    await video.save();

    res.json(video);
  } catch (err) {
    console.error("Backend: Error processing like:", err);
    res.status(500).json({ message: "Error al dar like" });
  }
};

export const addVideoFromSearch = async (req, res) => {
  const { videoData } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    let videoDuration = "N/A";

    try {
      const videoDetails = await getVideoDetails(videoData.videoId);
      videoDuration = videoDetails.duration;
    } catch (durationError) {
      console.warn(
        "Backend: Could not get video duration:",
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

    const savedVideo = await Video.findOneAndUpdate(
      { youtubeId: videoData.videoId },
      videoToSave,
      { upsert: true, new: true }
    );

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

    return res.json(formattedVideo);
  } catch (err) {
    console.error("Backend: Error saving selected video:", err);
    return res
      .status(500)
      .json({ message: "Error al guardar el video seleccionado" });
  }
};

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

    return res.json(video);
  } catch (err) {
    return res.status(500).json({ message: "Error al guardar el video" });
  }
};

export const deleteVideoByYoutubeId = async (req, res) => {
  const { youtubeId } = req.params;
  const { userId } = req.user;

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    const video = await Video.findOne({ youtubeId });

    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    if (video.owner.toString() !== userId) {
      return res.status(403).json({
        message: "No tienes permisos para eliminar este video",
      });
    }

    const deletedReviews = await Review.deleteMany({ videoId: youtubeId });

    const playlistsUpdate = await Playlist.updateMany(
      { "videos.youtubeId": youtubeId },
      { $pull: { videos: { youtubeId } } }
    );

    await Video.findOneAndDelete({ youtubeId });

    return res.json({
      message: "Video eliminado correctamente",
      deletedVideoId: youtubeId,
      deletedReviews: deletedReviews.deletedCount,
      updatedPlaylists: playlistsUpdate.modifiedCount,
    });
  } catch (err) {
    console.error("Backend: Error deleting video:", err);
    return res.status(500).json({
      message: "Error al eliminar el video",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};
