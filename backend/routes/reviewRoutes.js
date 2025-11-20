import express from "express";
import { celebrate, Joi } from "celebrate";
import {
  getUserReviews,
  getPublicReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
} from "../controllers/reviewController.js";

const router = express.Router();

// Validación para crear review (más permisiva)
const createReviewValidation = celebrate({
  body: Joi.object().keys({
    videoId: Joi.string().required(),
    videoTitle: Joi.string().required().min(1).max(200),
    videoThumbnail: Joi.string().allow("", null).optional(),
    channelName: Joi.string().allow("", null).optional().max(100),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required().min(10).max(1000),
    tags: Joi.array().items(Joi.string().max(30)).max(10).default([]),
    isPublic: Joi.boolean().default(true),
  }),
});

// Validación para actualizar review
const updateReviewValidation = celebrate({
  body: Joi.object()
    .keys({
      rating: Joi.number().integer().min(1).max(5).optional(),
      title: Joi.string().min(3).max(100).optional(),
      content: Joi.string().min(10).max(1000).optional(),
      tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
      isPublic: Joi.boolean().optional(),
    })
    .min(1), // Al menos un campo debe estar presente
});

// Validación para parámetros de ID
const idValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

// Validación para query parameters de reviews públicas
const publicReviewsValidation = celebrate({
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(50).optional(),
    skip: Joi.number().integer().min(0).optional(),
    videoId: Joi.string().optional(),
  }),
});

// Rutas que requieren autenticación
router.get("/", getUserReviews);
router.get("/stats", getReviewStats);
router.get("/:id", idValidation, getReviewById);
router.post("/", createReviewValidation, createReview);
router.put("/:id", idValidation, updateReviewValidation, updateReview);
router.delete("/:id", idValidation, deleteReview);

export default router;
