import mongoose from "mongoose";
import Review from "../models/Review.js";

const buildCustomerName = (user) => {
  if (!user) return "Unknown Customer";

  return (
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown Customer"
  );
};

export const getAdminReviews = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const {
      search = "",
      status = "all",
      rating = "all",
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100,
    );

    const query = {};

    /*
     * STATUS FILTER
     *
     * Accept:
     * - all
     * - ""
     * - pending
     * - approved
     * - rejected
     */
    if (status && status !== "all") {
      const allowedStatuses = [
        "pending",
        "approved",
        "rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review status",
        });
      }

      query.moderationStatus = status;
    }

    /*
     * RATING FILTER
     *
     * Accept:
     * - all
     * - ""
     * - 1
     * - 2
     * - 3
     * - 4
     * - 5
     */
    if (rating && rating !== "all") {
      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid rating",
        });
      }

      query.rating = numericRating;
    }

    const reviews = await Review.find(query)
      .populate(
        "user",
        "name email phone firstName lastName",
      )
      .populate(
        "product",
        "name title slug images",
      )
      .populate("store", "name")
      .populate("order", "orderNumber")
      .sort({ createdAt: -1 })
      .lean();

    /*
     * SEARCH
     */
    const normalizedSearch = search.trim().toLowerCase();

    const filteredReviews = normalizedSearch
      ? reviews.filter((review) => {
          const customerName =
            buildCustomerName(review.user);

          const searchableText = [
            review._id?.toString(),
            customerName,
            review.user?.email,
            review.product?.name,
            review.product?.title,
            review.store?.name,
            review.comment,
            review.title,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch,
          );
        })
      : reviews;

    /*
     * PAGINATION
     */
    const total = filteredReviews.length;
    const pages = Math.ceil(total / perPage);

    const skip = (currentPage - 1) * perPage;

    const paginatedReviews = filteredReviews.slice(
      skip,
      skip + perPage,
    );

    /*
     * NORMALIZE DATA FOR FRONTEND
     */
    const data = paginatedReviews.map((review) => ({
      ...review,

      customer: buildCustomerName(review.user),

      email: review.user?.email || "",

      productName:
        review.product?.name ||
        review.product?.title ||
        "Unknown Product",

      vendor:
        review.store?.name ||
        "Unknown Store",

      status:
        review.moderationStatus ||
        "pending",

      date: review.createdAt,

      flagged: false,
    }));

    return res.status(200).json({
      success: true,

      data: {
        reviews: data,

        pagination: {
          page: currentPage,
          pages,
          total,
          limit: perPage,
        },
      },
    });
  } catch (error) {
    console.error(
      "getAdminReviews error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

export const getAdminReviewById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id)
      .populate("user", "name email phone firstName lastName")
      .populate("product", "name title slug images price")
      .populate("store", "name")
      .populate("order", "orderNumber")
      .populate("moderatedBy", "name email firstName lastName")
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...review,
        customer: buildCustomerName(review.user),
        email: review.user?.email || "",
        productName:
          review.product?.name ||
          review.product?.title ||
          "Unknown Product",
        vendor: review.store?.name || "Unknown Store",
        status: review.moderationStatus || "pending",
        date: review.createdAt,
        flagged: false,
      },
    });
  } catch (error) {
    console.error("getAdminReviewById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch review",
    });
  }
};

export const updateAdminReviewStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: pending, approved, rejected",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.moderationStatus = status;

    if (status === "pending") {
      review.moderatedAt = null;
      review.moderatedBy = null;
    } else {
      review.moderatedAt = new Date();
      review.moderatedBy = req.user._id;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      data: review,
    });
  } catch (error) {
    console.error("updateAdminReviewStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review status",
    });
  }
};