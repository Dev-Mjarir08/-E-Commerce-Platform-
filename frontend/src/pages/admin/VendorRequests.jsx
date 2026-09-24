import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Building2,
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  CreditCard,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";

const initialRequests = [
  {
    id: "KYC-1001",
    vendorName: "Raj Electronics",
    ownerName: "Rajesh Patel",
    email: "rajesh@rajelectronics.com",
    phone: "+91 98765 43210",
    businessType: "Electronics",
    submittedAt: "2026-09-18",
    status: "pending",
    city: "Surat",
    state: "Gujarat",
    pan: "ABCDE1234F",
    gst: "24ABCDE1234F1Z5",
    documentCount: 6,
    risk: "low",
  },
  {
    id: "KYC-1002",
    vendorName: "Urban Fashion Hub",
    ownerName: "Neha Sharma",
    email: "neha@urbanfashion.com",
    phone: "+91 99887 66554",
    businessType: "Fashion",
    submittedAt: "2026-09-17",
    status: "under_review",
    city: "Ahmedabad",
    state: "Gujarat",
    pan: "FGHIJ5678K",
    gst: "24FGHIJ5678K1Z2",
    documentCount: 8,
    risk: "low",
  },
  {
    id: "KYC-1003",
    vendorName: "Home Comforts",
    ownerName: "Amit Shah",
    email: "amit@homecomforts.in",
    phone: "+91 91234 56789",
    businessType: "Home & Living",
    submittedAt: "2026-09-15",
    status: "approved",
    city: "Mumbai",
    state: "Maharashtra",
    pan: "LMNOP9012Q",
    gst: "27LMNOP9012Q1Z7",
    documentCount: 7,
    risk: "low",
  },
  {
    id: "KYC-1004",
    vendorName: "Fresh Basket",
    ownerName: "Kiran Mehta",
    email: "kiran@freshbasket.in",
    phone: "+91 90123 45678",
    businessType: "Grocery",
    submittedAt: "2026-09-14",
    status: "rejected",
    city: "Vadodara",
    state: "Gujarat",
    pan: "RSTUV3456W",
    gst: "24RSTUV3456W1Z8",
    documentCount: 4,
    risk: "high",
  },
  {
    id: "KYC-1005",
    vendorName: "Tech World",
    ownerName: "Vivek Joshi",
    email: "vivek@techworld.in",
    phone: "+91 90909 80808",
    businessType: "Electronics",
    submittedAt: "2026-09-13",
    status: "pending",
    city: "Pune",
    state: "Maharashtra",
    pan: "XYZAB7890C",
    gst: "27XYZAB7890C1Z4",
    documentCount: 5,
    risk: "medium",
  },
  {
    id: "KYC-1006",
    vendorName: "Style Studio",
    ownerName: "Priya Desai",
    email: "priya@stylestudio.in",
    phone: "+91 98760 12345",
    businessType: "Fashion",
    submittedAt: "2026-09-11",
    status: "approved",
    city: "Surat",
    state: "Gujarat",
    pan: "DEFGH2345J",
    gst: "24DEFGH2345J1Z1",
    documentCount: 9,
    risk: "low",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  under_review: {
    label: "Under Review",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const riskConfig = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const VendorRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const summary = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((item) => item.status === "pending").length,
      review: requests.filter((item) => item.status === "under_review").length,
      approved: requests.filter((item) => item.status === "approved").length,
      rejected: requests.filter((item) => item.status === "rejected").length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = search.toLowerCase().trim();

    return requests.filter((item) => {
      const matchesSearch =
        !query ||
        item.vendorName.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesStatus = status === "all" || item.status === status;
      const matchesRisk = risk === "all" || item.risk === risk;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [requests, search, status, risk]);

  const updateStatus = (id, nextStatus) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedRequest((current) =>
      current?.id === id ? { ...current, status: nextStatus } : current
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
              Vendor Onboarding
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Vendor Verification & KYC
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review business documents and approve vendor applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRequests([...initialRequests])}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Requests
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.total}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pending
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {summary.pending}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Under Review
                </p>
                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  {summary.review}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Approved
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {summary.approved}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor, owner, email or request ID..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm outline-none focus:border-indigo-500 sm:w-44"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 sm:w-36"
              >
                <option value="all">All Risk</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vendor
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Business
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submitted
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Documents
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Risk
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((item) => {
                  const config = statusConfig[item.status];

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-semibold text-indigo-600">
                            {item.vendorName.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.vendorName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.ownerName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {item.businessType}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.city}, {item.state}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(item.submittedAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                          <FileText className="h-4 w-4" />
                          {item.documentCount}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${riskConfig[item.risk]}`}
                        >
                          {item.risk}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(item)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            title="View request"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {(item.status === "pending" ||
                            item.status === "under_review") && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(item.id, "approved")
                                }
                                className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50"
                                title="Approve"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(item.id, "rejected")
                                }
                                className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <div className="px-6 py-16 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  No KYC requests found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {selectedRequest.id}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Vendor Verification
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600">
                    {selectedRequest.vendorName.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">
                      {selectedRequest.vendorName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedRequest.businessType}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      statusConfig[selectedRequest.status].className
                    }`}
                  >
                    {statusConfig[selectedRequest.status].label}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <User className="h-4 w-4" />
                    Owner
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.ownerName}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.email}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.phone}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.city}, {selectedRequest.state}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <CreditCard className="h-4 w-4" />
                    PAN
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.pan}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                    <Building2 className="h-4 w-4" />
                    GST
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.gst}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-indigo-900">
                      Verification checklist
                    </p>
                    <p className="mt-1 text-sm text-indigo-700">
                      {selectedRequest.documentCount} documents have been
                      submitted for verification.
                    </p>
                  </div>
                </div>
              </div>

              {(selectedRequest.status === "pending" ||
                selectedRequest.status === "under_review") && (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(selectedRequest.id, "rejected")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(selectedRequest.id, "approved")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Vendor
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CalendarDays className="h-4 w-4" />
                Submitted {formatDate(selectedRequest.submittedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRequests;