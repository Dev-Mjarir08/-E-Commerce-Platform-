import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Store,
  IndianRupee,
  Eye,
  Download,
} from "lucide-react";

const initialPayouts = [
  {
    id: "PAY-1001",
    vendor: "Royal Attire",
    email: "royal@example.com",
    amount: 48500,
    commission: 4850,
    netAmount: 43650,
    status: "paid",
    method: "Bank Transfer",
    date: "Sep 18, 2026",
  },
  {
    id: "PAY-1002",
    vendor: "Urban Luxe",
    email: "urban@example.com",
    amount: 32750,
    commission: 3275,
    netAmount: 29475,
    status: "pending",
    method: "Bank Transfer",
    date: "Sep 19, 2026",
  },
  {
    id: "PAY-1003",
    vendor: "Maison Studio",
    email: "maison@example.com",
    amount: 72800,
    commission: 7280,
    netAmount: 65520,
    status: "processing",
    method: "UPI",
    date: "Sep 20, 2026",
  },
  {
    id: "PAY-1004",
    vendor: "Classic Wardrobe",
    email: "classic@example.com",
    amount: 21800,
    commission: 2180,
    netAmount: 19620,
    status: "paid",
    method: "Bank Transfer",
    date: "Sep 20, 2026",
  },
  {
    id: "PAY-1005",
    vendor: "The Fashion House",
    email: "fashion@example.com",
    amount: 56300,
    commission: 5630,
    netAmount: 50670,
    status: "failed",
    method: "Bank Transfer",
    date: "Sep 21, 2026",
  },
];

const Payouts = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState(initialPayouts);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      const matchesSearch =
        payout.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = status === "all" || payout.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [payouts, searchTerm, status]);

  const summary = useMemo(() => {
    return {
      total: payouts.reduce((sum, item) => sum + item.amount, 0),
      commission: payouts.reduce((sum, item) => sum + item.commission, 0),
      paid: payouts
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + item.netAmount, 0),
      pending: payouts
        .filter(
          (item) => item.status === "pending" || item.status === "processing",
        )
        .reduce((sum, item) => sum + item.netAmount, 0),
    };
  }, [payouts]);

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const handleMarkPaid = (id) => {
    setPayouts((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "paid",
            }
          : item,
      ),
    );
  };

  const statusBadge = (value) => {
    const styles = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
      failed: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          styles[value] || "bg-slate-50 text-slate-600 border-slate-200"
        }`}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Vendor Payouts & Commission
            </h2>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Finance Center
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Monitor vendor earnings, platform commissions, payout status, and
            settlement activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-indigo-600" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Gross Vendor Sales
            </span>

            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>

          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            ₹{summary.total.toLocaleString("en-IN")}
          </div>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight size={13} />
            Platform transaction volume
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Platform Commission
            </span>

            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet size={18} />
            </div>
          </div>

          <div className="mt-3 text-2xl font-black text-emerald-700 font-mono">
            ₹{summary.commission.toLocaleString("en-IN")}
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Commission retained by platform
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Paid Out
            </span>

            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            ₹{summary.paid.toLocaleString("en-IN")}
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Successfully settled vendor funds
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Pending Settlement
            </span>

            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={18} />
            </div>
          </div>

          <div className="mt-3 text-2xl font-black text-amber-700 font-mono">
            ₹{summary.pending.toLocaleString("en-IN")}
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Awaiting payout processing
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor, email or payout ID..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                <th className="px-4 py-3.5">Payout</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Gross Amount</th>
                <th className="px-4 py-3.5">Commission</th>
                <th className="px-4 py-3.5">Net Payout</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900">{payout.id}</div>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {payout.date}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Store size={15} />
                      </div>

                      <div>
                        <div className="font-bold text-slate-900">
                          {payout.vendor}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {payout.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-800 font-mono">
                    ₹{payout.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4 font-bold text-indigo-600 font-mono">
                    ₹{payout.commission.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4 font-black text-emerald-700 font-mono">
                    ₹{payout.netAmount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4 text-slate-500">{payout.method}</td>

                  <td className="px-4 py-4">{statusBadge(payout.status)}</td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end items-center gap-1.5">
                      {payout.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleMarkPaid(payout.id)}
                          title="Mark as paid"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="View payout"
                        onClick={() => navigate(`/admin/payouts/${payout.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <AlertCircle className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">
                      No payouts found
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

export default Payouts;
