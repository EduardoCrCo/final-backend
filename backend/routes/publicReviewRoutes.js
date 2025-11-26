import express from "express";
import { celebrate, Joi } from "celebrate";
import { getPublicReviews } from "../controllers/reviewController.js";

const router = express.Router();

const publicReviewsValidation = celebrate({
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(50).optional(),
    skip: Joi.number().integer().min(0).optional(),
    videoId: Joi.string().optional(),
  }),
});

router.get("/", publicReviewsValidation, getPublicReviews);

export default router;
