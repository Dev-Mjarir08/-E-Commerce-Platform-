import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  User,
  Mail,
  Package,
  Store,
  Calendar,
  Clock,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import adminApi from "../../../services/adminApi";
import { useToast } from "../../../context/ToastContext";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchReview = useCallback(async () => {
    try {
      setError("");
      const response = await adminApi.getAdminReviewById(id);
      setReview(response?.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load review.");
      setReview(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    adminApi.getAdminReviewById(id)
      .then((response) => {
        if (active) setReview(response?.data?.data || null);
      })
      .catch((err) => {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load review.");
          setReview(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);

      await adminApi.updateReviewStatus(id, { status });

      showToast(
        `Review ${
          status === "approved" ? "approved" : "rejected"
        } successfully.`,
        "success",
      );

      await fetchReview();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update review status.",
        "error",
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "pending":
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />;

      case "rejected":
        return <XCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={23}
            className={
              star <= numericRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw size={28} className="animate-spin text-gray-400" />

          <p className="mt-3 text-sm text-gray-500">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/reviews")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Reviews
        </button>

        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="text-center">
            <MessageSquare size={40} className="mx-auto text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Review Not Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {error || "The requested review could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/reviews")}
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  const customerName = review.customer || "Unknown Customer";
  const customerEmail = review.email || "—";
  const productName = review.productName || "Unknown Product";
  const vendorName = review.vendor || "Vendor not available";
  const status = review.status || "pending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/reviews")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Back to Reviews
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Review Details</h1>

          <p className="mt-1 text-sm text-gray-500">
            Review ID:{" "}
            <span className="font-medium text-gray-700">
              {review._id || review.id || "—"}
            </span>
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium capitalize ${getStatusStyles(
            status,
          )}`}
        >
          {getStatusIcon(status)}
          {status}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Review Content */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Customer Review
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Submitted on {formatDate(review.date || review.createdAt)}
                  </p>
                </div>

                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                    <CheckCircle size={14} />
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Rating */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Rating</p>

                <div className="flex items-center gap-3">
                  {renderStars(review.rating)}

                  <span className="text-sm font-semibold text-gray-700">
                    {review.rating || 0}/5
                  </span>
                </div>
              </div>

              {/* Title */}
              {review.title && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Review Title
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {review.title}
                  </h3>
                </div>
              )}

              {/* Comment */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Review</p>

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {review.comment || "No review comment provided."}
                  </p>
                </div>
              </div>

              {/* Images */}
              {Array.isArray(review.images) && review.images.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-500">
                    Review Images
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {review.images.map((image, index) => {
                      const imageUrl =
                        typeof image === "string" ? image : image?.url;

                      if (!imageUrl) {
                        return null;
                      }

                      return (
                        <a
                          key={image?.public_id || `${imageUrl}-${index}`}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                        >
                          <img
                            src={imageUrl}
                            alt={`Review image ${index + 1}`}
                            className="h-32 w-full object-cover transition duration-200 group-hover:scale-105"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer / Product Info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Customer</h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <User size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Name</p>

                  <p className="truncate font-medium text-gray-900">
                    {customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>

                  <p className="truncate font-medium text-gray-900">
                    {customerEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Product</h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <Package size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Product</p>

                  <p className="font-medium text-gray-900">{productName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <Store size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Vendor / Store</p>

                  <p className="font-medium text-gray-900">{vendorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <Calendar size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Submitted</p>

                  <p className="font-medium text-gray-900">
                    {formatDate(review.date || review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Moderation */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Moderation</h2>
            </div>

            <div className="p-5">
              <p className="mb-4 text-sm text-gray-500">
                Choose how this review should appear in the application.
              </p>

              <div className="flex flex-col gap-3">
                {status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus("approved")}
                    disabled={updating}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? (
                      <RefreshCw size={17} className="animate-spin" />
                    ) : (
                      <CheckCircle size={17} />
                    )}
                    Approve Review
                  </button>
                )}

                {status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => updateStatus("rejected")}
                    disabled={updating}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? (
                      <RefreshCw size={17} className="animate-spin" />
                    ) : (
                      <XCircle size={17} />
                    )}
                    Reject Review
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                Review Information
              </h2>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Created</span>

                <span className="text-right font-medium text-gray-700">
                  {formatDateTime(review.createdAt || review.date)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Updated</span>

                <span className="text-right font-medium text-gray-700">
                  {formatDateTime(review.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Status</span>

                <span className="font-medium capitalize text-gray-700">
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;