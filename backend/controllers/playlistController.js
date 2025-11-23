import Playlist from "../models/playlistModel.js";
import handleFailError from "../utils/handleErrors.js";

// Helper function para extraer videoId de thumbnails
const extractVideoId = (video) => {
  // Intentar diferentes campos para el ID del video
  if (video.youtubeId) return video.youtubeId;
  if (video.videoId) return video.videoId;
  if (video.id) return video.id;

  // Extraer de thumbnail URL si no tiene ID directo
  if (video.thumbnail) {
    const match = video.thumbnail.match(/\/vi\/([^/]+)\//);
    if (match) return match[1];
  }

  // Extraer de thumbnails array si existe (compatibilidad con formato anterior)
  if (video.thumbnails && video.thumbnails.length > 0) {
    const thumbnailUrl = video.thumbnails[0].url;
    const match = thumbnailUrl.match(/\/vi\/([^/]+)\//);
    return match ? match[1] : null;
  }

  return null;
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });

    res.json({
      message: "Playlists obtenidas exitosamente",
      count: playlists.length,
      playlists,
    });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { userId } = req.user;

    // Verificar si ya existe una playlist con el mismo nombre para este usuario
    const existingPlaylist = await Playlist.findOne({
      userId,
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case insensitive
    });

    if (existingPlaylist) {
      return res.status(409).json({
        message: "Ya existe una playlist con ese nombre",
      });
    }

    const playlist = await Playlist.create({
      userId,
      name,
      description: description || "",
      videos: [],
    });

    res.status(201).json({
      message: "Playlist creada exitosamente",
      playlist,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: messages,
      });
    }
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await Playlist.findOneAndDelete({ _id: id, userId }).orFail(
      handleFailError
    );

    res.json({ message: "Playlist eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const addVideoToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const video = req.body;

    const playlist = await Playlist.findOne({ _id: id, userId }).orFail(
      handleFailError
    );

    // Verificar si el video ya existe
    const newVideoId = extractVideoId(video);
    if (!newVideoId) {
      return res
        .status(400)
        .json({ message: "No se pudo identificar el videoId" });
    }

    const videoExists = playlist.videos.some((v) => {
      const existingVideoId = extractVideoId(v);
      return existingVideoId === newVideoId;
    });

    if (videoExists) {
      return res
        .status(400)
        .json({ message: "El video ya está en la playlist" });
    }

    playlist.videos.push(video);
    await playlist.save();

    res.json({
      message: "Video agregado correctamente",
      playlist,
      videoCount: playlist.videos.length,
    });
  } catch (error) {
    next(error);
  }
};

export const removeVideoFromPlaylist = async (req, res, next) => {
  try {
    const { id, videoId } = req.params;
    const { userId } = req.user;

    const playlist = await Playlist.findOne({ _id: id, userId }).orFail(
      handleFailError
    );

    const originalVideoCount = playlist.videos.length;
    playlist.videos = playlist.videos.filter((v) => {
      const existingVideoId = extractVideoId(v);
      return existingVideoId !== videoId;
    });

    // Verificar si se eliminó algún video
    if (playlist.videos.length === originalVideoCount) {
      return res.status(404).json({
        message: "Video no encontrado en la playlist",
      });
    }

    await playlist.save();

    res.json({
      message: "Video eliminado correctamente",
      playlist,
      videoCount: playlist.videos.length,
    });
  } catch (error) {
    next(error);
  }
};
