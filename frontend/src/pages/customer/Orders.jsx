import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import orderApi from '../../services/orderApi';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchOrders = async (status = selectedStatus) => {
    setLoading(true);
    try {
      const params = {};
      if (status && status !== 'all') {
        params.status = status;
      }
      const response = await orderApi.getMyOrders(params);
      if (response && response.data) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-mono uppercase tracking-wider">
            <Truck className="w-3 h-3 text-sky-600" />
            Dispatched / In Transit
          </span>
        );
      case 'processing':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-mono uppercase tracking-wider">
            <Clock className="w-3 h-3 text-indigo-600" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-mono uppercase tracking-wider">
            <RotateCcw className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      case 'placed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono uppercase tracking-wider">
            <Clock className="w-3 h-3 text-amber-600" />
            Order Received
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/profile"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Account Archive</span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E877F]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                Purchase Records
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Order History
            </h1>
            <p className="text-xs text-[#8E877F] font-sans mt-1">
              Review current consignments, archival purchases, and tracking status.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-rose-50/90 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-[#8E877F] hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E3DF] pb-4 mb-8 overflow-x-auto">
          {[
            { id: 'all', label: 'All Acquisitions' },
            { id: 'placed', label: 'Processing' },
            { id: 'shipped', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-[#111111] text-[#F8F7F4] font-medium'
                  : 'bg-[#FFFFFF] border border-[#E5E3DF] text-[#666666] hover:text-[#111111] hover:border-[#8E877F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8E877F] mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
              Loading Purchase Records...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F8F7F4] flex items-center justify-center text-[#8E877F] border border-[#E5E3DF]">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#111111] uppercase">No Orders Discovered</h3>
            <p className="text-xs text-[#8E877F] leading-relaxed">
              No purchase orders correspond with this filter status. Explore the curated catalog to begin your collection.
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#222222] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Collection</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] border border-[#E5E3DF] hover:border-[#111111] transition-all shadow-xs p-6"
              >
                {/* Order Card Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E3DF]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#111111]">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-[11px] text-[#8E877F] font-mono">
                      Acquired on {formatDate(order.createdAt)} • Payment:{' '}
                      <span className="uppercase">{order.paymentMethod}</span> ({order.paymentStatus})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] block">
                      Consignment Total
                    </span>
                    <span className="font-serif text-xl font-medium text-[#111111]">
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="py-5 space-y-4">
                  {order.items && order.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-[#F8F7F4] p-3 border border-[#E5E3DF]">
                          <div className="w-14 h-16 bg-[#E5E3DF] shrink-0 overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8E877F]">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-xs font-medium text-[#111111] truncate">
                              {item.name}
                            </h5>
                            <p className="text-[11px] text-[#8E877F] font-mono mt-0.5">
                              Qty: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                            {item.store?.name && (
                              <p className="text-[10px] text-[#8E877F] font-mono truncate">
                                Atelier: {item.store.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8E877F] font-mono italic">
                      Consignment item details recorded.
                    </p>
                  )}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-4 border-t border-[#E5E3DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#666666] font-sans">
                    Destination:{' '}
                    <span className="font-medium text-[#111111]">
                      {order.shippingAddress?.city}, {order.shippingAddress?.country}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    <span>Inspect Consignment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
