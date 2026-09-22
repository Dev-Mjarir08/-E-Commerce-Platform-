import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Store,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

const payoutData = [
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

const PayoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const payout = payoutData.find((item) => item.id === id);

  if (!payout) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Payout not found
        </h2>

        <button
          onClick={() => navigate("/admin/payouts")}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
        >
          Back to Payouts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/admin/payouts")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to Payouts
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Wallet className="text-indigo-600" size={22} />

              <h1 className="text-2xl font-bold text-slate-900">
                Payout Details
              </h1>
            </div>

            <p className="text-sm text-slate-400 mt-1">
              Payout ID: {payout.id}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-700">
            {payout.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">
            Gross Amount
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            ₹{payout.amount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">
            Commission
          </p>

          <p className="mt-2 text-2xl font-black text-indigo-600">
            ₹{payout.commission.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">
            Net Payout
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-600">
            ₹{payout.netAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Payout Information
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-400">Vendor</p>

            <div className="flex items-center gap-2 mt-1">
              <Store size={16} className="text-indigo-600" />

              <span className="font-semibold text-slate-900">
                {payout.vendor}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400">Email</p>

            <p className="mt-1 font-semibold text-slate-900">
              {payout.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Payment Method</p>

            <p className="mt-1 font-semibold text-slate-900">
              {payout.method}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Payout Date</p>

            <p className="mt-1 font-semibold text-slate-900">
              {payout.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetails;