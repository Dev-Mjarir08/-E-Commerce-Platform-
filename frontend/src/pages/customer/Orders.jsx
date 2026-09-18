import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Heart,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';

// Sample mock orders structured to match backend/models/Order.js and OrderItem.js
const MOCK_CUSTOMER_ORDERS = [
  {
    _id: 'ord_901',
    orderNumber: 'ATL-89241',
    createdAt: '2026-09-12T14:30:00Z',
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    trackingNumber: 'TRK-9821-4401-IN',
    carrier: 'BlueDart Express',
    estimatedDelivery: '16 Sep 2026',
    subtotal: 12500,
    taxPrice: 0,
    shippingPrice: 0,
    discountAmount: 1250,
    totalPrice: 11250,
    shippingAddress: {
      recipientName: 'Jarir Multani',
      phone: '+91 45678 91230',
      street: 'Gujrat',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    items: [
      {
        _id: 'item_101',
        product: 'prod_1',
        name: 'Structured Double-Breasted Wool Blazer',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        price: 8500,
        quantity: 1,
        size: '40R',
        color: 'Midnight Navy',
        status: 'shipped'
      },
      {
        _id: 'item_102',
        product: 'prod_2',
        name: 'Silk-Cotton Tapered Trousers',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
        price: 4000,
        quantity: 1,
        size: '32',
        color: 'Charcoal',
        status: 'shipped'
      }
    ]
  },
  {
    _id: 'ord_902',
    orderNumber: 'ATL-77309',
    createdAt: '2026-08-28T09:15:00Z',
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    trackingNumber: 'TRK-7710-3392-IN',
    carrier: 'DHL Express',
    deliveredAt: '2026-08-31T16:20:00Z',
    subtotal: 6500,
    taxPrice: 0,
    shippingPrice: 99,
    discountAmount: 0,
    totalPrice: 6599,
    shippingAddress: {
      recipientName: 'Ayaan Ali (Atelier Studio)',
      phone: '+91 13245 67890',
      street: 'Hafiz Babanagar Bandlaguda',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '400051',
      country: 'India'
    },
    items: [
      {
        _id: 'item_103',
        product: 'prod_3',
        name: 'Merino Wool Ribbed Turtleneck Sweater',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
        price: 6500,
        quantity: 1,
        size: 'L',
        color: 'Oatmeal Milk',
        status: 'delivered'
      }
    ]
  },
  {
    _id: 'ord_903',
    orderNumber: 'ATL-61204',
    createdAt: '2026-08-10T11:45:00Z',
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'stripe',
    cancelledAt: '2026-08-10T14:00:00Z',
    cancellationReason: 'Requested by client prior to dispatch',
    subtotal: 18000,
    taxPrice: 0,
    shippingPrice: 0,
    discountAmount: 1800,
    totalPrice: 16200,
    shippingAddress: {
      recipientName: 'Jarir Multani',
      phone: '+91 45678 91230',
      street: 'Gujrat',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    items: [
      {
        _id: 'item_104',
        product: 'prod_4',
        name: 'Italian Calfskin Derby Shoes',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
        price: 18000,
        quantity: 1,
        size: '42 EU',
        color: 'Espresso Brown',
        status: 'cancelled'
      }
    ]
  }
];

export const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Component local state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'in_progress' | 'delivered' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Toast feedback helper
  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simulate data fetching / Redux state integration
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Load stored orders or fallback to curated mock orders
        const stored = localStorage.getItem('atelier_customer_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
            setLoading(false);
            return;
          }
        }
        setOrders(MOCK_CUSTOMER_ORDERS);
        setLoading(false);
      } catch (err) {
        console.warn('Failed to load orders:', err);
        setError('Unable to retrieve your order history. Please try refreshing.');
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status Filter Match
      let matchesStatus = true;
      if (statusFilter === 'in_progress') {
        matchesStatus = ['placed', 'confirmed', 'processing', 'shipped'].includes(
          order.orderStatus
        );
      } else if (statusFilter === 'delivered') {
        matchesStatus = order.orderStatus === 'delivered';
      } else if (statusFilter === 'cancelled') {
        matchesStatus = order.orderStatus === 'cancelled';
      }

      // Search Query Match (Order ID, Item Name, Tracking Number)
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesTracking = (order.trackingNumber || '').toLowerCase().includes(query);
        const matchesItems = order.items.some((item) =>
          item.name.toLowerCase().includes(query)
        );
        matchesSearch = matchesNumber || matchesTracking || matchesItems;
      }

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Format Date String helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Copy tracking number to clipboard
  const handleCopyTracking = (tracking) => {
    if (!tracking) return;
    navigator.clipboard.writeText(tracking);
    setCopiedTracking(tracking);
    showToast('success', `Copied tracking number ${tracking} to clipboard.`);
    setTimeout(() => setCopiedTracking(null), 3000);
  };

  // Reorder items (add back to cart)
  const handleReorderItem = (item) => {
    dispatch(
      addToCart({
        product: {
          id: item.product || item._id,
          _id: item.product || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          inStock: true
        },
        size: item.size || 'Standard',
        color: item.color || 'Classic',
        quantity: 1
      })
    );
    showToast('success', `Added "${item.name}" to active shopping bag.`);
  };

  // Render Order Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10px] font-mono uppercase tracking-wider font-medium">
            <Truck className="w-3.5 h-3.5 text-indigo-700" />
            <span>DISPATCHED & IN TRANSIT</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-mono uppercase tracking-wider font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>DELIVERED</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-900 text-[10px] font-mono uppercase tracking-wider font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>CANCELLED</span>
          </span>
        );
      case 'processing':
      case 'confirmed':
      case 'placed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono uppercase tracking-wider font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>PROCESSING IN ATELIER</span>
          </span>
        );
    }
  };

  // Render Payment Status Badge
  const renderPaymentBadge = (payStatus) => {
    if (payStatus === 'paid') {
      return (
        <span className="text-[10px] font-mono uppercase text-emerald-800 tracking-wider">
          • PAID
        </span>
      );
    }
    if (payStatus === 'refunded') {
      return (
        <span className="text-[10px] font-mono uppercase text-purple-800 tracking-wider">
          • REFUNDED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono uppercase text-amber-800 tracking-wider">
        • PAYMENT PENDING
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
              CLIENT PORTAL • ACQUISITIONS & ORDER ARCHIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase flex items-center gap-3">
              <span>Your Orders Archive</span>
              <span className="text-sm font-mono bg-[#111111] text-[#F8F7F4] px-3 py-1 rounded-none">
                {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[#111111] text-xs font-mono uppercase tracking-wider transition-all rounded-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Active Bag</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-all rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : toastMessage.type === 'error'
                ? 'bg-rose-50/80 border-rose-300 text-rose-900'
                : 'bg-amber-50/80 border-amber-300 text-amber-900'
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

        {/* Filters & Search Control Bar */}
        <div className="mb-8 bg-[#FFFFFF] border border-[#E5E3DF] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center flex-wrap gap-1 border-b sm:border-b-0 border-[#E5E3DF] pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'ALL ORDERS' },
              { id: 'in_progress', label: 'IN PROGRESS' },
              { id: 'delivered', label: 'DELIVERED' },
              { id: 'cancelled', label: 'CANCELLED' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#111111] text-[#F8F7F4]'
                    : 'text-[#666666] hover:text-[#111111] hover:bg-[#F8F7F4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or item..."
              className="w-full bg-[#F8F7F4] border border-[#E5E3DF] pl-9 pr-4 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#8E877F]"
            />
            <Search className="w-3.5 h-3.5 text-[#8E877F] absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Loading State Display */}
        {loading ? (
          <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-16 text-center space-y-4 shadow-xs">
            <div className="w-8 h-8 mx-auto border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
              Retrieving Order Archive...
            </p>
          </div>
        ) : error ? (
          /* Error Banner Display */
          <div className="bg-rose-50 border border-rose-300 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-serif text-lg uppercase text-rose-900">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-900 text-white text-xs font-mono uppercase tracking-wider"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty Orders Display */
          <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F8F7F4] border border-[#E5E3DF] flex items-center justify-center text-[#8E877F]">
              <Package className="w-10 h-10 stroke-[1.25] text-[#8E877F]" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F]">
                NO ORDERS FOUND
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#111111]">
                {searchQuery || statusFilter !== 'all'
                  ? 'No matching orders found'
                  : 'You Have No Order History'}
              </h2>
              <p className="text-xs text-[#666666] font-sans leading-relaxed">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try clearing your search query or switching filter tabs.'
                  : 'When you place acquisitions, your order confirmations, tracking details, and invoice receipts will be archived here.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {searchQuery || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="px-6 py-2.5 border border-[#111111] text-xs font-mono uppercase text-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] transition-colors"
                >
                  Reset Filters
                </button>
              ) : (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-[#111111] text-[#F8F7F4] px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Main Orders List */
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] border border-[#E5E3DF] shadow-xs hover:border-[#8E877F] transition-all overflow-hidden"
              >
                {/* Order Top Bar Info */}
                <div className="bg-[#F8F7F4]/60 border-b border-[#E5E3DF] p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-[10px] text-[#8E877F] uppercase block tracking-wider">
                        ORDER NUMBER
                      </span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {order.orderNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8E877F] uppercase block tracking-wider">
                        DATE PLACED
                      </span>
                      <span className="text-[#111111]">{formatDate(order.createdAt)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8E877F] uppercase block tracking-wider">
                        TOTAL AMOUNT
                      </span>
                      <span className="font-semibold text-[#111111]">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </span>
                      {renderPaymentBadge(order.paymentStatus)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStatusBadge(order.orderStatus)}
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-3 py-1 bg-[#111111] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Tracking & Shipping Details Sub-bar if active */}
                {order.trackingNumber && (
                  <div className="px-6 py-3 bg-[#FFFFFF] border-b border-[#E5E3DF] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#666666]">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#111111]" />
                      <span>
                        Carrier: <strong className="text-[#111111]">{order.carrier || 'Express'}</strong> • Tracking:{' '}
                        <strong className="text-[#111111]">{order.trackingNumber}</strong>
                      </span>
                      <button
                        onClick={() => handleCopyTracking(order.trackingNumber)}
                        className="p-1 hover:text-[#111111] transition-colors"
                        title="Copy tracking number"
                      >
                        {copiedTracking === order.trackingNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {order.estimatedDelivery && (
                      <span className="text-[11px] text-indigo-900 bg-indigo-50 px-2.5 py-0.5 border border-indigo-200">
                        ESTIMATED ARRIVAL: {order.estimatedDelivery}
                      </span>
                    )}
                  </div>
                )}

                {/* Order Items Loop */}
                <div className="divide-y divide-[#E5E3DF]">
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#F8F7F4]/30 transition-colors"
                    >
                      {/* Thumbnail & Item info */}
                      <div className="flex gap-4 items-start sm:items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-[#F8F7F4] border border-[#E5E3DF] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E877F]">
                            ITEM {idx + 1} OF {order.items.length}
                          </span>
                          <h4 className="font-serif text-base sm:text-lg uppercase text-[#111111] leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">
                            Size: <span className="text-[#111111]">{item.size}</span> • Color:{' '}
                            <span className="text-[#111111]">{item.color}</span> • Qty:{' '}
                            <span className="text-[#111111]">{item.quantity}</span>
                          </p>
                          <span className="font-mono text-sm font-semibold text-[#111111] block pt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Action CTAs for Item */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E3DF]">
                        <button
                          type="button"
                          onClick={() => handleReorderItem(item)}
                          className="px-4 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Summary & Address Details */}
                <div className="bg-[#F8F7F4]/40 px-6 py-4 border-t border-[#E5E3DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#666666]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8E877F] shrink-0" />
                    <span>
                      Deliver to:{' '}
                      <strong className="text-[#111111]">
                        {order.shippingAddress?.recipientName}
                      </strong>{' '}
                      ({order.shippingAddress?.city}, {order.shippingAddress?.postalCode})
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-[#8E877F]">
                      PAYMENT METHOD: {order.paymentMethod?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Client Navigation Footer Menu */}
        <div className="mt-12 bg-[#FFFFFF] border border-[#E5E3DF] p-6 space-y-3 shadow-xs">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] mb-4">
            CLIENT ACCOUNT NAVIGATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
            >
              <User className="w-4 h-4 text-[#8E877F]" />
              <span>Profile</span>
            </Link>

            <Link
              to="/addresses"
              className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#8E877F]" />
              <span>Addresses</span>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#8E877F]" />
              <span>Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#8E877F]" />
              <span>Active Bag</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
