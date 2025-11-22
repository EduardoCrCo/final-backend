import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las reviews públicas
  const loadAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar reviews públicas (más reviews por página)
      const data = await api.getPublicReviews(50, 0); // 50 reviews, desde el inicio
      console.log("📚 Public reviews loaded:", data);
      setReviews(data.reviews || data); // Adaptar según la estructura de respuesta
    } catch (err) {
      console.error("Error loading public reviews:", err);
      setError(err.message);
      toast.error("Error al cargar las reviews");
    } finally {
      setLoading(false);
    }
  };

  // Cargar reviews del usuario (mantener para compatibilidad)
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

  // Crear nueva review
  const createReview = async (reviewData) => {
    try {
      const response = await api.createReview(reviewData);
      setReviews((prev) => [response.review, ...prev]);
      toast.success("Review creada correctamente");
      return response.review;
    } catch (err) {
      console.error("Error creating review:", err);
      toast.error(err.message || "Error al crear la review");
      throw err;
    }
  };

  // Actualizar review
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

  // Eliminar review
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

  // Cargar todas las reviews al montar el hook
  useEffect(() => {
    loadAllReviews();
  }, []);

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
