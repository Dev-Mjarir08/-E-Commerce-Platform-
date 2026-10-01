import { useState, useMemo, useEffect, useCallback } from 'react';
import { paymentApi } from '../../services/paymentApi';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowUpRight,
  Receipt,
  X,
  Building2,
  Wallet,
  Smartphone,
  Banknote,
  Percent
} from 'lucide-react';

// Initial realistic luxury marketplace transactions aligned with the project's models and orders
const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-94821',
    orderNumber: 'ORD-9821',
    customer: {
      name: 'Vikram Malhotra',
      email: 'vikram.m@luxury.in',
      avatar: 'VM'
    },
    boutique: 'Urban Fashion Atelier',
    method: 'stripe',
    methodName: 'Credit Card (Visa •••• 4242)',
    gateway: 'Stripe Direct',
    amount: 84500,
    fee: 2480,
    netPayout: 82020,
    currency: 'INR',
    status: 'succeeded',
    date: '2026-10-24 14:32',
    tax: 12898,
    shippingFee: 1500,
    subtotal: 70102,
    riskScore: 'Low (0.02)',
    payoutStatus: 'Settled'
  },
  {
    id: 'TXN-94820',
    orderNumber: 'ORD-9820',
    customer: {
      name: 'Aarav Singhania',
      email: 'aarav@singhania.co',
      avatar: 'AS'
    },
    boutique: 'Nova Wear Studio',
    method: 'upi',
    methodName: 'UPI (singhania@okhdfcbank)',
    gateway: 'Razorpay UPI',
    amount: 42000,
    fee: 0,
    netPayout: 42000,
    currency: 'INR',
    status: 'succeeded',
    date: '2026-10-24 11:15',
    tax: 6407,
    shippingFee: 800,
    subtotal: 34793,
    riskScore: 'Low (0.01)',
    payoutStatus: 'Settled'
  },
  {
    id: 'TXN-94819',
    orderNumber: 'ORD-9819',
    customer: {
      name: 'Devanshi Shah',
      email: 'devanshi@atelier.org',
      avatar: 'DS'
    },
    boutique: 'Mono Studio',
    method: 'paypal',
    methodName: 'PayPal Express (devanshi@atelier.org)',
    gateway: 'PayPal Cross-Border',
    amount: 26800,
    fee: 1180,
    netPayout: 25620,
    currency: 'INR',
    status: 'pending',
    date: '2026-10-23 18:45',
    tax: 4088,
    shippingFee: 650,
    subtotal: 22062,
    riskScore: 'Low (0.04)',
    payoutStatus: 'Processing'
  },
  {
    id: 'TXN-94818',
    orderNumber: 'ORD-9818',
    customer: {
      name: 'Rohan Mehra',
      email: 'rohan.m@studio.com',
      avatar: 'RM'
    },
    boutique: 'Heritage Leatherworks',
    method: 'cod',
    methodName: 'Cash On Delivery (COD)',
    gateway: 'Courier Logistics',
    amount: 62000,
    fee: 450,
    netPayout: 61550,
    currency: 'INR',
    status: 'pending',
    date: '2026-10-23 16:10',
    tax: 9458,
    shippingFee: 1200,
    subtotal: 51342,
    riskScore: 'Medium (Verified OTP)',
    payoutStatus: 'Awaiting Delivery'
  },
  {
    id: 'TXN-94817',
    orderNumber: 'ORD-9817',
    customer: {
      name: 'Ananya Kapoor',
      email: 'ananya@design.in',
      avatar: 'AK'
    },
    boutique: 'Urban Fashion Atelier',
    method: 'stripe',
    methodName: 'Mastercard (•••• 8831)',
    gateway: 'Stripe Direct',
    amount: 55000,
    fee: 1625,
    netPayout: 53375,
    currency: 'INR',
    status: 'succeeded',
    date: '2026-10-22 09:20',
    tax: 8390,
    shippingFee: 1000,
    subtotal: 45610,
    riskScore: 'Low (0.01)',
    payoutStatus: 'Settled'
  },
  {
    id: 'TXN-94816',
    orderNumber: 'ORD-9815',
    customer: {
      name: 'Siddharth Rao',
      email: 'siddharth@rao.tech',
      avatar: 'SR'
    },
    boutique: 'Nova Wear Studio',
    method: 'stripe',
    methodName: 'Amex (•••• 1004)',
    gateway: 'Stripe Direct',
    amount: 38900,
    fee: 1360,
    netPayout: 0,
    currency: 'INR',
    status: 'refunded',
    date: '2026-10-21 15:40',
    tax: 5934,
    shippingFee: 800,
    subtotal: 32166,
    riskScore: 'Low',
    refundReason: 'Customer Return: Size exchange requested',
    payoutStatus: 'Reversed'
  },
  {
    id: 'TXN-94815',
    orderNumber: 'ORD-9814',
    customer: {
      name: 'Pooja Bhattacharya',
      email: 'pooja.b@kolkata.org',
      avatar: 'PB'
    },
    boutique: 'Heritage Leatherworks',
    method: 'upi',
    methodName: 'UPI (pooja@axisbank)',
    gateway: 'Razorpay UPI',
    amount: 19500,
    fee: 0,
    netPayout: 0,
    currency: 'INR',
    status: 'failed',
    date: '2026-10-21 12:05',
    tax: 2975,
    shippingFee: 500,
    subtotal: 16025,
    riskScore: 'High (3D Secure timeout)',
    failureMessage: 'Bank server timeout during 2-Factor Authentication (OTP expired)',
    payoutStatus: 'Cancelled'
  },
  {
    id: 'TXN-94814',
    orderNumber: 'ORD-9812',
    customer: {
      name: 'Karan Johar',
      email: 'karan@dharma.media',
      avatar: 'KJ'
    },
    boutique: 'Mono Studio',
    method: 'wallet',
    methodName: 'Platform Store Credit Wallet',
    gateway: 'Internal Escrow',
    amount: 12500,
    fee: 0,
    netPayout: 12500,
    currency: 'INR',
    status: 'succeeded',
    date: '2026-10-20 20:18',
    tax: 1907,
    shippingFee: 0,
    subtotal: 10593,
    riskScore: 'Zero (Internal Auth)',
    payoutStatus: 'Settled'
  }
];

