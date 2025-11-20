import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ReviewForm } from "../Reviews/ReviewForm/ReviewForm";
import { ReviewsList } from "./ReviewsList/ReviewsList";
import { Link } from "react-router-dom";
import { useReviews } from "../../hooks/useReviews";

export const Reviews = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const {
    reviews,
    loading,
    error,
    createReview,
    deleteReview: deleteReviewApi,
  } = useReviews();
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Verificar si hay un video seleccionado para review
    const videoForReview = localStorage.getItem("selectedVideoForReview");
    if (videoForReview) {
      const video = JSON.parse(videoForReview);
      setSelectedVideo(video);
      // Limpiar el localStorage después de usar el video
      localStorage.removeItem("selectedVideoForReview");
    }
  }, []);

  const handleAddReview = async (reviewData) => {
    try {
      // Obtener thumbnail de diferentes formas posibles
      let thumbnail = null;
      if (selectedVideo?.thumbnails) {
        if (Array.isArray(selectedVideo.thumbnails)) {
          thumbnail =
            selectedVideo.thumbnails[0]?.url || selectedVideo.thumbnails[0];
        } else if (selectedVideo.thumbnails.default) {
          thumbnail = selectedVideo.thumbnails.default.url;
        } else if (selectedVideo.thumbnails.medium) {
          thumbnail = selectedVideo.thumbnails.medium.url;
        }
      }

      const reviewPayload = {
        videoId: selectedVideo?.videoId || "temp-video-id", // Temporal para prueba
        videoTitle: selectedVideo?.title || "Video sin título",
        videoThumbnail: thumbnail || "",
        channelName:
          selectedVideo?.channelName || selectedVideo?.channelTitle || "",
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content || reviewData.text, // Compatibilidad con formato anterior
        tags: reviewData.tags || [],
        isPublic:
          reviewData.isPublic !== undefined ? reviewData.isPublic : true,
      };

      console.log("📤 Enviando review payload:", reviewPayload);
      await createReview(reviewPayload);
      setSelectedVideo(null); // Cerrar el formulario después de enviar
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewApi(reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Debug logs
  console.log("🔍 Reviews component state:", {
    reviewsCount: reviews.length,
    loading,
    error,
    currentUser: currentUser ? "logged in" : "not logged in",
  });
  console.log("📋 Reviews data:", reviews);

  if (loading) {
    return (
      <div className="reviews">
        <div className="reviews__loading">
          <p>Cargando reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews">
      <div className="reviews__header">
        <h2 className="reviews__title space-y-30 p-10">Video Reviews</h2>
        {currentUser && (
          <button
            className="reviews__add-review-button"
            onClick={() => setSelectedVideo({})}
          >
            Add Review
          </button>
        )}
      </div>

      {error && (
        <div className="reviews__error">
          <p>Error: {error}</p>
        </div>
      )}

      <ReviewsList
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
        currentUser={currentUser}
      />

      {selectedVideo && (
        <ReviewForm
          onAddReview={handleAddReview}
          onClose={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      )}

      <Link to="/" className="block mt-4 text-blue-200 underline">
        Go to Home
      </Link>
    </div>
  );
};
