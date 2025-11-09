import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ReviewForm } from "../Reviews/ReviewForm/ReviewForm";
import { ReviewsList } from "./ReviewsList/ReviewsList";
import { Link } from "react-router-dom";

export const Reviews = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [reviews, setReviews] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("videoReviews")) || [];
    setReviews(savedReviews);

    // Verificar si hay un video seleccionado para review
    const videoForReview = localStorage.getItem("selectedVideoForReview");
    if (videoForReview) {
      const video = JSON.parse(videoForReview);
      setSelectedVideo(video);
      // Limpiar el localStorage después de usar el video
      localStorage.removeItem("selectedVideoForReview");
    }
  }, []);

  const handleAddReview = (review) => {
    // Debug: ver la estructura del selectedVideo
    console.log("selectedVideo:", selectedVideo);

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

    const newReview = {
      id: Date.now(),
      text: review, // El review viene como string desde ReviewForm
      videoId: selectedVideo?.videoId,
      videoTitle: selectedVideo?.title,
      videoThumbnail: thumbnail,
      userId: currentUser?.id,
      userName: currentUser?.name,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];
    localStorage.setItem("videoReviews", JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    setSelectedVideo(null); // Cerrar el formulario después de enviar
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);
    localStorage.setItem("videoReviews", JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

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
