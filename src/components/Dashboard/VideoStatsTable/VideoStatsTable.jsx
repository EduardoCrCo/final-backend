import React, { useState } from "react";
import { useVideoStats } from "../../../hooks/useVideoStats";
import "../../../blocks/videoStatsTable.css";

// Componente para manejar thumbnails con fallback
const VideoThumbnail = ({ video }) => {
  const [imageError, setImageError] = useState(false);

  if (!video.thumbnail || imageError) {
    return (
      <div className="video-stats__thumbnail video-stats__thumbnail--placeholder">
        🎬
      </div>
    );
  }

  return (
    <img
      src={video.thumbnail}
      alt={video.title}
      className="video-stats__thumbnail"
      onError={() => setImageError(true)}
    />
  );
};

function VideoStatsTable() {
  const {
    videosStats,
    globalStats,
    loading,
    error,
    lastUpdated,
    refreshStats,
  } = useVideoStats();

  const formatDate = (date) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return "Sin rating";

    const stars =
      "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
    return (
      <div className="video-stats__rating">
        <span className="video-stats__stars">{stars}</span>
        <span className="video-stats__rating-text">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const truncateTitle = (title, maxLength = 40) => {
    if (!title) return "Sin título";
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  if (loading && videosStats.length === 0) {
    return (
      <div className="video-stats">
        <div className="video-stats__loading">
          🔄 Cargando estadísticas de videos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-stats">
        <div className="video-stats__error">❌ Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="video-stats">
      <div className="video-stats__header">
        <h2 className="video-stats__title">Estadísticas de Videos</h2>
        <button
          className={`video-stats__refresh ${
            loading ? "video-stats__refresh--loading" : ""
          }`}
          onClick={refreshStats}
          disabled={loading}
        >
          {loading ? "🔄" : "↻"} Actualizar
        </button>
      </div>

      {/* Estadísticas Globales */}
      {globalStats && Object.keys(globalStats).length > 0 && (
        <div className="video-stats__global">
          <div className="video-stats__global-item">
            <span className="video-stats__global-number">
              {globalStats.totalVideos || 0}
            </span>
            <span className="video-stats__global-label">Total Videos</span>
          </div>
          <div className="video-stats__global-item">
            <span className="video-stats__global-number">
              {globalStats.totalReviews || 0}
            </span>
            <span className="video-stats__global-label">Total Reviews</span>
          </div>
          <div className="video-stats__global-item">
            <span className="video-stats__global-number">
              {globalStats.totalLikes || 0}
            </span>
            <span className="video-stats__global-label">Total Likes</span>
          </div>
          <div className="video-stats__global-item">
            <span className="video-stats__global-number">
              {globalStats.averageRating
                ? globalStats.averageRating.toFixed(1)
                : "0.0"}
            </span>
            <span className="video-stats__global-label">Rating Promedio</span>
          </div>
        </div>
      )}

      <div className="video-stats__info">
        <span className="video-stats__count">
          {videosStats.length} {videosStats.length === 1 ? "video" : "videos"}{" "}
          encontrados
        </span>
        <span className="video-stats__last-update">
          Última actualización: {formatDate(lastUpdated)}
        </span>
      </div>

      {videosStats.length === 0 ? (
        <div className="video-stats__no-data">
          📽️ No hay videos registrados en la base de datos
        </div>
      ) : (
        <table className="video-stats__table">
          <thead className="video-stats__thead">
            <tr>
              <th className="video-stats__th">Video</th>
              <th className="video-stats__th">Reviews</th>
              <th className="video-stats__th">Rating</th>
              <th className="video-stats__th">Likes</th>
              <th className="video-stats__th">En Playlists</th>
              <th className="video-stats__th">Duración</th>
            </tr>
          </thead>
          <tbody className="video-stats__tbody">
            {videosStats.map((video, index) => {
              const uniqueKey =
                video._id || video.youtubeId || `video-${index}`;
              return (
                <tr key={uniqueKey} className="video-stats__tr">
                  <td className="video-stats__td">
                    <div className="video-stats__video-info">
                      <VideoThumbnail video={video} />
                      <div className="video-stats__video-details">
                        <h4
                          className="video-stats__video-title"
                          title={video.title}
                        >
                          {truncateTitle(video.title)}
                        </h4>
                        <p className="video-stats__video-id">
                          {video.youtubeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="video-stats__td">
                    <span className="video-stats__badge video-stats__badge--reviews">
                      💬 {video.reviewsCount || 0}
                    </span>
                  </td>
                  <td className="video-stats__td">
                    {renderStars(video.averageRating)}
                  </td>
                  <td className="video-stats__td">
                    <span className="video-stats__badge video-stats__badge--likes">
                      ❤️ {video.likesCount || 0}
                    </span>
                  </td>
                  <td className="video-stats__td">
                    <span className="video-stats__badge video-stats__badge--playlists">
                      📋 {video.playlistsCount || 0}
                    </span>
                  </td>
                  <td className="video-stats__td">
                    {video.duration && video.duration !== "N/A"
                      ? video.duration
                      : "No disponible"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VideoStatsTable;
