import mongoose from "mongoose";
import Review from "../models/reviewModel.js";

export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const reviews = await Review.find({ userId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Reviews obtenidas exitosamente",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPublicReviews = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, videoId } = req.query;

    const filter = { isPublic: true };
    if (videoId) {
      filter.videoId = videoId;
    }

    const reviews = await Review.find(filter)
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10));

    const total = await Review.countDocuments(filter);

    return res.json({
      message: "Reviews públicas obtenidas exitosamente",
      reviews,
      total,
      hasMore: total > parseInt(skip, 10) + parseInt(limit, 10),
    });
  } catch (error) {
    console.error("Error obteniendo reviews públicas:", error);
    return next(error);
  }
};

export const getReviewById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const review = await Review.findOne({
      _id: id,
      $or: [{ userId }, { isPublic: true }],
    }).populate("userId", "name avatar");

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    return res.json(review);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la review" });
  }
};

export const createReview = async (req, res) => {
  const { userId } = req.user;

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

  if (!videoId || !videoTitle || !rating || !title || !content) {
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
      rating: parseInt(rating, 10),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags)
        ? tags.filter((tag) => tag.trim()).map((tag) => tag.trim())
        : [],
      isPublic,
    };

    const review = await Review.create(reviewData);

    await review.populate("userId", "name avatar");

    return res.status(201).json({
      message: "Review creada correctamente",
      review,
    });
  } catch (error) {
    console.error(" Error completo creando review:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe una review para este video",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: `Error de validación: ${validationErrors.join(", ")}`,
        errors: validationErrors,
      });
    }

    console.error("Error creando review:", error.message);
    return res
      .status(500)
      .json({ message: `Error al crear la review: ${error.message}` });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { rating, title, content, tags, isPublic } = req.body;

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
    if (rating !== undefined) updateData.rating = parseInt(rating, 10);
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

    return res.json({
      message: "Review actualizada correctamente",
      review,
    });
  } catch (error) {
    console.error("Error actualizando review:", error);
    return res.status(500).json({ message: "Error al actualizar la review" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const review = await Review.findOneAndDelete({ _id: id, userId });

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    return res.json({ message: "Review eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando review:", error);
    return res.status(500).json({ message: "Error al eliminar la review" });
  }
};

export const getReviewStats = async (req, res) => {
  const { userId } = req.user;

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

    result.averageRating = Math.round(result.averageRating * 100) / 100;

    return res.json(result);
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
