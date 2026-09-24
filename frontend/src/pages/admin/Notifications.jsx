import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  Users,
  ShoppingBag,
  Store,
  DollarSign,
  Trash2,
  Check,
  RefreshCw,
  Search,
  Filter,
  Info
} from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'New order received',
    message: 'Order #ORD-4821 has been placed by Aarav Mehta.',
    time: '2 minutes ago',
    date: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'customer',
    title: 'New customer registered',
    message: 'Diya Shah created a new customer account.',
    time: '12 minutes ago',
    date: new Date(),
    read: false
  },
  {
    id: 3,
    type: 'inventory',
    title: 'Low stock warning',
    message: 'Luxury Leather Handbag has only 5 units remaining.',
    time: '28 minutes ago',
    date: new Date(),
    read: false
  },
  {
    id: 4,
    type: 'vendor',
    title: 'Vendor approval required',
    message: 'A new boutique vendor is waiting for onboarding review.',
    time: '1 hour ago',
    date: new Date(),
    read: true
  },
  {
    id: 5,
    type: 'shipping',
    title: 'Shipment delivered',
    message: 'Shipment SHP-10020 was successfully delivered.',
    time: '2 hours ago',
    date: new Date(),
    read: true
  },
  {
    id: 6,
    type: 'revenue',
    title: 'Payment received',
    message: '₹24,500 payment received for order #ORD-4817.',
    time: '3 hours ago',
    date: new Date(),
    read: true
  },
  {
    id: 7,
    type: 'system',
    title: 'Dashboard synchronization complete',
    message: 'Latest MongoDB metrics have been synchronized.',
    time: '5 hours ago',
    date: new Date(),
    read: true
  }
];

const notificationConfig = {
  order: {
    icon: ShoppingBag,
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  },
  customer: {
    icon: Users,
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
  inventory: {
    icon: Package,
    bg: 'bg-rose-50',
    text: 'text-rose-600'
  },
  vendor: {
    icon: Store,
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  shipping: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  revenue: {
    icon: DollarSign,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  system: {
    icon: Info,
    bg: 'bg-slate-100',
    text: 'text-slate-600'
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      const response = await adminApi.getNotifications();

      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !notification.read) ||
        (filter === 'read' && notification.read);

      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, search]);

  const markAsRead = async (id) => {
    try {
      await adminApi.markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminApi.markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await adminApi.deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  };

  const clearRead = () => {
    setNotifications((prev) =>
      prev.filter((notification) => !notification.read)
    );
  };

  const refreshNotifications = async () => {
    setIsRefreshing(true);

    await fetchNotifications();

    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Notifications
              </h2>

              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Monitor important orders, customers, inventory, vendors,
              shipping, and system activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Check size={14} />
              Mark All Read
            </button>

            <button
              type="button"
              onClick={refreshNotifications}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? 'animate-spin text-indigo-600' : ''}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Notification Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Total Notifications
              </span>
              <span className="text-[11px] text-slate-400">
                System activity
              </span>
            </div>
          </div>

          <span className="text-xl font-black text-slate-900">
            {notifications.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Unread
              </span>
              <span className="text-[11px] text-slate-400">
                Requires attention
              </span>
            </div>
          </div>

          <span className="text-xl font-black text-amber-600">
            {unreadCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Read
              </span>
              <span className="text-[11px] text-slate-400">
                Already reviewed
              </span>
            </div>
          </div>

          <span className="text-xl font-black text-emerald-700">
            {notifications.length - unreadCount}
          </span>
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Activity Center
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Recent platform events and administrative alerts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 text-xs font-semibold ${filter === 'all'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 text-xs font-semibold border-l border-slate-100 ${filter === 'unread'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  Unread
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('read')}
                  className={`px-3 py-2 text-xs font-semibold border-l border-slate-100 ${filter === 'read'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-14 text-center">
              <Bell className="w-9 h-9 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-600 text-sm">
                No Notifications Found
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                There are no notifications matching your current filter.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config =
                notificationConfig[notification.type] ||
                notificationConfig.system;

              const NotificationIcon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${notification.read
                    ? 'bg-white hover:bg-slate-50'
                    : 'bg-indigo-50/30 hover:bg-indigo-50/50'
                    }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center shrink-0 border border-white`}
                  >
                    <NotificationIcon size={18} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                        )}

                        <h4
                          className={`text-xs ${notification.read
                            ? 'font-semibold text-slate-700'
                            : 'font-bold text-slate-900'
                            }`}
                        >
                          {notification.title}
                        </h4>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {notification.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Check size={12} />
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeNotification(notification.id)
                        }
                        className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.some((notification) => notification.read) && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={clearRead}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            >
              Clear all read notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;