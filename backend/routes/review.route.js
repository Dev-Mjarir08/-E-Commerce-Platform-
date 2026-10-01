import { Router } from "express";

import {
  getAdminReviews,
  getAdminReviewById,
  updateAdminReviewStatus,
  getPublicReviews
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public: customer testimonials and product reviews
router.get("/", getPublicReviews);

router.use(protect);

router.get("/admin", getAdminReviews);

router.get("/admin/:id", getAdminReviewById);

router.patch("/admin/:id/status", updateAdminReviewStatus);

export default router;