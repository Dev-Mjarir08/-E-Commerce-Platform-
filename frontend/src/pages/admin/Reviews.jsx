import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

import adminApi from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";

const Reviews = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      setError("");

      const response = await adminApi.getAdminReviews({
        status: selectedStatus === "all" ? "" : selectedStatus,
        rating: selectedRating === "all" ? "" : selectedRating,
        page: 1,
        limit: 100,
      });

      const data = response?.data?.data;

      setReviews(data?.reviews || []);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load reviews.";

      setError(message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedRating]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchReviews();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return reviews;
    }

    return reviews.filter((review) => {
      return (
        review.customer?.toLowerCase().includes(search) ||
        review.email?.toLowerCase().includes(search) ||
        review.productName?.toLowerCase().includes(search) ||
        review.vendor?.toLowerCase().includes(search) ||
        review.comment?.toLowerCase().includes(search)
      );
    });
  }, [reviews, searchTerm]);

  const totalReviews = reviews.length;

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending",
  ).length;

  const approvedReviews = reviews.filter(
    (review) => review.status === "approved",
  ).length;

  const rejectedReviews = reviews.filter(
    (review) => review.status === "rejected",
  ).length;

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await adminApi.updateReviewStatus(id, { status });

      showToast(
        `Review ${
          status === "approved" ? "approved" : "rejected"
        } successfully.`,
        "success",
      );

      await fetchReviews();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update review status.",
        "error",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = async () => {
    await fetchReviews();
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
      month: "short",
      year: "numeric",
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
        return <CheckCircle size={14} />;

      case "rejected":
        return <XCircle size={14} />;

      case "pending":
      default:
        return <Clock size={14} />;
    }
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and moderate customer reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalReviews}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <MessageSquare size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {pendingReviews}
              </p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {approvedReviews}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {rejectedReviews}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <XCircle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, product, vendor or review..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Rating */}
          <div className="relative">
            <select
              value={selectedRating}
              onChange={(event) => setSelectedRating(event.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product / Vendor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rating
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Review
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw
                        size={24}
                        className="animate-spin text-gray-400"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        Loading reviews...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <MessageSquare
                      size={32}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No reviews found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  const reviewId = review._id || review.id;

                  return (
                    <tr key={reviewId} className="transition hover:bg-gray-50">
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.customer || "Unknown Customer"}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {review.email || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="max-w-[220px] truncate font-medium text-gray-900">
                            {review.productName || "Unknown Product"}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {review.vendor || "Vendor not available"}
                          </p>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {renderStars(review.rating)}

                          <span className="text-xs font-medium text-gray-500">
                            {review.rating || 0}/5
                          </span>
                        </div>
                      </td>

                      {/* Review */}
                      <td className="px-5 py-4">
                        <div className="max-w-[300px]">
                          {review.title && (
                            <p className="truncate font-medium text-gray-900">
                              {review.title}
                            </p>
                          )}

                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {review.comment || "No comment"}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(
                            review.status,
                          )}`}
                        >
                          {getStatusIcon(review.status)}
                          {review.status || "pending"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(review.date || review.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/reviews/${reviewId}`)
                            }
                            title="View review"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Eye size={17} />
                          </button>

                          {review.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(reviewId, "approved")}
                              disabled={updatingId === reviewId}
                              title="Approve review"
                              className="rounded-lg border border-green-200 p-2 text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle size={17} />
                            </button>
                          )}

                          {review.status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(reviewId, "rejected")}
                              disabled={updatingId === reviewId}
                              title="Reject review"
                              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredReviews.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredReviews.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {reviews.length}
              </span>{" "}
              reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;