import { Router } from "express";

import {
  getAdminReviews,
  getAdminReviewById,
  updateAdminReviewStatus,
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/admin", getAdminReviews);

router.get("/admin/:id", getAdminReviewById);

router.patch("/admin/:id/status", updateAdminReviewStatus);

export default router;