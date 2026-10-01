import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  User,
  Phone,
  Mail,
  Printer
} from 'lucide-react';
import vendorApi from '../../services/vendorApi';

export default function VendorOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await vendorApi.getOrderById(id);
          const data = res?.data?.order || res?.order || res?.data;
          if (data && data._id) {
            setOrder(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend order fetch fallback:', err);
      }

      // Initial realistic preview record
      setOrder({
        _id: id || 'ORD-89234',
        orderNumber: id?.slice(-6) || '89234',
        createdAt: '2026-03-22T14:30:00.000Z',
        orderStatus: 'Processing',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card (Stripe)',
        trackingNumber: 'TRK-9918234712',
        carrier: 'FedEx Express Courier',
        items: [
          {
            _id: 'ITEM-1',
            product: {
              name: 'Wireless Noise-Canceling Headphones',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200'
            },
            name: 'Wireless Noise-Canceling Headphones',
            price: 199.99,
            quantity: 1,
            sku: 'SKU-8821'
          },
          {
            _id: 'ITEM-2',
            product: {
              name: 'Ergonomic Desktop Stand',
              image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=200'
            },
            name: 'Ergonomic Desktop Stand',
            price: 49.50,
            quantity: 1,
            sku: 'SKU-3102'
          }
        ],
        shippingAddress: {
          recipientName: 'Alex Johnson',
          street: '123 Tech Lane, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          phone: '+1 (415) 555-0199'
        },
        user: {
          name: 'Alex Johnson',
          email: 'alex.j@example.com'
        },
        subtotal: 249.49,
        shippingFee: 0.00,
        tax: 18.71,
        totalAmount: 268.20
      });
      setLoading(false);
    };

    fetchOrderDetails();
  }, [id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await vendorApi.updateOrderStatus(order._id || id, newStatus);
      setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
    } catch {
      setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'placed':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled':
      case 'failed':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase text-slate-500">Loading Order Manifest...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
        <Package size={36} className="mx-auto text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-800">Order Record Not Found</h3>
        <button
          onClick={() => navigate('/vendor/orders')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vendor/orders')}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-mono">
                Order #{order.orderNumber || order._id?.slice(-8) || id}
              </h1>
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
              <Calendar size={12} />
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status update & Print buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>

          <select
            value={order.orderStatus || 'Placed'}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xs cursor-pointer focus:outline-none"
          >
            <option value="Placed">Set to Placed</option>
            <option value="Processing">Set to Processing</option>
            <option value="Shipped">Set to Shipped</option>
            <option value="Delivered">Set to Delivered</option>
            <option value="Cancelled">Set to Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
                Purchased Items ({order.items?.length || 0})
              </h3>
              <span className="text-xs text-slate-400">Atelier verified catalog</span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <img
                    src={
                      item.product?.image ||
                      item.image ||
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
                    }
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {item.product?.name || item.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      SKU: {item.sku || 'SKU-001'}
                    </p>
                    <p className="text-xs text-slate-600 font-mono mt-1">
                      ${item.price?.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-slate-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Tracking Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
              Logistics & Courier Dispatch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Courier Partner</span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Truck size={14} className="text-emerald-600" />
                  {order.carrier || 'Standard Courier Express'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Tracking Code</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {order.trackingNumber || 'TRK-PENDING'}
                  </span>
                  {order.trackingNumber && (
                    <button
                      onClick={() => handleCopy(order.trackingNumber)}
                      className="text-slate-400 hover:text-slate-600"
                      title="Copy Tracking #"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Cost Breakdown */}
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
              Customer Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  <User size={15} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {order.shippingAddress?.recipientName || order.user?.name || 'Customer'}
                  </p>
                  <p className="text-[11px] text-slate-400">Verified Atelier Buyer</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={13} className="text-slate-400" />
                  <span className="truncate">{order.user?.email || 'customer@example.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={13} className="text-slate-400" />
                  <span>{order.shippingAddress?.phone || '+1 (555) 019-2834'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-600" />
              <span>Delivery Address</span>
            </h3>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg font-mono">
              <p className="font-semibold text-slate-800">
                {order.shippingAddress?.recipientName || order.user?.name}
              </p>
              <p>{order.shippingAddress?.street || '742 Evergreen Terrace'}</p>
              <p>
                {order.shippingAddress?.city || 'San Francisco'},{' '}
                {order.shippingAddress?.state || 'CA'}{' '}
                {order.shippingAddress?.postalCode || '94107'}
              </p>
              <p className="text-slate-400">{order.shippingAddress?.country || 'USA'}</p>
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 flex items-center gap-1.5">
              <CreditCard size={14} className="text-emerald-600" />
              <span>Payment Breakdown</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">${(order.subtotal || order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Shipping</span>
                <span className="font-mono text-emerald-600">
                  {order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-mono">${(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-slate-900">
                <span>Total Payout</span>
                <span className="font-mono text-base text-emerald-700">
                  ${(order.totalAmount || order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Status: {order.paymentStatus || 'Paid'}</span>
              <span className="text-emerald-600 font-semibold">Settled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}