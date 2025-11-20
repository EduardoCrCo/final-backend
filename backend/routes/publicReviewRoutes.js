import express from "express";
import { celebrate, Joi } from "celebrate";
import { getPublicReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Validación para query parameters de reviews públicas
const publicReviewsValidation = celebrate({
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(50).optional(),
    skip: Joi.number().integer().min(0).optional(),
    videoId: Joi.string().optional(),
  }),
});

// Ruta pública para obtener reviews públicas
router.get("/", publicReviewsValidation, getPublicReviews);

export default router;
