export const ReviewsList = ({ reviews, onDeleteReview, currentUser }) => {
  // Debug: ver la estructura de los reviews
  console.log("Reviews en ReviewsList:", reviews);
  console.log("Current User:", currentUser);

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
    <ul className="mt-6 space-y-4 w-full max-w-2xl mx-auto">
      {reviews.length === 0 ? (
        <li className="text-gray-400 italic">No hay comentarios aún.</li>
      ) : (
        Object.entries(groupedReviews).map(([videoId, group]) => (
          <li key={videoId} className="bg-gray-100 p-4 rounded-lg">
            {/* Header del video con thumbnail y título */}
            <div className="flex items-center mb-3">
              {group.videoInfo.thumbnail && (
                <img
                  src={group.videoInfo.thumbnail}
                  alt={group.videoInfo.title}
                  className="w-16 h-12 object-cover rounded mr-3"
                />
              )}
              <strong className="text-blue-600 text-lg">
                {group.videoInfo.title || "Video sin título"}
              </strong>
            </div>

            {/* Lista de reviews para este video */}
            <div className="space-y-3 ml-0">
              {group.reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="bg-white p-3 rounded border-l-4 border-blue-400 relative"
                >
                  {/* Título de la review */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {review.title}
                    </h4>
                  )}

                  {/* Rating con estrellas */}
                  {review.rating && (
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-1">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({review.rating}/5)
                      </span>
                    </div>
                  )}

                  {/* Contenido de la review */}
                  <p className="text-gray-800 mb-2 pr-8">
                    {review.content || review.text}
                  </p>

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {review.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>
                        Por:{" "}
                        {review.userId?.name || review.userName || "Anónimo"}
                      </span>
                      {review.createdAt && (
                        <span className="ml-2">
                          - {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      {review.isPublic === false && (
                        <span className="ml-2 text-orange-600 font-medium">
                          (Privada)
                        </span>
                      )}
                    </div>
                    {/* Botón eliminar - solo visible para el autor del review */}
                    {currentUser &&
                      (currentUser._id === review.userId?._id ||
                        currentUser._id === review.userId ||
                        currentUser.id === review.userId ||
                        currentUser.isAdmin) && (
                        <button
                          onClick={() =>
                            onDeleteReview(review._id || review.id)
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                          title="Eliminar review"
                        >
                          ✕
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
