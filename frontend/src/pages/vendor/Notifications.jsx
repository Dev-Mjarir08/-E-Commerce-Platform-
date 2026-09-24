import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Boxes,
  Star,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
  Trash2,
  Clock
} from 'lucide-react';
import vendorApi from '../../services/vendorApi';

const initialNotifications = [
  {
    _id: 'NOTIF-01',
    title: 'New Confirmed Order #ORD-89234',
    message: 'Customer Alex Johnson purchased 2 items totaling $249.49. Prepare package for dispatch.',
    type: 'order',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    link: '/vendor/orders'
  },
  {
    _id: 'NOTIF-02',
    title: 'Low Stock Alert: Ergonomic Office Chair',
    message: 'Inventory has dropped below the threshold (6 units remaining). Consider replenishing SKU-9940.',
    type: 'inventory',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    link: '/vendor/inventory'
  },
  {
    _id: 'NOTIF-03',
    title: 'New 5-Star Product Review',
    message: 'Elena Rostova left a 5-star review on "Wireless Noise-Canceling Headphones".',
    type: 'review',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/vendor/reviews'
  },
  {
    _id: 'NOTIF-04',
    title: 'Coupon Usage Milestone Reached',
    message: 'Promo code "SPRING20" has crossed 140 redemptions with $2,840 generated sales.',
    type: 'promotion',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: '/vendor/coupons'
  },
  {
    _id: 'NOTIF-05',
    title: 'Store Verification Verified',
    message: 'Congratulations! Your store documents have been verified by Atelier Admin.',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    link: '/vendor/store'
  }
];

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await vendorApi.getNotifications();
      const data = response?.data?.notifications || response?.notifications || response?.data;
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      }
    } catch (err) {
      console.warn('Using local fallback notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await vendorApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await vendorApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="text-emerald-600" size={18} />;
      case 'inventory':
        return <Boxes className="text-amber-600" size={18} />;
      case 'review':
        return <Star className="text-purple-600" size={18} />;
      case 'system':
        return <ShieldCheck className="text-blue-600" size={18} />;
      default:
        return <Info className="text-slate-600" size={18} />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50';
      case 'inventory':
        return 'bg-amber-50';
      case 'review':
        return 'bg-purple-50';
      case 'system':
        return 'bg-blue-50';
      default:
        return 'bg-slate-100';
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} d ago`;
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Orders') return n.type === 'order';
    if (filter === 'Inventory') return n.type === 'inventory';
    if (filter === 'Reviews') return n.type === 'review';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Vendor Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-emerald-600 text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational activity alerts, stock warnings, and transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors"
            >
              <CheckCheck size={14} className="text-emerald-600" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-xs transition-colors"
            title="Refresh Notifications"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Unread', 'Orders', 'Inventory', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              filter === tab
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">No notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up with your store notifications.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/80 ${
                !notif.isRead ? 'bg-emerald-50/20' : ''
              }`}
            >
              {/* Type Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(
                  notif.type
                )}`}
              >
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs ${
                        !notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock size={11} />
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                {/* Footer action links */}
                <div className="mt-3 flex items-center gap-3">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => handleMarkOneRead(notif._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      <span>Take Action</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkOneRead(notif._id)}
                      className="text-[11px] font-mono text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
