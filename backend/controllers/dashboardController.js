import User from "../models/usersModel.js";
import Playlist from "../models/playlistModel.js";
import Review from "../models/reviewModel.js";
import Video from "../models/videosModel.js";

// GET /dashboard/users-stats - Obtener estadísticas detalladas de todos los usuarios
export const getUsersStats = async (req, res) => {
  console.log("📊 Dashboard: Getting users statistics");

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // 1. Obtener todos los usuarios activos con información básica
    const users = await User.find({ isActive: true })
      .select("name email avatar createdAt lastLogin")
      .sort({ createdAt: -1 });

    console.log(`👥 Dashboard: Found ${users.length} active users`);

    // 2. Para cada usuario, obtener sus estadísticas
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        console.log(`🔍 Dashboard: Processing stats for user ${user.name}`);

        // Obtener playlists del usuario con conteo de videos
        const playlists = await Playlist.find({ userId: user._id })
          .select("name videos createdAt")
          .lean();

        // Procesar playlists para incluir conteo de videos
        const playlistsWithCounts = playlists.map((playlist) => ({
          id: playlist._id,
          name: playlist.name,
          videoCount: playlist.videos ? playlist.videos.length : 0,
          videos: playlist.videos || [],
          createdAt: playlist.createdAt,
        }));

        // Obtener reviews del usuario
        const reviews = await Review.find({ userId: user._id })
          .select("videoTitle videoId rating createdAt title content")
          .sort({ createdAt: -1 })
          .lean();

        // Obtener videos que posee el usuario (los que ha guardado)
        const ownedVideos = await Video.find({ owner: user._id })
          .select("youtubeId title channelTitle likesCount savesCount")
          .lean();

        // Calcular estadísticas agregadas
        const stats = {
          totalPlaylists: playlists.length,
          totalVideosInPlaylists: playlistsWithCounts.reduce(
            (sum, pl) => sum + pl.videoCount,
            0
          ),
          totalReviews: reviews.length,
          totalOwnedVideos: ownedVideos.length,
          averageRating:
            reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : 0,
        };

        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
          playlists: playlistsWithCounts,
          reviews: reviews.map((review) => ({
            id: review._id,
            videoTitle: review.videoTitle,
            videoId: review.videoId,
            rating: review.rating,
            title: review.title,
            content:
              review.content.substring(0, 100) +
              (review.content.length > 100 ? "..." : ""),
            createdAt: review.createdAt,
          })),
          ownedVideos: ownedVideos.map((video) => ({
            id: video._id,
            youtubeId: video.youtubeId,
            title: video.title,
            channelTitle: video.channelTitle,
            likesCount: video.likesCount || 0,
            savesCount: video.savesCount || 0,
          })),
          stats,
        };
      })
    );

    // 3. Calcular estadísticas globales
    const globalStats = {
      totalUsers: users.length,
      totalPlaylists: usersWithStats.reduce(
        (sum, u) => sum + u.stats.totalPlaylists,
        0
      ),
      totalReviews: usersWithStats.reduce(
        (sum, u) => sum + u.stats.totalReviews,
        0
      ),
      totalVideosInPlaylists: usersWithStats.reduce(
        (sum, u) => sum + u.stats.totalVideosInPlaylists,
        0
      ),
      totalOwnedVideos: usersWithStats.reduce(
        (sum, u) => sum + u.stats.totalOwnedVideos,
        0
      ),
    };

    console.log("✅ Dashboard: Users statistics compiled successfully");
    console.log("📈 Dashboard: Global stats:", globalStats);

    res.json({
      users: usersWithStats,
      globalStats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Dashboard: Error getting users statistics:", err);
    res.status(500).json({
      message: "Error al obtener estadísticas de usuarios",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};

// GET /dashboard/videos-stats - Obtener estadísticas detalladas de todos los videos
export const getVideosStats = async (req, res) => {
  console.log("🎬 Dashboard: Getting videos statistics");

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // 1. Obtener todos los videos con información del propietario
    const videos = await Video.find()
      .populate("owner", "name email avatar")
      .select(
        "youtubeId title description channelTitle publishedAt thumbnails duration likes likesCount savesCount createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    console.log(`🎥 Dashboard: Found ${videos.length} videos`);

    // 2. Para cada video, obtener estadísticas detalladas
    const videosWithStats = await Promise.all(
      videos.map(async (video, index) => {
        console.log(`🔍 Dashboard: Processing stats for video ${video.title}`);
        console.log(
          `⏱️ Dashboard: Video duration for "${video.title}": "${video.duration}"`
        );

        // Solo mostrar thumbnails para el primer video como ejemplo
        if (index === 0) {
          console.log(
            `🖼️ Dashboard: Video thumbnails sample:`,
            video.thumbnails
          );
        }

        // Obtener reviews del video
        const reviews = await Review.find({ videoId: video.youtubeId })
          .populate("userId", "name email")
          .select("userId rating title content createdAt")
          .sort({ createdAt: -1 })
          .lean();

        // Obtener playlists que contienen este video
        // Buscar playlists que contienen este video (por ID o título como fallback)

        const playlistsWithVideo = await Playlist.find({
          $or: [
            { "videos.youtubeId": video.youtubeId },
            { "videos.title": video.title },
          ],
        })
          .populate("userId", "name email")
          .select("userId name createdAt")
          .lean();

        if (playlistsWithVideo.length > 0) {
          console.log(
            `✅ Dashboard: Found ${
              playlistsWithVideo.length
            } playlists for "${video.title.substring(0, 30)}..."`
          );
        }

        // Calcular estadísticas
        const stats = {
          totalReviews: reviews.length,
          averageRating:
            reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : 0,
          totalLikes: video.likesCount || 0,
          totalSaves: video.savesCount || 0,
          totalInPlaylists: playlistsWithVideo.length,
          createdDaysAgo: Math.floor(
            (new Date() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24)
          ),
        };

        // Aplanar la estructura para que coincida con lo que espera el frontend
        return {
          _id: video._id,
          youtubeId: video.youtubeId,
          title: video.title,
          description: video.description || "",
          channelTitle: video.channelTitle,
          publishedAt: video.publishedAt,
          thumbnail:
            video.thumbnails?.high ||
            video.thumbnails?.medium ||
            video.thumbnails?.default ||
            `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
          duration: video.duration || "N/A",
          createdAt: video.createdAt,
          owner: video.owner,
          // Estadísticas mezcladas directamente
          reviewsCount: reviews.length,
          averageRating:
            reviews.length > 0
              ? parseFloat(
                  (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)
                )
              : 0,
          likesCount: video.likesCount || 0,
          savesCount: video.savesCount || 0,
          playlistsCount: playlistsWithVideo.length,
          createdDaysAgo: Math.floor(
            (new Date() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24)
          ),
          // Datos detallados para referencia (opcional)
          reviewsDetails: reviews.slice(0, 3).map((review) => ({
            id: review._id,
            user: review.userId,
            rating: review.rating,
            title: review.title,
            content:
              review.content.substring(0, 100) +
              (review.content.length > 100 ? "..." : ""),
            createdAt: review.createdAt,
          })),
          playlistsDetails: playlistsWithVideo.slice(0, 3).map((playlist) => ({
            id: playlist._id,
            name: playlist.name,
            user: playlist.userId,
            createdAt: playlist.createdAt,
          })),
        };
      })
    );

    // 3. Calcular estadísticas globales
    const totalReviews = videosWithStats.reduce(
      (sum, v) => sum + v.reviewsCount,
      0
    );
    const totalLikes = videosWithStats.reduce(
      (sum, v) => sum + v.likesCount,
      0
    );

    const globalStats = {
      totalVideos: videos.length,
      totalReviews,
      totalLikes,
      totalSaves: videosWithStats.reduce((sum, v) => sum + v.savesCount, 0),
      totalInPlaylists: videosWithStats.reduce(
        (sum, v) => sum + v.playlistsCount,
        0
      ),
      averageRating:
        totalReviews > 0
          ? parseFloat(
              (
                videosWithStats.reduce(
                  (sum, v) => sum + v.averageRating * v.reviewsCount,
                  0
                ) / totalReviews
              ).toFixed(1)
            )
          : 0,
      averageReviewsPerVideo:
        videos.length > 0
          ? parseFloat((totalReviews / videos.length).toFixed(1))
          : 0,
      mostReviewedVideo:
        videosWithStats.length > 0
          ? videosWithStats.reduce((prev, current) =>
              prev.reviewsCount > current.reviewsCount ? prev : current
            ).title
          : null,
      mostLikedVideo:
        videosWithStats.length > 0
          ? videosWithStats.reduce((prev, current) =>
              prev.likesCount > current.likesCount ? prev : current
            ).title
          : null,
    };

    console.log("✅ Dashboard: Videos statistics compiled successfully");
    console.log("📈 Dashboard: Global video stats:", globalStats);

    res.json({
      videos: videosWithStats,
      globalStats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Dashboard: Error getting videos statistics:", err);
    res.status(500).json({
      message: "Error al obtener estadísticas de videos",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};

// GET /dashboard/videos-stats/:videoId - Obtener estadísticas de un video específico
export const getVideoStatsById = async (req, res) => {
  const { videoId } = req.params;

  console.log("🎬 Dashboard: Getting stats for video:", videoId);

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // Buscar video por MongoDB _id o por youtubeId
    const video = await Video.findOne({
      $or: [{ _id: videoId }, { youtubeId: videoId }],
    })
      .populate("owner", "name email avatar")
      .lean();

    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    // Obtener estadísticas detalladas del video
    const reviews = await Review.find({ videoId: video.youtubeId })
      .populate("userId", "name email avatar")
      .select("userId rating title content createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const playlistsWithVideo = await Playlist.find({
      "videos.youtubeId": video.youtubeId,
    })
      .populate("userId", "name email avatar")
      .select("userId name createdAt")
      .lean();

    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
      totalLikes: video.likesCount || 0,
      totalSaves: video.savesCount || 0,
      totalInPlaylists: playlistsWithVideo.length,
      createdDaysAgo: Math.floor(
        (new Date() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24)
      ),
    };

    console.log("✅ Dashboard: Video statistics compiled for:", video.title);

    res.json({
      video: {
        id: video._id,
        youtubeId: video.youtubeId,
        title: video.title,
        description: video.description || "",
        channelTitle: video.channelTitle,
        publishedAt: video.publishedAt,
        thumbnails: video.thumbnails,
        createdAt: video.createdAt,
        owner: video.owner,
      },
      reviews: reviews.map((review) => ({
        id: review._id,
        user: review.userId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      })),
      playlists: playlistsWithVideo.map((playlist) => ({
        id: playlist._id,
        name: playlist.name,
        user: playlist.userId,
        createdAt: playlist.createdAt,
      })),
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Dashboard: Error getting video statistics:", err);
    res.status(500).json({
      message: "Error al obtener estadísticas del video",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};

// GET /dashboard/users-stats/:userId - Obtener estadísticas de un usuario específico
export const getUserStatsById = async (req, res) => {
  const { userId } = req.params;

  console.log("📊 Dashboard: Getting stats for user:", userId);

  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    // Verificar que el usuario existe
    const user = await User.findById(userId).select(
      "name email avatar createdAt lastLogin"
    );

    if (!user || !user.isActive) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener estadísticas detalladas del usuario
    const playlists = await Playlist.find({ userId })
      .select("name videos createdAt")
      .lean();

    const reviews = await Review.find({ userId })
      .select("videoTitle videoId rating createdAt title content")
      .sort({ createdAt: -1 })
      .lean();

    const ownedVideos = await Video.find({ owner: userId })
      .select("youtubeId title channelTitle likesCount savesCount")
      .lean();

    const playlistsWithCounts = playlists.map((playlist) => ({
      id: playlist._id,
      name: playlist.name,
      videoCount: playlist.videos ? playlist.videos.length : 0,
      videos: playlist.videos || [],
      createdAt: playlist.createdAt,
    }));

    const stats = {
      totalPlaylists: playlists.length,
      totalVideosInPlaylists: playlistsWithCounts.reduce(
        (sum, pl) => sum + pl.videoCount,
        0
      ),
      totalReviews: reviews.length,
      totalOwnedVideos: ownedVideos.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
    };

    console.log("✅ Dashboard: User statistics compiled for:", user.name);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      playlists: playlistsWithCounts,
      reviews: reviews.map((review) => ({
        id: review._id,
        videoTitle: review.videoTitle,
        videoId: review.videoId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      })),
      ownedVideos: ownedVideos.map((video) => ({
        id: video._id,
        youtubeId: video.youtubeId,
        title: video.title,
        channelTitle: video.channelTitle,
        likesCount: video.likesCount || 0,
        savesCount: video.savesCount || 0,
      })),
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Dashboard: Error getting user statistics:", err);
    res.status(500).json({
      message: "Error al obtener estadísticas del usuario",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
  }
};
