import { useUserStats } from "../../../hooks/useUserStats";
import "../../../blocks/UserStatsTable.css";

export const UserStatsTable = () => {
  const { usersStats, globalStats, loading, error, lastUpdated, refreshStats } =
    useUserStats();

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
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
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`user-stats-table__star ${
            i <= fullStars ? "" : "user-stats-table__star--empty"
          }`}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  const renderUserInfo = (user) => (
    <div className="user-stats-table__user-info">
      <img
        src={user.avatar}
        alt={user.name}
        className="user-stats-table__user-avatar"
        onError={(e) => {
          e.target.src =
            "https://e7.pngegg.com/pngimages/487/879/png-clipart-computer-icons-question-mark-question-miscellaneous-blue.png";
        }}
      />
      <div className="user-stats-table__user-details">
        <p className="user-stats-table__user-name">{user.name}</p>
        <p className="user-stats-table__user-email">{user.email}</p>
      </div>
    </div>
  );

  const renderPlaylists = (playlists) => {
    if (playlists.length === 0) {
      return (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          Sin playlists
        </span>
      );
    }

    return (
      <div className="user-stats-table__playlists-info">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="user-stats-table__playlist-item">
            <p className="user-stats-table__playlist-name">{playlist.name}</p>
            <span className="user-stats-table__playlist-count">
              {playlist.videoCount} video{playlist.videoCount !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderReviews = (reviews) => {
    if (reviews.length === 0) {
      return (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          Sin reseñas
        </span>
      );
    }

    return (
      <div className="user-stats-table__reviews-info">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="user-stats-table__review-item">
            <p className="user-stats-table__review-title">
              {review.videoTitle}
            </p>
            <div className="user-stats-table__review-rating">
              {renderStars(review.rating)}
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                {review.rating}/5
              </span>
            </div>
          </div>
        ))}
        {reviews.length > 3 && (
          <div
            style={{
              textAlign: "center",
              padding: "6px",
              color: "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            +{reviews.length - 3} más
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="user-stats-table">
        <div className="user-stats-table__empty-state">
          <span className="user-stats-table__empty-icon">⚠️</span>
          <div className="user-stats-table__empty-message">
            Error al cargar estadísticas
          </div>
          <div className="user-stats-table__empty-submessage">{error}</div>
          <button
            onClick={refreshStats}
            className="user-stats-table__refresh-btn"
            style={{ marginTop: "16px" }}
          >
            🔄 Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`user-stats-table ${
        loading ? "user-stats-table--loading" : ""
      }`}
    >
      <div className="user-stats-table__header">
        <h2 className="user-stats-table__title">📊 Estadísticas de Usuarios</h2>
        <button
          onClick={refreshStats}
          disabled={loading}
          className="user-stats-table__refresh-btn"
        >
          🔄 {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      <div className="user-stats-table__stats-summary">
        <div className="user-stats-table__global-stats">
          <div className="user-stats-table__stat-item">
            <span className="user-stats-table__stat-number">
              {globalStats.totalUsers || 0}
            </span>
            <span className="user-stats-table__stat-label">Usuarios</span>
          </div>
          <div className="user-stats-table__stat-item">
            <span className="user-stats-table__stat-number">
              {globalStats.totalPlaylists || 0}
            </span>
            <span className="user-stats-table__stat-label">Playlists</span>
          </div>
          <div className="user-stats-table__stat-item">
            <span className="user-stats-table__stat-number">
              {globalStats.totalReviews || 0}
            </span>
            <span className="user-stats-table__stat-label">Reseñas</span>
          </div>
          <div className="user-stats-table__stat-item">
            <span className="user-stats-table__stat-number">
              {globalStats.totalVideosInPlaylists || 0}
            </span>
            <span className="user-stats-table__stat-label">
              Videos en Playlists
            </span>
          </div>
        </div>
        {lastUpdated && (
          <div
            style={{
              textAlign: "right",
              marginTop: "12px",
              fontSize: "0.8rem",
              color: "#64748b",
            }}
          >
            Última actualización: {formatDate(lastUpdated)}
          </div>
        )}
      </div>

      <div className="user-stats-table__container">
        {usersStats.length === 0 && !loading ? (
          <div className="user-stats-table__empty-state">
            <span className="user-stats-table__empty-icon">📭</span>
            <div className="user-stats-table__empty-message">
              No hay usuarios registrados
            </div>
            <div className="user-stats-table__empty-submessage">
              Los usuarios aparecerán aquí una vez que se registren
            </div>
          </div>
        ) : (
          <>
            <table className="user-stats-table__table">
              <thead className="user-stats-table__table-header">
                <tr>
                  <th className="user-stats-table__header-cell">Usuario</th>
                  <th className="user-stats-table__header-cell">Playlists</th>
                  <th className="user-stats-table__header-cell">Reseñas</th>
                  <th className="user-stats-table__header-cell">
                    Estadísticas
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersStats.map((userStat) => (
                  <tr
                    key={userStat.user.id}
                    className="user-stats-table__table-row"
                  >
                    <td className="user-stats-table__table-cell">
                      {renderUserInfo(userStat.user)}
                    </td>
                    <td className="user-stats-table__table-cell">
                      {renderPlaylists(userStat.playlists)}
                    </td>
                    <td className="user-stats-table__table-cell">
                      {renderReviews(userStat.reviews)}
                    </td>
                    <td className="user-stats-table__table-cell">
                      <div style={{ fontSize: "0.85rem", color: "#374151" }}>
                        <div>
                          📝 {userStat.stats.totalReviews} reseña
                          {userStat.stats.totalReviews !== 1 ? "s" : ""}
                        </div>
                        <div>
                          📋 {userStat.stats.totalPlaylists} playlist
                          {userStat.stats.totalPlaylists !== 1 ? "s" : ""}
                        </div>
                        <div>
                          🎬 {userStat.stats.totalVideosInPlaylists} videos
                        </div>
                        <div>
                          ⭐ Promedio:{" "}
                          {formatRating(userStat.stats.averageRating)}/5
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="user-stats-table__mobile-cards">
              {usersStats.map((userStat) => (
                <div
                  key={userStat.user.id}
                  className="user-stats-table__mobile-card"
                >
                  <div className="user-stats-table__card-header">
                    <img
                      src={userStat.user.avatar}
                      alt={userStat.user.name}
                      className="user-stats-table__card-avatar"
                      onError={(e) => {
                        e.target.src =
                          "https://e7.pngegg.com/pngimages/487/879/png-clipart-computer-icons-question-mark-question-miscellaneous-blue.png";
                      }}
                    />
                    <div className="user-stats-table__card-user-info">
                      <h4 className="user-stats-table__card-name">
                        {userStat.user.name}
                      </h4>
                      <p className="user-stats-table__card-email">
                        {userStat.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="user-stats-table__card-section">
                    <h5 className="user-stats-table__card-section-title">
                      📋 Playlists ({userStat.playlists.length})
                    </h5>
                    {userStat.playlists.length === 0 ? (
                      <div
                        style={{
                          color: "#94a3b8",
                          fontStyle: "italic",
                          fontSize: "0.85rem",
                        }}
                      >
                        Sin playlists
                      </div>
                    ) : (
                      <div className="user-stats-table__card-playlists">
                        {userStat.playlists.map((playlist) => (
                          <div
                            key={playlist.id}
                            className="user-stats-table__card-playlist"
                          >
                            <span className="user-stats-table__card-playlist-name">
                              {playlist.name}
                            </span>
                            <span className="user-stats-table__card-playlist-count">
                              {playlist.videoCount} video
                              {playlist.videoCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="user-stats-table__card-section">
                    <h5 className="user-stats-table__card-section-title">
                      💬 Reseñas ({userStat.reviews.length})
                    </h5>
                    {userStat.reviews.length === 0 ? (
                      <div
                        style={{
                          color: "#94a3b8",
                          fontStyle: "italic",
                          fontSize: "0.85rem",
                        }}
                      >
                        Sin reseñas
                      </div>
                    ) : (
                      <div className="user-stats-table__card-reviews">
                        {userStat.reviews.slice(0, 2).map((review) => (
                          <div
                            key={review.id}
                            className="user-stats-table__card-review"
                          >
                            <div className="user-stats-table__card-review-title">
                              {review.videoTitle}
                            </div>
                            <div className="user-stats-table__review-rating">
                              {renderStars(review.rating)}
                              <span
                                style={{
                                  marginLeft: "6px",
                                  fontSize: "0.7rem",
                                  color: "#6b7280",
                                }}
                              >
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        ))}
                        {userStat.reviews.length > 2 && (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "4px",
                              color: "#6b7280",
                              fontSize: "0.75rem",
                            }}
                          >
                            +{userStat.reviews.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="user-stats-table__card-section">
                    <h5 className="user-stats-table__card-section-title">
                      📊 Estadísticas
                    </h5>
                    <div className="user-stats-table__card-stats">
                      <div className="user-stats-table__card-stat-item">
                        <span className="user-stats-table__card-stat-number">
                          {userStat.stats.totalReviews}
                        </span>
                        <span className="user-stats-table__card-stat-label">
                          Reseñas
                        </span>
                      </div>
                      <div className="user-stats-table__card-stat-item">
                        <span className="user-stats-table__card-stat-number">
                          {userStat.stats.totalPlaylists}
                        </span>
                        <span className="user-stats-table__card-stat-label">
                          Playlists
                        </span>
                      </div>
                      <div className="user-stats-table__card-stat-item">
                        <span className="user-stats-table__card-stat-number">
                          {userStat.stats.totalVideosInPlaylists}
                        </span>
                        <span className="user-stats-table__card-stat-label">
                          Videos
                        </span>
                      </div>
                      <div className="user-stats-table__card-stat-item">
                        <span className="user-stats-table__card-stat-number">
                          {formatRating(userStat.stats.averageRating)}
                        </span>
                        <span className="user-stats-table__card-stat-label">
                          Rating
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="user-stats-table__loading-overlay">
          🔄 Cargando estadísticas...
        </div>
      )}
    </div>
  );
};
