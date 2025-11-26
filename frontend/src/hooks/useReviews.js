import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { CurrentUserContext } from "../context/CurrentUserContext";

export const useReviews = (externalCurrentUser = null) => {
  // Usar currentUser externo si se proporciona, sino usar el del contexto
  const { currentUser: contextUser } = useContext(CurrentUserContext);
  const currentUser =
    externalCurrentUser !== null ? externalCurrentUser : contextUser;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  // Cargar todas las reviews (públicas + privadas del usuario si está logueado)
  const loadAllReviews = async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `🔄 [${timestamp}] Loading reviews for user:`,
      currentUser ? "logged in" : "anonymous"
    );

    setLoading(true);
    setError(null);
    setDebugInfo(`Loading at ${timestamp}`);

    try {
      if (currentUser && localStorage.getItem("jwt")) {
        console.log(`👤 [${timestamp}] User detected, loading user reviews...`);

        // Cargar TODAS las reviews del usuario (públicas + privadas)
        const userReviewsResponse = await api.getUserReviews();
        console.log(
          `📋 [${timestamp}] Raw user reviews response:`,
          userReviewsResponse
        );

        const userReviews =
          userReviewsResponse.reviews || userReviewsResponse || [];
        console.log(
          `👤 [${timestamp}] User reviews extracted:`,
          userReviews.length,
          userReviews
        );

        // Separar reviews privadas y públicas del usuario
        const privateReviews = userReviews.filter((review) => !review.isPublic);
        const userPublicReviews = userReviews.filter(
          (review) => review.isPublic
        );

        console.log(
          `🔒 [${timestamp}] Private reviews:`,
          privateReviews.length
        );
        console.log(
          `🌍 [${timestamp}] User public reviews:`,
          userPublicReviews.length
        );

        // Cargar reviews públicas de OTROS usuarios
        const publicResponse = await api.getPublicReviews(50, 0);
        const allPublicReviews = publicResponse.reviews || publicResponse || [];

        // Filtrar para evitar duplicar las reviews públicas del usuario actual
        const otherUsersPublicReviews = allPublicReviews.filter((review) => {
          const reviewUserId = review.userId?._id || review.userId;
          return reviewUserId !== currentUser._id;
        });

        console.log(
          `🌐 [${timestamp}] Other users public reviews:`,
          otherUsersPublicReviews.length
        );

        // ORDEN IMPORTANTE: privadas primero, luego públicas del usuario, luego de otros
        const finalReviews = [
          ...privateReviews,
          ...userPublicReviews,
          ...otherUsersPublicReviews,
        ];

        console.log(
          `✅ [${timestamp}] Final reviews array:`,
          finalReviews.length
        );
        console.log(
          `📊 [${timestamp}] Breakdown: ${privateReviews.length} private + ${userPublicReviews.length} user public + ${otherUsersPublicReviews.length} others public`
        );

        setReviews(finalReviews);
        setDebugInfo(
          `Loaded ${finalReviews.length} reviews (${privateReviews.length} private)`
        );
      } else {
        console.log(
          `🌍 [${timestamp}] No user or token, loading public reviews only`
        );

        // Solo reviews públicas para usuarios no logueados
        const publicResponse = await api.getPublicReviews(50, 0);
        const publicReviews = publicResponse.reviews || publicResponse || [];

        console.log(
          `📚 [${timestamp}] Public reviews loaded:`,
          publicReviews.length
        );
        setReviews(publicReviews);
        setDebugInfo(`Loaded ${publicReviews.length} public reviews`);
      }
    } catch (err) {
      console.error(`❌ [${timestamp}] Error loading reviews:`, err);
      setError(err.message);
      setDebugInfo(`Error: ${err.message}`);
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

      // Recargar todas las reviews para mantener sincronización
      // Esto asegura que tanto públicas como privadas se muestren correctamente
      await loadAllReviews();

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

  // Cargar reviews al montar el hook y cuando cambie el usuario
  useEffect(() => {
    // Solo cargar si currentUser está definido (no undefined)
    if (currentUser !== undefined) {
      loadAllReviews();
    }
  }, [currentUser]);

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
