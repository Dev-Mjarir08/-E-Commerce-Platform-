import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  User,
  Store,
  CalendarDays,
  Flag,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";

const reviews = [
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

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const review = reviews.find((item) => item.id === id);

  if (!review) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />

        <h2 className="text-lg font-bold text-slate-800">
          Review Not Found
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          The review you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/reviews")}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          <ArrowLeft size={15} />
          Back to Reviews
        </button>
      </div>
    );
  }

  const renderStars = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          fill={star <= review.rating ? "currentColor" : "none"}
          className={
            star <= review.rating
              ? "text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );

  const statusStyles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/reviews")}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Review Details
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Review ID: {review.id}
          </p>
        </div>
      </div>

      {/* Main Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Review Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />

                <h2 className="text-lg font-bold text-slate-900">
                  Customer Review
                </h2>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {review.id}
              </p>
            </div>

            <span
              className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                statusStyles[review.status]
              }`}
            >
              {review.status}
            </span>
          </div>

          <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              {renderStars()}

              <span className="text-sm font-bold text-slate-700">
                {review.rating}.0 / 5
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700">
              "{review.review}"
            </p>
          </div>

          {review.flagged && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
              <Flag size={15} />

              <span className="text-xs font-semibold">
                This review has been flagged for moderation.
              </span>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-sm font-bold text-slate-900">
            Customer Information
          </h2>

          <div className="mt-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <User size={18} />
            </div>

            <div>
              <div className="font-bold text-slate-900">
                {review.customer}
              </div>

              <div className="text-xs text-slate-400">
                {review.email}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Product
              </span>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {review.product}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Vendor
              </span>

              <div className="flex items-center gap-2 mt-1">
                <Store size={14} className="text-slate-400" />

                <p className="text-sm font-semibold text-slate-800">
                  {review.vendor}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Review Date
              </span>

              <div className="flex items-center gap-2 mt-1">
                <CalendarDays size={14} className="text-slate-400" />

                <p className="text-sm font-semibold text-slate-800">
                  {review.date}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Moderation Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">

        <h2 className="text-sm font-bold text-slate-900">
          Moderation Actions
        </h2>

        <div className="flex flex-wrap gap-3 mt-4">

          {review.status !== "approved" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
            >
              <CheckCircle2 size={15} />
              Approve Review
            </button>
          )}

          {review.status !== "rejected" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
            >
              <XCircle size={15} />
              Reject Review
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/admin/reviews")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Back to Reviews
          </button>

        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;