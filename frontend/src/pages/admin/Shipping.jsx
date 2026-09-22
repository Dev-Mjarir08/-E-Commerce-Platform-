import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Clock3,
  CheckCircle2,
  MapPin,
  Search,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";

const initialShipments = [
  {
    id: "SHP-10021",
    orderId: "#ORD-4821",
    customer: "Aarav Mehta",
    destination: "Mumbai, Maharashtra",
    carrier: "Delhivery",
    tracking: "DLV982731645",
    status: "In Transit",
    eta: "Sep 23, 2026",
    items: 3,
  },
  {
    id: "SHP-10020",
    orderId: "#ORD-4820",
    customer: "Diya Shah",
    destination: "Surat, Gujarat",
    carrier: "Blue Dart",
    tracking: "BD457821903",
    status: "Delivered",
    eta: "Sep 21, 2026",
    items: 1,
  },
  {
    id: "SHP-10019",
    orderId: "#ORD-4819",
    customer: "Rohan Kapoor",
    destination: "Delhi, India",
    carrier: "Delhivery",
    tracking: "DLV761293847",
    status: "Processing",
    eta: "Sep 25, 2026",
    items: 2,
  },
  {
    id: "SHP-10018",
    orderId: "#ORD-4818",
    customer: "Meera Patel",
    destination: "Ahmedabad, Gujarat",
    carrier: "Blue Dart",
    tracking: "BD112938475",
    status: "Out for Delivery",
    eta: "Today",
    items: 4,
  },
  {
    id: "SHP-10017",
    orderId: "#ORD-4817",
    customer: "Kabir Singh",
    destination: "Bengaluru, Karnataka",
    carrier: "DTDC",
    tracking: "DTC882736451",
    status: "Delayed",
    eta: "Sep 24, 2026",
    items: 1,
  },
];

