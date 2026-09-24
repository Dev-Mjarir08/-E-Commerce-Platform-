import React, { useEffect, useState } from "react";
import {
  Star,
  ArrowLeft,
  Send,
  Flag,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const reviews = [
  {
    id: "REV-1001",
    customerName: "John Wick",
    customerAvatar: "https://i.pravatar.cc/100?img=12",
    date: "Sep 20, 2026",
    rating: 5,
    productName: "Premium Leather Wallet",
    title: "Excellent Quality",
    comment:
      "The wallet quality is really good. The leather feels premium and the delivery was fast.",
    status: "Replied",
  },
  {
    id: "REV-1002",
    customerName: "Sarah Johnson",
    customerAvatar: "https://i.pravatar.cc/100?img=32",
    date: "Sep 19, 2026",
    rating: 4,
    productName: "Classic Wrist Watch",
    title: "Good Product",
    comment:
      "The watch looks great and works perfectly. Packaging could be improved.",
    status: "Pending",
  },
  {
    id: "REV-1003",
    customerName: "Ahmed Khan",
    customerAvatar: "https://i.pravatar.cc/100?img=11",
    date: "Sep 18, 2026",
    rating: 5,
    productName: "Men's Casual Shoes",
    title: "Very Comfortable",
    comment:
      "Very comfortable shoes. I used them for a full day and had no problems.",
    status: "Replied",
  },
  {
    id: "REV-1004",
    customerName: "Michael Smith",
    customerAvatar: "https://i.pravatar.cc/100?img=15",
    date: "Sep 17, 2026",
    rating: 3,
    productName: "Cotton T-Shirt",
    title: "Average Product",
    comment:
      "The material is okay but the fitting was slightly different from the description.",
    status: "Pending",
  },
];

export default function ReviewDetails() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [existingReply, setExistingReply] = useState("");

  // Find review using URL ID
  useEffect(() => {
    const selectedReview = reviews.find(
      (item) => item.id === reviewId
    );

    setReview(selectedReview || null);

    if (selectedReview?.status === "Replied") {
      setExistingReply(
        "Thank you so much for your support! We are thrilled that you love your new item."
      );
    } else {
      setExistingReply("");
    }

    setReplyText("");
  }, [reviewId]);

  // Back to Reviews
  const handleBack = () => {
    navigate("/pages/vendor/reviews");
  };

  // Submit response
  const handleSubmitReply = (e) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    setExistingReply(replyText.trim());
    setReplyText("");

    console.log("Review ID:", reviewId);
    console.log("Vendor Response:", replyText.trim());
  };

  // Review not found
  if (!review) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md w-full">

          <MessageSquare
            size={40}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-lg font-bold text-slate-800">
            Review Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            The review you are looking for does not exist.
          </p>

          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={handleBack}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Review Details
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review ID: {review.id}
          </p>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto space-y-5">

        {/* CUSTOMER CARD */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* CUSTOMER */}
            <div className="flex items-center gap-3">

              <img
                src={review.customerAvatar}
                alt={review.customerName}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>

                <h2 className="font-bold text-slate-900">
                  {review.customerName}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Verified Purchase • {review.date}
                </p>

              </div>

            </div>

            {/* RATING */}
            <div className="flex items-center gap-1">

              {[...Array(5)].map((_, i) => (

                <Star
                  key={i}
                  size={18}
                  fill={
                    i < review.rating
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < review.rating
                      ? "text-amber-400"
                      : "text-slate-200"
                  }
                />

              ))}

              <span className="text-sm font-semibold text-slate-600 ml-2">
                {review.rating}/5
              </span>

            </div>

          </div>

        </div>

        {/* PRODUCT & REVIEW */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Product Reviewed
          </p>

          <h3 className="font-semibold text-slate-800 mt-1">
            {review.productName}
          </h3>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">

            <h4 className="font-bold text-slate-900">
              {review.title}
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              {review.comment}
            </p>

          </div>

        </div>

        {/* EXISTING RESPONSE */}
        {existingReply && (
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">

            <div className="flex items-center justify-between">

              <span className="font-bold text-emerald-800 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                Official Vendor Response
              </span>

              <span className="text-xs text-emerald-600">
                Just now
              </span>

            </div>

            <p className="text-sm text-emerald-900 leading-relaxed mt-3">
              {existingReply}
            </p>

          </div>
        )}

        {/* RESPONSE FORM */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center gap-2 mb-4">

            <MessageSquare
              size={18}
              className="text-emerald-600"
            />

            <h3 className="font-bold text-slate-800">
              {existingReply
                ? "Update Public Response"
                : "Write Official Response"}
            </h3>

          </div>

          <form
            onSubmit={handleSubmitReply}
            className="space-y-3"
          >

            <textarea
              rows={5}
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
              placeholder="Thank the customer or offer support regarding their issue..."
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 bg-slate-50 resize-none"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <button
                type="button"
                className="text-xs text-rose-600 font-semibold flex items-center gap-1 hover:text-rose-700 w-fit"
              >
                <Flag size={13} />
                Flag Inappropriate
              </button>

              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={14} />

                {existingReply
                  ? "Update Response"
                  : "Post Response"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}