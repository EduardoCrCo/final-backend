export const ReviewsList = ({ reviews, onDeleteReview, currentUser }) => {
  const canDeleteReview = (review, user) => {
    if (!user || !review) return false;

    const currentUserId = user._id || user.id || user.userId;

    const reviewOwnerId =
      review.userId?._id ||
      review.userId?.id ||
      review.userId ||
      review.authorId;

    const isOwner = currentUserId === reviewOwnerId;

    const isAdmin = user.isAdmin || user.role === "admin";

    return isOwner || isAdmin;
  };

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

            <div className="reviews-list__reviews-container">
              {group.reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="reviews-list__review-card"
                >
                  {review.title && (
                    <h4 className="reviews-list__review-title">
                      {review.title}
                    </h4>
                  )}

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

                  <p className="reviews-list__content">
                    {review.content || review.text}
                  </p>

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
