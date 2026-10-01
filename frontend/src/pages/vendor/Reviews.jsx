import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  MessageSquare,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  RefreshCw,
  Send,
  X,
  Store,
  ChevronDown
} from 'lucide-react';
import vendorApi from '../../services/vendorApi';
import { useModal } from '../../context/ModalContext';

// Initial fallback reviews for preview
const initialReviews = [
  {
    _id: 'REV-901',
    product: {
      _id: 'PRD-101',
      name: 'Wireless Noise-Canceling Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150',
      price: 149.99
    },
    user: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    rating: 5,
    title: 'Exquisite build quality and serene audio isolation',
    comment: 'The acoustic tuning is sublime. Using them daily in my workspace. The minimal packaging and fast courier delivery were top-tier.',
    isVerifiedBuyer: true,
    createdAt: '2026-03-20T10:30:00.000Z',
    reply: {
      comment: 'Thank you for your generous words Elena! We are thrilled our atelier tuning enhances your daily focus.',
      createdAt: '2026-03-20T14:15:00.000Z'
    }
  },
  {
    _id: 'REV-902',
    product: {
      _id: 'PRD-102',
      name: 'Ergonomic Leather Office Chair',
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=150',
      price: 289.00
    },
    user: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    rating: 4,
    title: 'Outstanding lumbar support, assembly took patience',
    comment: 'The leather feels genuine and breathable. Assembly instructions could have been clearer, but once built, it supports 8+ hours easily.',
    isVerifiedBuyer: true,
    createdAt: '2026-03-18T16:45:00.000Z',
    reply: null
  },
  {
    _id: 'REV-903',
    product: {
      _id: 'PRD-103',
      name: 'Smart Fitness Watch V2',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150',
      price: 99.50
    },
    user: {
      name: 'Sophia Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
    },
    rating: 5,
    title: 'Minimalist aesthetic with high precision sensors',
    comment: 'Syncs effortlessly with iOS and health dashboards. Battery lasted 6 full days on first charge. Highly satisfied.',
    isVerifiedBuyer: true,
    createdAt: '2026-03-15T09:12:00.000Z',
    reply: null
  },
  {
    _id: 'REV-904',
    product: {
      _id: 'PRD-104',
      name: 'Stainless Steel Water Bottle (1L)',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150',
      price: 24.99
    },
    user: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    rating: 3,
    title: 'Keeps water cold, slightly heavy for commuting',
    comment: 'Great insulation performance. A bit heavier than expected when filled completely.',
    isVerifiedBuyer: false,
    createdAt: '2026-03-11T11:20:00.000Z',
    reply: null
  }
];

export default function VendorReviews() {
  const { confirm: modalConfirm } = useModal();
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await vendorApi.getReviews();
      const data = response?.data?.reviews || response?.reviews || response?.data;
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      }
    } catch (err) {
      console.warn('Using local fallback reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    vendorApi.getReviews()
      .then((response) => {
        if (!active) return;
        const data = response?.data?.reviews || response?.reviews || response?.data;
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback reviews:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleOpenReply = (review) => {
    setActiveReview(review);
    setReplyText(review.reply?.comment || '');
    setReplyModalOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeReview) return;

    setSubmittingReply(true);
    try {
      await vendorApi.updateReview(activeReview._id, {
        reply: replyText.trim()
      });

      setReviews((prev) =>
        prev.map((r) =>
          r._id === activeReview._id
            ? {
                ...r,
                reply: {
                  comment: replyText.trim(),
                  createdAt: new Date().toISOString()
                }
              }
            : r
        )
      );
      setToastMessage('Reply submitted successfully.');
      setReplyModalOpen(false);
    } catch {
      // Local optimistic update
      setReviews((prev) =>
        prev.map((r) =>
          r._id === activeReview._id
            ? {
                ...r,
                reply: {
                  comment: replyText.trim(),
                  createdAt: new Date().toISOString()
                }
              }
            : r
        )
      );
      setToastMessage('Reply saved (local preview).');
      setReplyModalOpen(false);
    } finally {
      setSubmittingReply(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDeleteReview = async (id) => {
    const ok = await modalConfirm({
      title: "Remove Review Entry",
      message: "Are you sure you want to remove this review entry? This cannot be undone.",
      type: "danger",
      confirmText: "Remove Review",
      cancelText: "Cancel"
    });
    if (!ok) return;
    try {
      await vendorApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setToastMessage('Review removed.');
    } catch {
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setToastMessage('Review removed (local).');
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesRating =
      ratingFilter === 'All' || r.rating.toString() === ratingFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      r.product?.name?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q);
    return matchesRating && matchesSearch;
  });

  // Calculate review metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fiveStarPct = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0;
  const pendingReplies = reviews.filter((r) => !r.reply).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor client feedback, manage store reputation, and respond to product reviews.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Average Rating</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Star size={18} fill="currentColor" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'}
                className={s <= Math.round(avgRating) ? 'text-amber-500' : 'text-slate-200'}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Total Reviews</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{totalReviews}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Verified buyer reviews across products</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">5-Star Ratio</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ThumbsUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{fiveStarPct}%</span>
            <span className="text-xs text-emerald-600 font-medium">({fiveStarCount} reviews)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${fiveStarPct}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Pending Replies</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{pendingReplies}</span>
          </div>
          <p className="text-xs text-purple-700 font-medium mt-2">Customer queries awaiting vendor response</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, customer name or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium hidden sm:inline">Filter Rating:</span>
          {['All', '5', '4', '3', '2', '1'].map((star) => (
            <button
              key={star}
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                ratingFilter === star
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {star === 'All' ? 'All' : `${star} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <Star size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">No reviews found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your rating filter or search keywords.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={review.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                    alt={review.product?.name || 'Product'}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {review.product?.name || 'Atelier Product'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ${review.product?.price?.toFixed(2) || '0.00'} • ID: {review.product?._id || 'PRD'}
                    </p>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= review.rating ? 'currentColor' : 'none'}
                        className={s <= review.rating ? 'text-amber-500' : 'text-slate-200'}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">{review.rating}.0</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Reviewer & Content */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{review.user?.name || 'Customer'}</span>
                  {review.isVerifiedBuyer && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={11} /> Verified Buyer
                    </span>
                  )}
                </div>

                {review.title && (
                  <h5 className="text-xs font-bold text-slate-900">{review.title}</h5>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>

                {/* Vendor Reply if existing */}
                {review.reply && (
                  <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border-l-4 border-emerald-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Store size={13} /> Your Store Response
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {review.reply.createdAt
                          ? new Date(review.reply.createdAt).toLocaleDateString()
                          : 'Replied'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{review.reply.comment}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenReply(review)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>{review.reply ? 'Edit Response' : 'Reply to Customer'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store size={16} className="text-emerald-600" />
                <span>Respond as Store Owner</span>
              </h3>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                Review by {activeReview?.user?.name || 'Customer'}:
              </p>
              <p className="italic text-slate-600 line-clamp-2">"{activeReview?.comment}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Public Store Reply
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer or address their feedback professionally..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                >
                  <Send size={13} />
                  <span>{submittingReply ? 'Posting...' : 'Post Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
