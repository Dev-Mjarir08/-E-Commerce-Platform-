import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  User,
  Store,
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertTriangle,
  FileText,
  Package,
} from "lucide-react";

const refunds = [
  {
    id: "REF-1001",
    orderId: "ORD-5821",
    customer: "Aarav Mehta",
    vendor: "Royal Attire",
    reason: "Product damaged",
    amount: 4999,
    type: "Refund",
    status: "pending",
    date: "Sep 19, 2026",
  },
  {
    id: "REF-1002",
    orderId: "ORD-5825",
    customer: "Riya Shah",
    vendor: "Maison Studio",
    reason: "Wrong size",
    amount: 7299,
    type: "Return",
    status: "approved",
    date: "Sep 19, 2026",
  },
  {
    id: "REF-1003",
    orderId: "ORD-5830",
    customer: "Kabir Patel",
    vendor: "Urban Luxe",
    reason: "Item not as described",
    amount: 8999,
    type: "Refund",
    status: "under_review",
    date: "Sep 20, 2026",
  },
  {
    id: "REF-1004",
    orderId: "ORD-5833",
    customer: "Meera Joshi",
    vendor: "Classic Wardrobe",
    reason: "Changed mind",
    amount: 3299,
    type: "Return",
    status: "rejected",
    date: "Sep 20, 2026",
  },
  {
    id: "REF-1005",
    orderId: "ORD-5839",
    customer: "Dev Malhotra",
    vendor: "The Fashion House",
    reason: "Missing accessory",
    amount: 11999,
    type: "Refund",
    status: "pending",
    date: "Sep 21, 2026",
  },
];

const RefundDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const refund = refunds.find((item) => item.id === id);

  if (!refund) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <RotateCcw className="w-10 h-10 text-slate-300 mx-auto mb-3" />

        <h2 className="text-lg font-bold text-slate-800">
          Refund Request Not Found
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          The refund request you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/refunds")}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          <ArrowLeft size={15} />
          Back to Refunds
        </button>
      </div>
    );
  }

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },
    under_review: {
      label: "Under Review",
      icon: AlertTriangle,
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className:
        "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const config =
    statusConfig[refund.status] || statusConfig.pending;

  const StatusIcon = config.icon;

  const isPending =
    refund.status === "pending" ||
    refund.status === "under_review";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <button
          type="button"
          onClick={() => navigate("/admin/refunds")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4"
        >
          <ArrowLeft size={14} />
          Back to Refunds
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <RotateCcw
                size={20}
                className="text-indigo-600"
              />

              <h1 className="text-xl font-bold text-slate-900">
                Refund Details
              </h1>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${config.className}`}
              >
                <StatusIcon size={11} />
                {config.label}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Request ID: {refund.id}
            </p>
          </div>

          {/* Header Actions */}
          {isPending && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 bg-white text-rose-600 text-xs font-semibold hover:bg-rose-50"
              >
                <XCircle size={14} />
                Reject
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Approve Refund
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag
              size={17}
              className="text-indigo-600"
            />

            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Order
            </span>
          </div>

          <div className="text-lg font-black text-slate-900 mt-3">
            #{refund.orderId.replace("#", "")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <IndianRupee
              size={17}
              className="text-emerald-600"
            />

            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Amount
            </span>
          </div>

          <div className="text-lg font-black text-slate-900 font-mono mt-3">
            ₹{refund.amount.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText
              size={17}
              className="text-purple-600"
            />

            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Request Type
            </span>
          </div>

          <div className="text-lg font-black text-slate-900 mt-3">
            {refund.type}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={17}
              className="text-amber-600"
            />

            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Request Date
            </span>
          </div>

          <div className="text-sm font-bold text-slate-900 mt-3">
            {refund.date}
          </div>
        </div>
      </div>

      {/* Customer + Vendor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2">
            <User
              size={17}
              className="text-indigo-600"
            />

            <h2 className="text-sm font-bold text-slate-900">
              Customer Information
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <User size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {refund.customer}
              </p>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Customer associated with this request
              </p>
            </div>
          </div>
        </div>

        {/* Vendor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2">
            <Store
              size={17}
              className="text-emerald-600"
            />

            <h2 className="text-sm font-bold text-slate-900">
              Vendor Information
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Store size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {refund.vendor}
              </p>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Vendor associated with this request
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={17}
              className="text-amber-600"
            />

            <h2 className="text-sm font-bold text-slate-900">
              Dispute Information
            </h2>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Reason
              </span>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {refund.reason}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Request Type
              </span>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {refund.type}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Refund Request ID
              </span>

              <p className="text-sm font-mono font-semibold text-indigo-600 mt-1">
                {refund.id}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Order ID
              </span>

              <p className="text-sm font-mono font-semibold text-indigo-600 mt-1">
                {refund.orderId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Checklist */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={18}
            className="text-indigo-600 mt-0.5 shrink-0"
          />

          <div>
            <h3 className="text-xs font-bold text-indigo-900">
              Post-order review checklist
            </h3>

            <ul className="mt-2 space-y-1.5 text-[11px] text-indigo-700">
              <li>
                • Verify the original order information.
              </li>

              <li>
                • Review customer evidence and the stated reason.
              </li>

              <li>
                • Check the vendor response.
              </li>

              <li>
                • Confirm the applicable return/refund policy.
              </li>

              <li>
                • Confirm the refund amount before approving.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Decision */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2">
          <Package
            size={17}
            className="text-slate-500"
          />

          <h2 className="text-sm font-bold text-slate-900">
            Current Decision
          </h2>
        </div>

        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.className}`}
          >
            <StatusIcon size={14} />
            {config.label}
          </span>
        </div>

        {isPending && (
          <p className="text-[11px] text-slate-400 mt-3">
            This request is awaiting an administrative decision.
          </p>
        )}

        {refund.status === "approved" && (
          <p className="text-[11px] text-emerald-600 mt-3 font-semibold">
            This refund request has been approved.
          </p>
        )}

        {refund.status === "rejected" && (
          <p className="text-[11px] text-rose-600 mt-3 font-semibold">
            This refund request has been rejected.
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => navigate("/admin/refunds")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          Back to Refunds
        </button>
      </div>
    </div>
  );
};

export default RefundDetails;