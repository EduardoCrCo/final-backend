import React, { useState } from "react";
import { useVideoStats } from "../../../hooks/useVideoStats";
import "../../../blocks/videoStatsTable.css";

// Componente para manejar thumbnails con fallback
const VideoThumbnail = ({ video, isMobile = false }) => {
  const [imageError, setImageError] = useState(false);

  const thumbnailClass = isMobile
    ? "video-stats__card-thumbnail"
    : "video-stats__thumbnail";
  const placeholderClass = isMobile
    ? "video-stats__card-thumbnail video-stats__card-thumbnail--placeholder"
    : "video-stats__thumbnail video-stats__thumbnail--placeholder";

  if (!video.thumbnail || imageError) {
    return <div className={placeholderClass}>🎬</div>;
  }

  return (
    <img
      src={video.thumbnail}
      alt={video.title}
      className={thumbnailClass}
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

  const formatRating = (rating) => {
    if (
      rating === null ||
      rating === undefined ||
      isNaN(rating) ||
      rating === 0
    ) {
      return "0.0";
    }
    return typeof rating === "number" ? rating.toFixed(1) : "0.0";
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return "Sin rating";

    const validRating = typeof rating === "number" ? rating : 0;
    const stars =
      "★".repeat(Math.floor(validRating)) +
      "☆".repeat(5 - Math.floor(validRating));
    return (
      <div className="video-stats__rating">
        <span className="video-stats__stars">{stars}</span>
        <span className="video-stats__rating-text">
          {formatRating(validRating)}
        </span>
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
              {formatRating(globalStats.averageRating)}
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
        <>
          {/* Desktop Table */}
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

          {/* Mobile Card Layout */}
          <div className="video-stats__mobile-cards">
            {videosStats.map((video, index) => {
              const uniqueKey =
                video._id || video.youtubeId || `video-${index}`;

              return (
                <div key={uniqueKey} className="video-stats__mobile-card">
                  {/* Card Header with Video Info */}
                  <div className="video-stats__card-header">
                    <VideoThumbnail video={video} isMobile={true} />
                    <div className="video-stats__card-info">
                      <h4
                        className="video-stats__card-title"
                        title={video.title}
                      >
                        {video.title || "Sin título"}
                      </h4>
                      <p className="video-stats__card-id">{video.youtubeId}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="video-stats__card-stats">
                    <div className="video-stats__card-stat">
                      <span className="video-stats__card-stat-label">
                        Reviews
                      </span>
                      <span className="video-stats__card-stat-value">
                        💬 {video.reviewsCount || 0}
                      </span>
                    </div>
                    <div className="video-stats__card-stat">
                      <span className="video-stats__card-stat-label">
                        Likes
                      </span>
                      <span className="video-stats__card-stat-value">
                        ❤️ {video.likesCount || 0}
                      </span>
                    </div>
                    <div className="video-stats__card-stat">
                      <span className="video-stats__card-stat-label">
                        Playlists
                      </span>
                      <span className="video-stats__card-stat-value">
                        📋 {video.playlistsCount || 0}
                      </span>
                    </div>
                    <div className="video-stats__card-stat">
                      <span className="video-stats__card-stat-label">
                        Rating
                      </span>
                      <div className="video-stats__card-rating">
                        {video.averageRating &&
                        typeof video.averageRating === "number" ? (
                          <>
                            <span className="video-stats__card-stars">
                              {"★".repeat(Math.floor(video.averageRating))}
                              {"☆".repeat(5 - Math.floor(video.averageRating))}
                            </span>
                            <span className="video-stats__card-rating-text">
                              {formatRating(video.averageRating)}
                            </span>
                          </>
                        ) : (
                          <span className="video-stats__card-stat-value">
                            Sin rating
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  {video.duration && video.duration !== "N/A" && (
                    <div className="video-stats__card-duration">
                      ⏱️ {video.duration}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default VideoStatsTable;
