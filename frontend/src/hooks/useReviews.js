import { useState, useEffect, useContext, useCallback } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { CurrentUserContext } from "../context/CurrentUserContext";

export const useReviews = (externalCurrentUser = null) => {
  const { currentUser: contextUser } = useContext(CurrentUserContext);
  const currentUser =
    externalCurrentUser !== null ? externalCurrentUser : contextUser;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setDebugInfo] = useState("");

  const loadAllReviews = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();

    setLoading(true);
    setError(null);
    setDebugInfo(`Loading at ${timestamp}`);

    try {
      if (currentUser && localStorage.getItem("jwt")) {
        const userReviewsResponse = await api.getUserReviews();

        const userReviews =
          userReviewsResponse.reviews || userReviewsResponse || [];

        const privateReviews = userReviews.filter((review) => !review.isPublic);
        const userPublicReviews = userReviews.filter(
          (review) => review.isPublic
        );

        const publicResponse = await api.getPublicReviews(50, 0);
        const allPublicReviews = publicResponse.reviews || publicResponse || [];

        const otherUsersPublicReviews = allPublicReviews.filter((review) => {
          const reviewUserId = review.userId?._id || review.userId;
          return reviewUserId !== currentUser._id;
        });

        const finalReviews = [
          ...privateReviews,
          ...userPublicReviews,
          ...otherUsersPublicReviews,
        ];

        setReviews(finalReviews);
        setDebugInfo(
          `Loaded ${finalReviews.length} reviews (${privateReviews.length} private)`
        );
      } else {
        `[${timestamp}] No user or token, loading public reviews only`;

        const publicResponse = await api.getPublicReviews(50, 0);
        const publicReviews = publicResponse.reviews || publicResponse || [];

        setReviews(publicReviews);
        setDebugInfo(`Loaded ${publicReviews.length} public reviews`);
      }
    } catch (err) {
      console.error(`[${timestamp}] Error loading reviews:`, err);
      setError(err.message);
      setDebugInfo(`Error: ${err.message}`);
      toast.error("Error al cargar las reviews");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUserReviews();
      setReviews(data);
    } catch (err) {
      console.error("Error loading user reviews:", err);
      setError(err.message);
      toast.error("Error al cargar las reviews del usuario");
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData) => {
    try {
      const response = await api.createReview(reviewData);
      await loadAllReviews();
      toast.success("Review creada correctamente");
      return response.review;
    } catch (err) {
      console.error("Error creating review:", err);
      toast.error(err.message || "Error al crear la review");
      throw err;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      const response = await api.updateReview(reviewId, reviewData);
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? response.review : review
        )
      );
      toast.success("Review actualizada correctamente");
      return response.review;
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error(err.message || "Error al actualizar la review");
      throw err;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      toast.success("Review eliminada correctamente");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error(err.message || "Error al eliminar la review");
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser !== undefined) {
      loadAllReviews();
    }
  }, [currentUser, loadAllReviews]);

  return {
    reviews,
    loading,
    error,
    loadAllReviews,
    loadUserReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
