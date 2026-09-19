import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

export default function OrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        setOrder({
          id: orderId || 'ORD-89234-X2',
          date: 'September 18, 2026',
          status: 'In Transit', // 'Placed', 'Processing', 'In Transit', 'Delivered'
          estimatedDelivery: 'Sep 21, 2026',
          trackingNumber: 'TRK-9918234712',
          carrier: 'FedEx Express',
          items: [
            {
              id: 1,
              name: 'Wireless Noise-Canceling Headphones',
              variant: 'Matte Black',
              price: 199.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200',
            },
            {
              id: 2,
              name: 'Ergonomic Desktop Stand',
              variant: 'Aluminum',
              price: 49.50,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=200',
            },
          ],
          shippingAddress: {
            name: 'Alex Johnson',
            street: '123 Tech Lane, Suite 400',
            city: 'San Francisco',
            state: 'CA',
            zip: '94107',
            country: 'United States',
          },
          paymentMethod: {
            type: 'Visa',
            last4: '4242',
          },
          summary: {
            subtotal: 298.99,
            shipping: 15.00,
            tax: 24.66,
            total: 338.65,
          },
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Order timeline tracking logic
  const steps = ['Placed', 'Processing', 'In Transit', 'Delivered'];
  const getCurrentStepIndex = (status) => steps.indexOf(status);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-600 border-t-transparent"></div>
        <p className="text-slate-500 text-sm font-medium">Fetching order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto my-12 p-8">
        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Order Not Found</h3>
        <p className="text-slate-500 text-sm mt-1 mb-6">We couldn't locate details for this order ID.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="w-full px-4 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const currentStep = getCurrentStepIndex(order.status);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen text-slate-800">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs transition-all hover:border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
        )}
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Need Help?
          </button>
        </div>
      </div>

      {/* Main Container Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order #{order.id}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                {order.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> Placed on {order.date}
            </p>
          </div>

          {order.trackingNumber && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-4 min-w-[260px]">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  {order.carrier}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-800">{order.trackingNumber}</span>
              </div>
              <button 
                onClick={copyTracking}
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Copy tracking number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Shipment Progress Bar */}
        <div className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shipment Progress</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Est. Delivery: {order.estimatedDelivery}
            </span>
          </div>

          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
            {/* Background Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0"></div>
            {/* Active Progress Line */}
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
              style={{ width: `${(currentStep / (steps.length - 1)) * 90}%` }}
            ></div>

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center group">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-xs ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' 
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors ${
                    isCurrent ? 'text-emerald-600 font-semibold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center justify-between">
              <span>Items Ordered ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span className="text-xs font-normal text-slate-500">Includes taxes & discounts</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm hover:text-emerald-600 cursor-pointer transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                      <p className="text-xs font-medium text-slate-600 mt-2 bg-slate-100 inline-block px-2 py-0.5 rounded-md">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:items-end items-center border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                    <p className="font-bold text-slate-900 text-base">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                    
                    <button className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors">
                      <RotateCcw className="w-3 h-3" /> Buy again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Protection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-900">Standard Delivery</h4>
                <p className="text-xs text-emerald-700/80 mt-0.5">Carrier: {order.carrier}</p>
                <p className="text-xs font-medium text-emerald-800 mt-2">Est: {order.estimatedDelivery}</p>
              </div>
            </div>

            <div className="bg-slate-100/60 border border-slate-200/60 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-white text-slate-600 rounded-xl shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Buyer Protection</h4>
                <p className="text-xs text-slate-500 mt-0.5">Full refund if items are damaged or lost during delivery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Delivery Sidebars */}
        <div className="space-y-6">
          
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${order.summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">${order.summary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900">${order.summary.tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="text-xl font-extrabold text-emerald-600">${order.summary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-700">
                  {order.paymentMethod.type.toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Ending in •••• {order.paymentMethod.last4}
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">PAID</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Shipping Address
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-900">{order.shippingAddress.name}</p>
              <p className="mt-1">{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Download Invoice Button */}
          <button className="w-full py-3 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            Download Invoice (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}