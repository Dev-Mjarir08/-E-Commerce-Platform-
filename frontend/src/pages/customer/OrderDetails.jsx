import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  MapPin,
  CreditCard,
  Building,
  ShieldCheck,
  FileText,
  X,
  Printer
} from 'lucide-react';
import orderApi from '../../services/orderApi';
import { useToast } from '../../context/ToastContext';

export const OrderDetails = () => {
  const { id } = useParams();
  const { showToast: triggerToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cancellation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const showToast = useCallback((type, text) => {
    triggerToast(text, type);
  }, [triggerToast]);

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getOrderById(id);
      if (response && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to retrieve order details.');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    setCancelling(true);
    try {
      await orderApi.cancelOrder(order._id, cancelReason || 'Customer requested cancellation');
      showToast('success', 'Order cancelled and records updated.');
      setIsCancelModalOpen(false);
      await fetchOrderDetails();
    } catch (error) {
      showToast('error', error.message || 'Unable to cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Milestone Stepper definition
  const getMilestoneIndex = (status) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const milestones = [
    { title: 'Order Placed', subtitle: 'Awaiting dispatch verification' },
    { title: 'Confirmed', subtitle: 'Atelier confirmed receipt' },
    { title: 'Processing', subtitle: 'Tailoring & quality inspection' },
    { title: 'Dispatched', subtitle: 'In transit via courier' },
    { title: 'Delivered', subtitle: 'Received at destination' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8E877F] mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
            Retrieving Consignment Dossier...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] py-16 px-4">
        <div className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#E5E3DF] p-10 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="font-serif text-2xl uppercase text-[#111111]">Order Not Found</h2>
          <p className="text-xs text-[#8E877F]">
            The requested consignment dossier could not be located.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const currentMilestone = getMilestoneIndex(order.orderStatus);
  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/orders"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Purchase Records</span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E877F]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                Consignment Details
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-[#8E877F] font-mono mt-1">
              Acquisition Timestamp: {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel Consignment
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] bg-[#FFFFFF] text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
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
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
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

        {/* Milestone Stepper Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E5E3DF]">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F]">
              LOGISTICS STATUS TIMELINE
            </span>
            <span
              className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 border ${
                isCancelled
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : order.orderStatus === 'delivered'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {isCancelled ? 'CONSIGNMENT CANCELLED' : order.orderStatus.toUpperCase()}
            </span>
          </div>

          {isCancelled ? (
            <div className="p-6 bg-rose-50/60 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold">
                <RotateCcw className="w-4 h-4 text-rose-700" />
                <span>Order Cancelled</span>
              </div>
              <p className="text-xs text-rose-800">
                Reason:{' '}
                <span className="italic font-serif">
                  {order.cancellationReason || 'Requested by client'}
                </span>
              </p>
              {order.cancelledAt && (
                <p className="text-[11px] font-mono text-rose-600">
                  Recorded at: {formatDate(order.cancelledAt)}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {milestones.map((m, idx) => {
                const isPassed = idx <= currentMilestone;
                const isCurrent = idx === currentMilestone;
                return (
                  <div key={idx} className="flex flex-col items-start md:items-center text-left md:text-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                        isPassed
                          ? 'bg-[#111111] text-[#F8F7F4] border-[#111111]'
                          : 'bg-[#F8F7F4] text-[#8E877F] border-[#E5E3DF]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-mono uppercase tracking-wider ${
                          isCurrent ? 'text-[#111111] font-bold' : isPassed ? 'text-[#111111]' : 'text-[#8E877F]'
                        }`}
                      >
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-[#8E877F] font-sans mt-0.5 max-w-[140px] hidden md:block">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Columns: Items & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Consignment Items (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111] pb-4 border-b border-[#E5E3DF] mb-6">
                Curated Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-[#E5E3DF]">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 bg-[#F8F7F4] border border-[#E5E3DF] shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8E877F]">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-base text-[#111111] font-medium">
                          {item.name}
                        </h4>
                        {item.sku && (
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F]">
                            SKU: {item.sku}
                          </p>
                        )}
                        {item.store?.name && (
                          <p className="text-xs text-[#8E877F] font-sans">
                            Atelier Partner: <span className="text-[#111111]">{item.store.name}</span>
                          </p>
                        )}
                        <p className="text-xs text-[#666666] font-mono">
                          Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] block">
                        Item Subtotal
                      </span>
                      <span className="font-serif text-lg font-medium text-[#111111]">
                        ${item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Billing Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Shipping Destination */}
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8E877F] pb-2 border-b border-[#E5E3DF]">
                  <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Shipping Destination</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h5 className="font-serif text-sm font-medium text-[#111111]">
                    {order.shippingAddress?.recipientName}
                  </h5>
                  <p className="text-[#666666] font-mono">{order.shippingAddress?.phone}</p>
                  <p className="text-[#444444] font-sans pt-1 leading-relaxed">
                    {order.shippingAddress?.street}
                    {order.shippingAddress?.apartment ? `, ${order.shippingAddress?.apartment}` : ''}
                    <br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.postalCode}
                    <br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Billing Reference */}
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8E877F] pb-2 border-b border-[#E5E3DF]">
                  <CreditCard className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Billing & Payment</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="font-mono text-[#111111] uppercase">
                    Method:{' '}
                    <span className="font-semibold">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                    </span>
                  </p>
                  <p className="font-mono text-[#8E877F]">
                    Status:{' '}
                    <span
                      className={`font-semibold uppercase ${
                        order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                  {order.notes && (
                    <p className="text-[#666666] italic text-[11px] pt-1">
                      Client Notes: "{order.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Breakdown (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 shadow-xs space-y-5">
              <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111] pb-3 border-b border-[#E5E3DF]">
                Financial Summary
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#111111]">${order.subtotal?.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[#666666]">
                  <span>Courier & Logistics</span>
                  <span className="font-mono text-[#111111]">
                    {order.shippingPrice === 0 ? 'Complimentary' : `$${order.shippingPrice?.toFixed(2)}`}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span className="font-mono">-${order.discountAmount?.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#666666]">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-mono text-[#111111]">${order.taxPrice?.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-[#E5E3DF] flex items-center justify-between">
                  <span className="font-serif text-base uppercase font-medium text-[#111111]">
                    Total Settlement
                  </span>
                  <span className="font-serif text-2xl font-medium text-[#111111]">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E3DF] space-y-3">
                <div className="p-3 bg-[#F8F7F4] border border-[#E5E3DF] flex items-center gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-[#111111] shrink-0" />
                  <span className="text-[#666666] text-[11px] leading-relaxed">
                    Authenticated luxury guarantee. Protected by Atelier concierge resolution.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#111111] w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DF]">
              <h3 className="font-serif text-xl uppercase text-[#111111]">Cancel Consignment</h3>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="text-[#8E877F] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed mb-4">
              Are you certain you wish to withdraw this order? Inventory reserved for your order will be released back to the atelier catalog.
            </p>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Changed styling preference / ordered duplicate"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] text-xs font-mono uppercase tracking-wider"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-[#F8F7F4] text-xs font-mono uppercase tracking-wider disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {cancelling && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
