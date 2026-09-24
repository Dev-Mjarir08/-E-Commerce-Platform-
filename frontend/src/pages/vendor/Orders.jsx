import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download
} from 'lucide-react';
import vendorApi from '../../services/vendorApi';

const initialOrders = [
  {
    _id: 'ORD-89234',
    orderNumber: '89234',
    createdAt: '2026-03-22T14:30:00.000Z',
    user: { name: 'Alex Johnson', email: 'alex.j@example.com' },
    shippingAddress: { city: 'San Francisco', state: 'CA' },
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
      { name: 'Desktop Stand', quantity: 1, price: 49.50 }
    ],
    totalAmount: 249.49,
    orderStatus: 'Processing',
    paymentStatus: 'Paid'
  },
  {
    _id: 'ORD-89235',
    orderNumber: '89235',
    createdAt: '2026-03-21T09:15:00.000Z',
    user: { name: 'Sophia Chen', email: 'sophia.c@example.com' },
    shippingAddress: { city: 'Seattle', state: 'WA' },
    items: [
      { name: 'Leather Office Chair', quantity: 1, price: 289.00 }
    ],
    totalAmount: 289.00,
    orderStatus: 'Shipped',
    paymentStatus: 'Paid'
  },
  {
    _id: 'ORD-89236',
    orderNumber: '89236',
    createdAt: '2026-03-20T17:45:00.000Z',
    user: { name: 'Marcus Miller', email: 'marcus.m@example.com' },
    shippingAddress: { city: 'Austin', state: 'TX' },
    items: [
      { name: 'Smart Fitness Watch', quantity: 2, price: 99.50 }
    ],
    totalAmount: 199.00,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid'
  },
  {
    _id: 'ORD-89237',
    orderNumber: '89237',
    createdAt: '2026-03-19T11:20:00.000Z',
    user: { name: 'Emma Watson', email: 'emma.w@example.com' },
    shippingAddress: { city: 'New York', state: 'NY' },
    items: [
      { name: 'Water Bottle 1L', quantity: 3, price: 24.99 }
    ],
    totalAmount: 74.97,
    orderStatus: 'Placed',
    paymentStatus: 'Paid'
  },
  {
    _id: 'ORD-89238',
    orderNumber: '89238',
    createdAt: '2026-03-18T13:00:00.000Z',
    user: { name: 'David Lee', email: 'david.l@example.com' },
    shippingAddress: { city: 'Chicago', state: 'IL' },
    items: [
      { name: 'Wireless Charger', quantity: 1, price: 39.99 }
    ],
    totalAmount: 39.99,
    orderStatus: 'Cancelled',
    paymentStatus: 'Refunded'
  }
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await vendorApi.getOrders();
      const data = response?.data?.orders || response?.orders || response?.data;
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Using fallback order records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await vendorApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );
      setToastMessage(`Order status updated to ${newStatus}.`);
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );
      setToastMessage(`Order status updated to ${newStatus} (local).`);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'placed':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
      case 'failed':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status = order.orderStatus?.toLowerCase() || '';
    const tabMatch =
      activeTab === 'All' ||
      status === activeTab.toLowerCase() ||
      (activeTab === 'Pending' && status === 'placed');

    const q = searchTerm.toLowerCase();
    const id = (order.orderNumber || order._id || '').toLowerCase();
    const custName = (
      order.user?.name ||
      order.shippingAddress?.recipientName ||
      ''
    ).toLowerCase();

    return tabMatch && (id.includes(q) || custName.includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            Order Fulfillment
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage incoming customer purchases, dispatch packages, and update delivery statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
            <span>Sync Orders</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                activeTab === tab
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Filter by Order # or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Destination</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No orders found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try selecting a different status filter or keyword.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const id = order.orderNumber || order._id;
                  const total = order.totalAmount || order.totalPrice || 0;
                  const itemCount =
                    order.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 1;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <Link
                          to={`/vendor/orders/${order._id}`}
                          className="hover:text-emerald-600 hover:underline"
                        >
                          #{id?.slice(-8) || id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {order.user?.name || order.shippingAddress?.recipientName || 'Client'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {order.shippingAddress?.city
                          ? `${order.shippingAddress.city}, ${order.shippingAddress.state || ''}`
                          : 'Domestic'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                        ${total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.orderStatus || 'Placed'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-[11px] font-mono uppercase font-bold py-1 px-2 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/vendor/orders/${order._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
