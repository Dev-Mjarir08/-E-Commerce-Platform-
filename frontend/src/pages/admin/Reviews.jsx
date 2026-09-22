import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Flag,
  User,
  Store,
  AlertTriangle,
} from "lucide-react";

const initialReviews = [
  {
    id: "REV-1001",
    customer: "Aarav Mehta",
    email: "aarav@example.com",
    product: "Premium Linen Shirt",
    vendor: "Royal Attire",
    rating: 5,
    review:
      "Excellent quality and the fitting was exactly as described. Very happy with the purchase.",
    status: "approved",
    date: "Sep 19, 2026",
    flagged: false,
  },
  {
    id: "REV-1002",
    customer: "Riya Shah",
    email: "riya@example.com",
    product: "Silk Evening Dress",
    vendor: "Maison Studio",
    rating: 2,
    review:
      "The product looked different from the pictures and arrived later than expected.",
    status: "pending",
    date: "Sep 20, 2026",
    flagged: true,
  },
  {
    id: "REV-1003",
    customer: "Kabir Patel",
    email: "kabir@example.com",
    product: "Classic Leather Jacket",
    vendor: "Urban Luxe",
    rating: 4,
    review:
      "Good product overall. Leather quality is nice and delivery was quick.",
    status: "approved",
    date: "Sep 20, 2026",
    flagged: false,
  },
  {
    id: "REV-1004",
    customer: "Meera Joshi",
    email: "meera@example.com",
    product: "Designer Handbag",
    vendor: "The Fashion House",
    rating: 1,
    review:
      "Very disappointing experience. The item had visible damage when delivered.",
    status: "pending",
    date: "Sep 21, 2026",
    flagged: true,
  },
  {
    id: "REV-1005",
    customer: "Dev Malhotra",
    email: "dev@example.com",
    product: "Cotton Overshirt",
    vendor: "Classic Wardrobe",
    rating: 5,
    review:
      "Great material and comfortable fit. Would definitely purchase again.",
    status: "rejected",
    date: "Sep 21, 2026",
    flagged: false,
  },
];

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        review.customer.toLowerCase().includes(search) ||
        review.product.toLowerCase().includes(search) ||
        review.vendor.toLowerCase().includes(search) ||
        review.review.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === "all" || review.status === selectedStatus;

      const matchesRating =
        selectedRating === "all" || review.rating === Number(selectedRating);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, selectedStatus, selectedRating]);

  const summary = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    flagged: reviews.filter((r) => r.flagged).length,
  };

  const updateStatus = (id, status) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              status,
              flagged: status === "approved" ? false : review.flagged,
            }
          : review,
      ),
    );
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            fill={star <= rating ? "currentColor" : "none"}
            className={star <= rating ? "text-amber-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const statusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />

            <h2 className="text-xl font-bold text-slate-900">
              Reviews & Ratings Moderation
            </h2>

            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
              Moderation Center
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Review customer feedback, moderate inappropriate content, and manage
            marketplace ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin text-indigo-600" : ""}
          />
          Refresh Reviews
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Total Reviews
            </span>

            <div className="text-xl font-black text-slate-900">
              {summary.total}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Pending Review
            </span>

            <div className="text-xl font-black text-amber-700">
              {summary.pending}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Approved
            </span>

            <div className="text-xl font-black text-emerald-700">
              {summary.approved}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flag size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Flagged
            </span>

            <div className="text-xl font-black text-rose-700">
              {summary.flagged}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-96">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, product, vendor or review..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-slate-400" />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Product / Vendor</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5 min-w-[280px]">Review</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                        <User size={14} />
                      </div>

                      <div>
                        <div className="font-bold text-slate-900">
                          {review.customer}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {review.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-800">
                      {review.product}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <Store size={11} />
                      {review.vendor}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {renderStars(review.rating)}

                      <span className="text-[10px] font-bold text-slate-500">
                        {review.rating}.0 / 5
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-slate-600 leading-5 max-w-[360px]">
                      {review.review}
                    </p>

                    {review.flagged && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-rose-600">
                        <Flag size={10} />
                        Flagged for moderation
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">{statusBadge(review.status)}</td>

                  <td className="px-4 py-4 text-slate-500 text-[11px]">
                    {review.date}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end items-center gap-1.5">
                      {review.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(review.id, "approved")}
                          title="Approve review"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}

                      {review.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(review.id, "rejected")}
                          title="Reject review"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <XCircle size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="View review"
                        onClick={() => navigate(`/admin/reviews/${review.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />

                    <p className="text-sm font-bold text-slate-700">
                      No Reviews Found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your search or moderation filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