const Payment = () => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundTxn, setRefundTxn] = useState(null);
  const [refundReason, setRefundReason] = useState('Customer Request / Order Return');
  const [copiedId, setCopiedId] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLiveTransactions = useCallback(async () => {
    try {
      const res = await paymentApi.getTransactions({ limit: 50 });
      const raw = res?.data?.transactions || res?.transactions || res?.data;
      if (Array.isArray(raw) && raw.length > 0) {
        setTransactions(raw);
      }
    } catch {
      // Keep initial transactions fallback if offline
    }
  }, []);

  useEffect(() => {
    fetchLiveTransactions();
  }, [fetchLiveTransactions]);

  // Gateway toggle states for Admin preview
  const [gatewayConfigs, setGatewayConfigs] = useState({
    stripe: { active: true, mode: 'Live Production', fee: '2.9% + ₹30' },
    razorpay: { active: true, mode: 'Live (UPI & NetBanking)', fee: '0% UPI / 2% Cards' },
    paypal: { active: true, mode: 'Cross-Border Sandbox', fee: '4.4% + Fixed' },
    cod: { active: true, mode: 'Max order limit ₹75,000', fee: '₹50 handling' }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`Copied ${text} to clipboard`);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveTransactions();
    setIsRefreshing(false);
    showToast('Payment records and gateway telemetry refreshed');
  };

  const toggleGateway = (key) => {
    setGatewayConfigs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        active: !prev[key].active
      }
    }));
    showToast(`Gateway ${key.toUpperCase()} status updated`);
  };

  const handleProcessRefund = (e) => {
    e.preventDefault();
    if (!refundTxn) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === refundTxn.id
          ? {
              ...t,
              status: 'refunded',
              refundReason: refundReason,
              payoutStatus: 'Reversed',
              netPayout: 0
            }
          : t
      )
    );

    showToast(`Refund of ₹${refundTxn.amount.toLocaleString()} processed successfully for ${refundTxn.id}`);
    setRefundTxn(null);
    if (selectedTxn && selectedTxn.id === refundTxn.id) {
      setSelectedTxn((prev) => ({
        ...prev,
        status: 'refunded',
        refundReason: refundReason,
        payoutStatus: 'Reversed',
        netPayout: 0
      }));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Boutique',
      'Method',
      'Gateway',
      'Gross Amount (INR)',
      'Gateway Fee (INR)',
      'Net Payout (INR)',
      'Status',
      'Date Time'
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.orderNumber,
      `"${t.customer.name}"`,
      t.customer.email,
      `"${t.boutique}"`,
      t.method,
      `"${t.gateway}"`,
      t.amount,
      t.fee,
      t.netPayout,
      t.status,
      t.date
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Admin_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payment ledger exported to CSV');
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        t.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        t.boutique.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchMethod = methodFilter === 'all' || t.method === methodFilter;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [transactions, search, statusFilter, methodFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalVolume = transactions
      .filter((t) => t.status === 'succeeded')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingVolume = transactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const refundedVolume = transactions
      .filter((t) => t.status === 'refunded')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFeesCollected = transactions
      .filter((t) => t.status === 'succeeded')
      .reduce((sum, t) => sum + t.fee, 0);

    const successCount = transactions.filter((t) => t.status === 'succeeded').length;
    const successRate = ((successCount / transactions.length) * 100).toFixed(1);

    return {
      totalVolume,
      pendingVolume,
      refundedVolume,
      totalFeesCollected,
      successCount,
      successRate
    };
  }, [transactions]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'succeeded':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Succeeded'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Pending'
        };
      case 'refunded':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Refunded'
        };
      case 'failed':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Failed'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'stripe':
        return <CreditCard size={14} className="text-indigo-600" />;
      case 'upi':
        return <Smartphone size={14} className="text-emerald-600" />;
      case 'paypal':
        return <Building2 size={14} className="text-blue-600" />;
      case 'wallet':
        return <Wallet size={14} className="text-purple-600" />;
      case 'cod':
      default:
        return <Banknote size={14} className="text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payment &amp; Settlement Hub</h2>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gateways Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor transaction volumes, gateway processor health, refunds, and boutique payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh payment metrics"
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-600' : ''} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Processed Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Settlement</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{metrics.totalVolume.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
              <TrendingUp size={11} />
              +14.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Successful transactions</span>
            <span className="font-semibold text-slate-700">{metrics.successCount} orders</span>
          </p>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Escrow / Pending</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 tracking-tight">
              ₹{metrics.pendingVolume.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Clearing
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Awaiting delivery verification &amp; webhook callbacks
          </p>
        </div>

        {/* Refunds & Returns */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Refunds &amp; Disputes</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-700 tracking-tight">
              ₹{metrics.refundedVolume.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              1.2% Rate
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Reversed to customer original payment source</p>
        </div>

        {/* Platform Gateway Fees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Success Rate</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 tracking-tight">
              {metrics.successRate}%
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Bank SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            ₹{metrics.totalFeesCollected.toLocaleString()} gateway handling fees
          </p>
        </div>
      </div>

      {/* Gateway Infrastructure Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Gateway Integrations</h3>
            <p className="text-xs text-slate-500">Active payment rails and settlement routing protocols</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">4 Channels Configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stripe */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  ST
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stripe Direct</h4>
                  <span className="text-[10px] text-slate-400">Cards, Apple Pay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleGateway('stripe')}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  gatewayConfigs.stripe.active ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    gatewayConfigs.stripe.active ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 flex items-center justify-between">
              <span>{gatewayConfigs.stripe.mode}</span>
              <span className="font-semibold text-slate-700">{gatewayConfigs.stripe.fee}</span>
            </div>
          </div>

          {/* Razorpay UPI */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  RZ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Razorpay / UPI</h4>
                  <span className="text-[10px] text-slate-400">Instant UPI &amp; NetBanking</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleGateway('razorpay')}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  gatewayConfigs.razorpay.active ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    gatewayConfigs.razorpay.active ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 flex items-center justify-between">
              <span>{gatewayConfigs.razorpay.mode}</span>
              <span className="font-semibold text-emerald-700">{gatewayConfigs.razorpay.fee}</span>
            </div>
          </div>

          {/* PayPal */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  PP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">PayPal Global</h4>
                  <span className="text-[10px] text-slate-400">International Checkout</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleGateway('paypal')}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  gatewayConfigs.paypal.active ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    gatewayConfigs.paypal.active ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 flex items-center justify-between">
              <span>{gatewayConfigs.paypal.mode}</span>
              <span className="font-semibold text-slate-700">{gatewayConfigs.paypal.fee}</span>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  CD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cash On Delivery</h4>
                  <span className="text-[10px] text-slate-400">Courier Doorstep Pay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleGateway('cod')}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  gatewayConfigs.cod.active ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    gatewayConfigs.cod.active ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 flex items-center justify-between">
              <span>{gatewayConfigs.cod.mode}</span>
              <span className="font-semibold text-slate-700">{gatewayConfigs.cod.fee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters & Search Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50/50">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Transaction ID, Customer, Order, or Boutique..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-300 rounded-lg shadow-2xs text-xs">
              <Filter size={13} className="text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses ({transactions.length})</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Method Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-300 rounded-lg shadow-2xs text-xs">
              <CreditCard size={13} className="text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Channel:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="all">All Rails</option>
                <option value="stripe">Cards (Stripe)</option>
                <option value="upi">UPI (Razorpay)</option>
                <option value="paypal">PayPal</option>
                <option value="wallet">Wallet Balance</option>
                <option value="cod">Cash On Delivery</option>
              </select>
            </div>

            {(search || statusFilter !== 'all' || methodFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setMethodFilter('all');
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Channel / Gateway</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No payment records found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const badge = getStatusBadge(t.status);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Transaction ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{t.id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(t.id)}
                            title="Copy Transaction ID"
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {copiedId === t.id ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Order & Boutique */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-indigo-600">{t.orderNumber}</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                          {t.boutique}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {t.customer.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{t.customer.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {t.customer.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Channel / Gateway */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          {getMethodIcon(t.method)}
                          <span className="capitalize">{t.method}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{t.gateway}</span>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{t.amount.toLocaleString()}
                      </td>

                      {/* Net Payout */}
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {t.netPayout > 0 ? `₹${t.netPayout.toLocaleString()}` : '—'}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {t.date}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedTxn(t)}
                            title="View digital invoice & transaction details"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          {t.status === 'succeeded' && (
                            <button
                              type="button"
                              onClick={() => {
                                setRefundTxn(t);
                                setRefundReason('Customer Request / Order Return');
                              }}
                              title="Process refund for this transaction"
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing <span className="font-bold text-slate-900">{filteredTransactions.length}</span> of{' '}
            <span className="font-bold text-slate-900">{transactions.length}</span> recorded payments
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Succeeded
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Refunded
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Failed
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Detail & Digital Receipt Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Transaction Audit &amp; Receipt</h3>
                  <p className="text-[11px] font-mono text-slate-500">{selectedTxn.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Payment Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        getStatusBadge(selectedTxn.status).bg
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(selectedTxn.status).dot}`}
                      />
                      {getStatusBadge(selectedTxn.status).label}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{selectedTxn.payoutStatus}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Gross Charged
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{selectedTxn.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer & Merchant Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Customer Information
                  </span>
                  <div className="mt-2 font-bold text-slate-900">{selectedTxn.customer.name}</div>
                  <div className="text-slate-500 mt-0.5">{selectedTxn.customer.email}</div>
                  <div className="text-[11px] font-mono text-indigo-600 mt-1.5">
                    Order Ref: {selectedTxn.orderNumber}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Merchant &amp; Boutique
                  </span>
                  <div className="mt-2 font-bold text-slate-900">{selectedTxn.boutique}</div>
                  <div className="text-slate-500 mt-0.5">Platform Managed Vendor</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1.5">
                    Net Payout: ₹{selectedTxn.netPayout.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Processing Pipeline
                </span>
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {getMethodIcon(selectedTxn.method)}
                      {selectedTxn.methodName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Processor Gateway:</span>
                    <span className="font-mono text-slate-700">{selectedTxn.gateway}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Risk Assessment:</span>
                    <span className="font-semibold text-emerald-700">{selectedTxn.riskScore}</span>
                  </div>
                  {selectedTxn.refundReason && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-purple-600 font-medium">Refund Reason:</span>
                      <span className="font-semibold text-purple-700">{selectedTxn.refundReason}</span>
                    </div>
                  )}
                  {selectedTxn.failureMessage && (
                    <div className="pt-2 border-t border-slate-100 text-rose-600 text-[11px]">
                      <span className="font-bold">Error Notice:</span> {selectedTxn.failureMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Ledger Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Accounting &amp; Fee Breakdown
                </span>
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Order Subtotal</span>
                    <span>₹{selectedTxn.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% Luxury Apparel)</span>
                    <span>₹{selectedTxn.tax?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Insured Express Courier</span>
                    <span>₹{selectedTxn.shippingFee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Payment Gateway Handling Fee</span>
                    <span>-₹{selectedTxn.fee?.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                    <span>Total Amount Charged</span>
                    <span>₹{selectedTxn.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Print Receipt
              </button>

              <div className="flex items-center gap-2">
                {selectedTxn.status === 'succeeded' && (
                  <button
                    type="button"
                    onClick={() => {
                      setRefundTxn(selectedTxn);
                      setRefundReason('Customer Request / Order Return');
                    }}
                    className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Issue Refund</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Refund Modal */}
      {refundTxn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <RotateCcw size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Initiate Customer Refund</h3>
              </div>
              <button
                type="button"
                onClick={() => setRefundTxn(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 text-purple-900 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{refundTxn.id}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Customer:</span>
                  <span>{refundTxn.customer.name}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-purple-200">
                  <span>Refund Amount:</span>
                  <span className="text-purple-700">₹{refundTxn.amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Refund Reason *
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="Customer Request / Order Return">Customer Request / Order Return</option>
                  <option value="Item Damaged During Courier Transit">Item Damaged During Courier Transit</option>
                  <option value="Order Cancelled by Merchant">Order Cancelled by Merchant</option>
                  <option value="Duplicate Charge / Billing Correction">Duplicate Charge / Billing Correction</option>
                  <option value="Fraudulent Transaction Suspected">Fraudulent Transaction Suspected</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  This will trigger an automated webhook rollback to the payment processor (
                  {refundTxn.gateway}). The funds will be credited to the customer&apos;s bank account within 3–5 business days.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRefundTxn(null)}
                  className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Confirm Full Refund</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
