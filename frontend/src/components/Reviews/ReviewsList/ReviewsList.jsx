export const ReviewsList = ({ reviews, onDeleteReview, currentUser }) => {
  // Debug: ver la estructura de los reviews
  console.log("Reviews en ReviewsList:", reviews);
  console.log("Current User:", currentUser);

  // Función para verificar si el usuario puede eliminar un review
  const canDeleteReview = (review, user) => {
    if (!user || !review) return false;

    // Obtener el ID del usuario actual de forma robusta
    const currentUserId = user._id || user.id || user.userId;

    // Obtener el ID del propietario del review de forma robusta
    const reviewOwnerId =
      review.userId?._id ||
      review.userId?.id ||
      review.userId ||
      review.authorId;

    // Verificar si es el propietario
    const isOwner = currentUserId === reviewOwnerId;

    // Verificar si es admin (opcional)
    const isAdmin = user.isAdmin || user.role === "admin";

    console.log("🔐 Permission check:", {
      currentUserId,
      reviewOwnerId,
      isOwner,
      isAdmin,
      canDelete: isOwner || isAdmin,
    });

    return isOwner || isAdmin;
  };

  // Agrupar reviews por videoId
  const groupedReviews = reviews.reduce((acc, review) => {
    const videoId = review.videoId || "no-video";
    if (!acc[videoId]) {
      acc[videoId] = {
        videoInfo: {
          id: review.videoId,
          title: review.videoTitle,
          thumbnail: review.videoThumbnail,
        },
        reviews: [],
      };
    }
    acc[videoId].reviews.push(review);
    return acc;
  }, {});

  return (
    <ul className="reviews-list">
      {reviews.length === 0 ? (
        <li className="reviews-list__empty">No hay comentarios aún.</li>
      ) : (
        Object.entries(groupedReviews).map(([videoId, group]) => (
          <li key={videoId} className="reviews-list__video-group">
            {/* Header del video con thumbnail y título */}
            <div className="reviews-list__video-header">
              {group.videoInfo.thumbnail && (
                <img
                  src={group.videoInfo.thumbnail}
                  alt={group.videoInfo.title}
                  className="reviews-list__video-thumbnail"
                />
              )}
              <strong className="reviews-list__video-title">
                {group.videoInfo.title || "Video sin título"}
              </strong>
            </div>

            {/* Lista de reviews para este video */}
            <div className="reviews-list__reviews-container">
              {group.reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="reviews-list__review-card"
                >
                  {/* Título de la review */}
                  {review.title && (
                    <h4 className="reviews-list__review-title">
                      {review.title}
                    </h4>
                  )}

                  {/* Rating con estrellas */}
                  {review.rating && (
                    <div className="reviews-list__rating">
                      <span className="reviews-list__stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="reviews-list__rating-text">
                        ({review.rating}/5)
                      </span>
                    </div>
                  )}

                  {/* Contenido de la review */}
                  <p className="reviews-list__content">
                    {review.content || review.text}
                  </p>

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="reviews-list__tags">
                      {review.tags.map((tag, index) => (
                        <span key={index} className="reviews-list__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="reviews-list__footer">
                    <div className="reviews-list__meta">
                      <span className="reviews-list__author">
                        Por:{" "}
                        {review.userId?.name || review.userName || "Anónimo"}
                      </span>
                      {review.createdAt && (
                        <span className="reviews-list__date">
                          - {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      {review.isPublic === false && (
                        <span className="reviews-list__private-badge">
                          (Privada)
                        </span>
                      )}
                    </div>
                    {/* Botón eliminar - solo visible para el autor del review */}
                    {currentUser && canDeleteReview(review, currentUser) && (
                      <button
                        onClick={() => onDeleteReview(review._id || review.id)}
                        className="reviews-list__delete-button"
                        title="Eliminar review"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))
      )}
    </ul>
  );
};
