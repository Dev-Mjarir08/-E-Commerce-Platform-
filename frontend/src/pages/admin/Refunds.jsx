import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RotateCcw,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertTriangle,
  Eye,
  ShoppingBag,
  IndianRupee,
  User,
  Store,
} from "lucide-react";

const initialRefunds = [
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

const Refunds = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState(initialRefunds);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(search) ||
        item.orderId.toLowerCase().includes(search) ||
        item.customer.toLowerCase().includes(search) ||
        item.vendor.toLowerCase().includes(search) ||
        item.reason.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      const matchesType = selectedType === "all" || item.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [refunds, searchTerm, selectedStatus, selectedType]);

  const summary = useMemo(() => {
    return {
      total: refunds.length,

      pending: refunds.filter(
        (item) => item.status === "pending" || item.status === "under_review",
      ).length,

      approved: refunds.filter((item) => item.status === "approved").length,

      amount: refunds
        .filter(
          (item) => item.status === "pending" || item.status === "under_review",
        )
        .reduce((sum, item) => sum + item.amount, 0),
    };
  }, [refunds]);

  const updateStatus = (id, status) => {
    setRefunds((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const statusBadge = (status) => {
    const labels = {
      pending: "Pending",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
    };

    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      under_review: "bg-indigo-50 text-indigo-700 border-indigo-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          styles[status]
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600" />

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Refunds & Return Disputes
            </h2>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
              Post-Order
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Review return requests, refund disputes, damaged products, and
            post-order customer claims.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin text-indigo-600" : ""}
          />
          Refresh Requests
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <RotateCcw size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Total Requests
            </span>

            <div className="text-xl font-black text-slate-900">
              {summary.total}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock3 size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Awaiting Decision
            </span>

            <div className="text-xl font-black text-amber-700">
              {summary.pending}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Approved
            </span>

            <div className="text-xl font-black text-emerald-700">
              {summary.approved}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <IndianRupee size={19} />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Amount Under Review
            </span>

            <div className="text-xl font-black text-rose-700 font-mono">
              ₹{summary.amount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-96">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search refund ID, order, customer or vendor..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-slate-400" />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="Refund">Refunds</option>
            <option value="Return">Returns</option>
          </select>
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
        <AlertTriangle size={17} className="text-indigo-600 shrink-0 mt-0.5" />

        <div>
          <p className="text-xs font-bold text-indigo-900">
            Post-order review queue
          </p>

          <p className="text-[11px] text-indigo-700 mt-1">
            Verify order information, customer evidence, vendor response, and
            applicable return policy before approving a dispute.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                <th className="px-4 py-3.5">Request</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900">{item.id}</div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <ShoppingBag size={10} />
                      {item.orderId}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.date}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                        <User size={14} />
                      </div>

                      <span className="font-bold text-slate-800">
                        {item.customer}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                        <Store size={14} />
                      </div>

                      <span className="font-semibold text-slate-700">
                        {item.vendor}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700">
                      {item.reason}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-black text-slate-900 font-mono">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.type === "Refund"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="px-4 py-4">{statusBadge(item.status)}</td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end items-center gap-1.5">
                      {(item.status === "pending" ||
                        item.status === "under_review") && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateStatus(item.id, "approved")}
                            title="Approve request"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(item.id, "rejected")}
                            title="Reject request"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        title="View refund details"
                        onClick={() => navigate(`/admin/refunds/${item.id}`)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-[11px] font-semibold"
                      >
                        {" "}
                        <Eye size={14} /> View{" "}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <RotateCcw className="w-10 h-10 text-slate-300 mx-auto mb-2" />

                    <p className="text-sm font-bold text-slate-700">
                      No Refund Requests Found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Refunds;
