import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

const customers = [
  {
    id: "CUST-01",
    name: "Vikram Malhotra",
    email: "vikram.m@luxury.in",
    phone: "+91 98765 43210",
    orders: 8,
    totalSpend: "₹4,12,000",
    joined: "Jan 2026",
    tier: "VIP Member",
    status: "Active",
  },
  {
    id: "CUST-02",
    name: "Devanshi Shah",
    email: "devanshi@atelier.org",
    phone: "+91 98765 12345",
    orders: 12,
    totalSpend: "₹6,80,000",
    joined: "Feb 2026",
    tier: "Privilege Club",
    status: "Active",
  },
  {
    id: "CUST-03",
    name: "Aarav Singhania",
    email: "aarav@singhania.co",
    phone: "+91 99887 66554",
    orders: 5,
    totalSpend: "₹2,45,000",
    joined: "Mar 2026",
    tier: "Standard",
    status: "Active",
  },
  {
    id: "CUST-04",
    name: "Rohan Mehra",
    email: "rohan.m@studio.com",
    phone: "+91 91234 56789",
    orders: 3,
    totalSpend: "₹1,20,000",
    joined: "Jun 2026",
    tier: "Standard",
    status: "Active",
  },
];

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Customer not found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            The customer you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={15} />
          Back to Customers
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              {customer.name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {customer.name}
                </h2>

                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {customer.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Customer ID: {customer.id}
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {customer.tier}
          </span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <User size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">
              Customer Information
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  Member Since
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {customer.joined}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  Account Status
                </p>
                <p className="text-sm font-medium text-emerald-600">
                  {customer.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">
              Customer Statistics
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-[11px] text-slate-500 uppercase font-semibold">
                Total Orders
              </p>

              <p className="text-2xl font-black text-slate-900 mt-1">
                {customer.orders}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-[11px] text-slate-500 uppercase font-semibold">
                Lifetime Spend
              </p>

              <p className="text-xl font-black text-emerald-700 mt-1">
                {customer.totalSpend}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CreditCard size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">
              Spending Summary
            </h3>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              Customer Tier
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {customer.tier}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              Total Orders
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {customer.orders}
            </span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-sm font-bold text-slate-900">
              Lifetime Spend
            </span>

            <span className="text-lg font-black text-emerald-700">
              {customer.totalSpend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;