const statusConfig = {
  Processing: {
    icon: Clock3,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  "In Transit": {
    icon: Truck,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Out for Delivery": {
    icon: MapPin,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Delivered: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Delayed: {
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  Cancelled: {
    icon: XCircle,
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const Shipping = () => {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState(initialShipments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const stats = useMemo(() => {
    return {
      total: shipments.length,
      processing: shipments.filter(
        (s) => s.status === "Processing",
      ).length,
      transit: shipments.filter(
        (s) => s.status === "In Transit",
      ).length,
      delivery: shipments.filter(
        (s) => s.status === "Out for Delivery",
      ).length,
      delivered: shipments.filter(
        (s) => s.status === "Delivered",
      ).length,
      delayed: shipments.filter(
        (s) => s.status === "Delayed",
      ).length,
    };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "All" ||
        shipment.status === statusFilter;

      const matchesSearch =
        !query ||
        shipment.id.toLowerCase().includes(query) ||
        shipment.orderId.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.tracking.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query) ||
        shipment.carrier.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [shipments, search, statusFilter]);

  const refreshShipments = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const updateStatus = (id, status) => {
    setShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              status,
            }
          : shipment,
      ),
    );

    setOpenMenu(null);
  };

  const viewShipment = (id) => {
    setOpenMenu(null);
    navigate(`/admin/shipping/${id}`);
  };

  const showTracking = (shipment) => {
    setOpenMenu(null);

    alert(
      `Tracking Information\n\nShipment: ${shipment.id}\nCarrier: ${shipment.carrier}\nTracking Number: ${shipment.tracking}\nDestination: ${shipment.destination}`,
    );
  };

  const showReports = () => {
    alert(
      `Shipment Reports\n\nTotal Shipments: ${stats.total}\nProcessing: ${stats.processing}\nIn Transit: ${stats.transit}\nOut for Delivery: ${stats.delivery}\nDelivered: ${stats.delivered}\nDelayed: ${stats.delayed}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shipping Management
              </h2>

              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Monitor shipments, delivery progress, carriers,
              and tracking activity.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshShipments}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={
                isRefreshing
                  ? "animate-spin text-indigo-600"
                  : ""
              }
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh Shipments"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total
            </span>

            <Package
              size={18}
              className="text-indigo-600"
            />
          </div>

          <div className="text-2xl font-black text-slate-900 mt-3">
            {stats.total}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Active shipment records
          </p>
        </div>

        {/* Processing */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Processing
            </span>

            <Clock3
              size={18}
              className="text-slate-500"
            />
          </div>

          <div className="text-2xl font-black text-slate-900 mt-3">
            {stats.processing}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Awaiting dispatch
          </p>
        </div>

        {/* In Transit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Transit
            </span>

            <Truck
              size={18}
              className="text-blue-600"
            />
          </div>

          <div className="text-2xl font-black text-blue-700 mt-3">
            {stats.transit}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Moving between hubs
          </p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivered
            </span>

            <CheckCircle2
              size={18}
              className="text-emerald-600"
            />
          </div>

          <div className="text-2xl font-black text-emerald-700 mt-3">
            {stats.delivered}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Successfully delivered
          </p>
        </div>

        {/* Delayed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delayed
            </span>

            <AlertTriangle
              size={18}
              className="text-rose-600"
            />
          </div>

          <div className="text-2xl font-black text-rose-700 mt-3">
            {stats.delayed}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Requires attention
          </p>
        </div>
      </div>

      {/* Shipment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Shipment Records
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Track and manage customer deliveries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search shipment..."
                  className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">
                  All Statuses
                </option>

                {Object.keys(statusConfig).map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">
                  Shipment
                </th>

                <th className="p-3.5">
                  Customer
                </th>

                <th className="p-3.5">
                  Destination
                </th>

                <th className="p-3.5">
                  Carrier
                </th>

                <th className="p-3.5">
                  Tracking
                </th>

                <th className="p-3.5">
                  Status
                </th>

                <th className="p-3.5">
                  ETA
                </th>

                <th className="p-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-slate-400"
                  >
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />

                    <p className="font-semibold text-slate-600">
                      No Shipments Found
                    </p>

                    <p className="text-[11px] mt-1">
                      Try changing your search or status
                      filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const config =
                    statusConfig[shipment.status] ||
                    statusConfig.Processing;

                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={shipment.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Shipment */}
                      <td className="p-3.5">
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {shipment.id}
                          </span>

                          <span className="text-[10px] font-mono text-indigo-500">
                            {shipment.orderId}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">
                          {shipment.customer}
                        </span>

                        <span className="block text-[10px] text-slate-400">
                          {shipment.items} item
                          {shipment.items !== 1
                            ? "s"
                            : ""}
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={13} />

                          {shipment.destination}
                        </div>
                      </td>

                      {/* Carrier */}
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-700">
                          {shipment.carrier}
                        </span>
                      </td>

                      {/* Tracking */}
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-slate-500">
                          {shipment.tracking}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${config.className}`}
                        >
                          <StatusIcon size={11} />
                          {shipment.status}
                        </span>
                      </td>

                      {/* ETA */}
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        {shipment.eta}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            type="button"
                            title="View shipment details"
                            onClick={() =>
                              viewShipment(
                                shipment.id,
                              )
                            }
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[11px] font-semibold transition-colors"
                          >
                            View
                          </button>

                          {/* Delivered */}
                          <button
                            type="button"
                            title="Mark delivered"
                            onClick={() =>
                              updateStatus(
                                shipment.id,
                                "Delivered",
                              )
                            }
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <CheckCircle2
                              size={14}
                            />
                          </button>

                          {/* In Transit */}
                          <button
                            type="button"
                            title="Mark in transit"
                            onClick={() =>
                              updateStatus(
                                shipment.id,
                                "In Transit",
                              )
                            }
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Truck size={14} />
                          </button>

                          {/* More */}
                          <div className="relative">
                            <button
                              type="button"
                              title="More actions"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    shipment.id
                                    ? null
                                    : shipment.id,
                                )
                              }
                              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              <MoreHorizontal
                                size={15}
                              />
                            </button>

                            {openMenu ===
                              shipment.id && (
                              <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 text-left">
                                {/* View Details */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    viewShipment(
                                      shipment.id,
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Package
                                    size={14}
                                  />
                                  View Details
                                </button>

                                {/* Processing */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      shipment.id,
                                      "Processing",
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Clock3
                                    size={14}
                                  />
                                  Mark Processing
                                </button>

                                {/* In Transit */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      shipment.id,
                                      "In Transit",
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Truck size={14} />
                                  Mark In Transit
                                </button>

                                {/* Out for Delivery */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      shipment.id,
                                      "Out for Delivery",
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <MapPin
                                    size={14}
                                  />
                                  Out for Delivery
                                </button>

                                {/* Delivered */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      shipment.id,
                                      "Delivered",
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <CheckCircle2
                                    size={14}
                                  />
                                  Mark Delivered
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {/* Tracking */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    showTracking(
                                      shipment,
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Truck size={14} />
                                  Tracking Information
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400">
            Showing {filteredShipments.length} of{" "}
            {shipments.length} shipments
          </span>

          <button
            type="button"
            onClick={showReports}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Shipment Reports
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shipping;