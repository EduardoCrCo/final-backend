import Review from "../models/reviewModel.js";
import mongoose from "mongoose";

// Obtener todas las reviews del usuario autenticado
export const getUserReviews = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reviews = await Review.find({ userId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error obteniendo reviews:", error);
    res.status(500).json({ message: "Error al obtener las reviews" });
  }
};

// Obtener reviews públicas (para exploración)
export const getPublicReviews = async (req, res) => {
  try {
    const { limit = 20, skip = 0, videoId } = req.query;

    let filter = { isPublic: true };
    if (videoId) {
      filter.videoId = videoId;
    }

    const reviews = await Review.find(filter)
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      total,
      hasMore: total > parseInt(skip) + parseInt(limit),
    });
  } catch (error) {
    console.error("Error obteniendo reviews públicas:", error);
    res.status(500).json({ message: "Error al obtener las reviews públicas" });
  }
};

// Obtener una review específica por ID
export const getReviewById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const review = await Review.findOne({
      _id: id,
      $or: [{ userId }, { isPublic: true }],
    }).populate("userId", "name avatar");

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error obteniendo review:", error);
    res.status(500).json({ message: "Error al obtener la review" });
  }
};

// Crear una nueva review
export const createReview = async (req, res) => {
  const userId = req.user.userId;

  // Log para debugging
  console.log("📝 Datos recibidos para crear review:", req.body);
  console.log("👤 Usuario ID:", userId);

  const {
    videoId,
    videoTitle,
    videoThumbnail,
    channelName,
    rating,
    title,
    content,
    tags = [],
    isPublic = true,
  } = req.body;

  // Validaciones básicas
  if (!videoId || !videoTitle || !rating || !title || !content) {
    console.log("❌ Validación fallida - campos faltantes:");
    console.log({
      videoId: !!videoId,
      videoTitle: !!videoTitle,
      rating: !!rating,
      title: !!title,
      content: !!content,
    });
    return res.status(400).json({
      message: "videoId, videoTitle, rating, title y content son requeridos",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "El rating debe estar entre 1 y 5",
    });
  }

  if (title.length < 3 || title.length > 100) {
    return res.status(400).json({
      message: "El título debe tener entre 3 y 100 caracteres",
    });
  }

  if (content.length < 10 || content.length > 1000) {
    return res.status(400).json({
      message: "El contenido debe tener entre 10 y 1000 caracteres",
    });
  }

  try {
    const reviewData = {
      userId,
      videoId,
      videoTitle,
      videoThumbnail,
      channelName,
      rating: parseInt(rating),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags)
        ? tags.filter((tag) => tag.trim()).map((tag) => tag.trim())
        : [],
      isPublic,
    };

    console.log("📋 Datos preparados para guardar:", reviewData);

    const review = await Review.create(reviewData);
    console.log("✅ Review creada exitosamente:", review._id);

    // Poblar la información del usuario antes de enviar respuesta
    await review.populate("userId", "name avatar");

    res.status(201).json({
      message: "Review creada correctamente",
      review,
    });
  } catch (error) {
    console.error("❌ Error completo creando review:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe una review para este video",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("💥 Errores de validación:", validationErrors);
      return res.status(400).json({
        message: "Error de validación: " + validationErrors.join(", "),
        errors: validationErrors,
      });
    }

    console.error("Error creando review:", error.message);
    res
      .status(500)
      .json({ message: "Error al crear la review: " + error.message });
  }
};

// Actualizar una review existente
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { rating, title, content, tags, isPublic } = req.body;

  // Validaciones
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      message: "El rating debe estar entre 1 y 5",
    });
  }

  if (title && (title.length < 3 || title.length > 100)) {
    return res.status(400).json({
      message: "El título debe tener entre 3 y 100 caracteres",
    });
  }

  if (content && (content.length < 10 || content.length > 1000)) {
    return res.status(400).json({
      message: "El contenido debe tener entre 10 y 1000 caracteres",
    });
  }

  try {
    const updateData = {};
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags)
        ? tags.filter((tag) => tag.trim()).map((tag) => tag.trim())
        : [];
    }
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const review = await Review.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "name avatar");

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    res.json({
      message: "Review actualizada correctamente",
      review,
    });
  } catch (error) {
    console.error("Error actualizando review:", error);
    res.status(500).json({ message: "Error al actualizar la review" });
  }
};

// Eliminar una review
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const review = await Review.findOneAndDelete({ _id: id, userId });

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    res.json({ message: "Review eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando review:", error);
    res.status(500).json({ message: "Error al eliminar la review" });
  }
};

// Obtener estadísticas de reviews del usuario
export const getReviewStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    const stats = await Review.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          publicReviews: {
            $sum: { $cond: ["$isPublic", 1, 0] },
          },
          privateReviews: {
            $sum: { $cond: ["$isPublic", 0, 1] },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      publicReviews: 0,
      privateReviews: 0,
    };

    // Redondear el promedio a 2 decimales
    result.averageRating = Math.round(result.averageRating * 100) / 100;

    res.json(result);
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
