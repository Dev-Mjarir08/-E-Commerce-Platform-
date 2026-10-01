import { useCallback, useEffect, useMemo, useState } from "react";
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
import adminApi from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

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

/**
 * Map backend order structure to Shipping UI shipment item
 */
const mapOrderToShipment = (order) => {
  const user = order.user || {};
  const customerName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    order.shippingAddress?.recipientName ||
    "Unknown Customer";

  const destination = order.shippingAddress
    ? [order.shippingAddress.city, order.shippingAddress.state]
        .filter(Boolean)
        .join(", ") || "Not Specified"
    : "Not Specified";

  // Calculate total item quantity from order.items
  const totalItems = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
    : 0;

  // Map backend status to UI label
  let uiStatus = "Processing";
  const rawStatus = String(order.orderStatus || "").toLowerCase();
  if (rawStatus === "shipped") {
    uiStatus = "In Transit";
  } else if (rawStatus === "delivered") {
    uiStatus = "Delivered";
  } else if (rawStatus === "cancelled") {
    uiStatus = "Cancelled";
  } else {
    // placed, confirmed, processing
    uiStatus = "Processing";
  }

  return {
    id: order.orderNumber || String(order._id),
    mongoId: String(order._id),
    orderId: `#${order.orderNumber || order._id}`,
    customer: customerName,
    destination,
    carrier: "Not Assigned",
    tracking: order.trackingNumber || "Not Assigned",
    status: uiStatus,
    rawStatus,
    eta: "Not Available",
    items: totalItems,
    rawOrder: order,
  };
};

const Shipping = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { alert: modalAlert } = useModal();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Fetch orders from real backend API
  const fetchShipments = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError(null);
      try {
        let backendStatus = "all";
        if (statusFilter === "Processing") backendStatus = "processing";
        else if (statusFilter === "In Transit") backendStatus = "shipped";
        else if (statusFilter === "Delivered") backendStatus = "delivered";
        else if (statusFilter === "Cancelled") backendStatus = "cancelled";

        const params = { limit: 100 };
        if (backendStatus !== "all") params.status = backendStatus;
        if (search.trim()) params.search = search.trim();

        const response = await adminApi.getAdminOrders(params);
        const orders =
          response?.data?.orders ||
          response?.orders ||
          (Array.isArray(response?.data) ? response.data : []) ||
          [];

        if (Array.isArray(orders)) {
          setShipments(orders.map(mapOrderToShipment));
        } else {
          setShipments([]);
        }
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setError(err.message || "Failed to load shipment records.");
        setShipments([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [search, statusFilter],
  );

  // Debounced fetch on search or status filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShipments(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchShipments]);

  // Real KPI statistics
  const stats = useMemo(() => {
    return {
      total: shipments.length,
      processing: shipments.filter((s) => s.status === "Processing").length,
      transit: shipments.filter((s) => s.status === "In Transit").length,
      delivered: shipments.filter((s) => s.status === "Delivered").length,
      cancelled: shipments.filter((s) => s.status === "Cancelled").length,
    };
  }, [shipments]);

  // Client-side instant filter over loaded shipments
  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "All" || shipment.status === statusFilter;

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

  // Real refresh calling the backend
  const refreshShipments = async () => {
    setIsRefreshing(true);
    try {
      await fetchShipments(false);
      showToast("Shipment records refreshed.", "success");
    } catch (err) {
      showToast(err.message || "Failed to refresh shipments.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real backend status update
  const updateStatus = async (shipment, newUiStatus) => {
    let backendStatus = "processing";
    if (newUiStatus === "In Transit" || newUiStatus === "shipped") {
      backendStatus = "shipped";
    } else if (newUiStatus === "Delivered" || newUiStatus === "delivered") {
      backendStatus = "delivered";
    } else if (newUiStatus === "Cancelled" || newUiStatus === "cancelled") {
      backendStatus = "cancelled";
    } else if (newUiStatus === "Processing" || newUiStatus === "processing") {
      backendStatus = "processing";
    }

    const targetId = shipment.mongoId || shipment.id;
    setUpdatingId(targetId);
    try {
      await adminApi.updateOrderStatus(targetId, { status: backendStatus });
      showToast(`Shipment ${shipment.id} marked as ${newUiStatus}.`, "success");
      await fetchShipments(false);
    } catch (err) {
      showToast(
        err.message || `Failed to update status for ${shipment.id}.`,
        "error",
      );
    } finally {
      setUpdatingId(null);
      setOpenMenu(null);
    }
  };

  const viewShipment = (id) => {
    setOpenMenu(null);
    navigate(`/admin/shipping/${id}`);
  };

  const showTracking = (shipment) => {
    setOpenMenu(null);
    modalAlert({
      title: `Shipment Tracking: ${shipment.id}`,
      message: `Carrier: ${shipment.carrier || "Assigned Courier"}\nTracking ID: ${shipment.tracking || "Awaiting dispatch"}\nDestination: ${shipment.destination}\nCurrent Status: ${shipment.status}`,
      type: "info"
    });
  };

  const showReports = () => {
    modalAlert({
      title: "Real-time Shipment Telemetry",
      message: `Total Active Shipments: ${stats.total}\nIn Processing: ${stats.processing}\nIn Transit: ${stats.transit}\nSuccessfully Delivered: ${stats.delivered}\nCancelled / Returned: ${stats.cancelled}`,
      type: "database"
    });
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
              Monitor shipments, delivery progress, carriers, and tracking
              activity.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshShipments}
            disabled={isRefreshing || loading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin text-indigo-600" : ""}
            />

            {isRefreshing ? "Refreshing..." : "Refresh Shipments"}
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

            <Package size={18} className="text-indigo-600" />
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

            <Clock3 size={18} className="text-slate-500" />
          </div>

          <div className="text-2xl font-black text-slate-900 mt-3">
            {stats.processing}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</p>
        </div>

        {/* In Transit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Transit
            </span>

            <Truck size={18} className="text-blue-600" />
          </div>

          <div className="text-2xl font-black text-blue-700 mt-3">
            {stats.transit}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">Moving between hubs</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivered
            </span>

            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>

          <div className="text-2xl font-black text-emerald-700 mt-3">
            {stats.delivered}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Successfully delivered
          </p>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cancelled
            </span>

            <XCircle size={18} className="text-slate-500" />
          </div>

          <div className="text-2xl font-black text-slate-700 mt-3">
            {stats.cancelled}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">Cancelled orders</p>
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shipment..."
                  className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Shipment</th>

                <th className="p-3.5">Customer</th>

                <th className="p-3.5">Destination</th>

                <th className="p-3.5">Carrier</th>

                <th className="p-3.5">Tracking</th>

                <th className="p-3.5">Status</th>

                <th className="p-3.5">ETA</th>

                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 text-indigo-500 animate-spin" />
                    <p className="font-semibold text-slate-600">
                      Loading Shipments...
                    </p>
                    <p className="text-[11px] mt-1">
                      Fetching live orders from database.
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-rose-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                    <p className="font-semibold text-rose-700">
                      Failed to load shipments
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">{error}</p>
                    <button
                      type="button"
                      onClick={() => fetchShipments(true)}
                      className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />

                    <p className="font-semibold text-slate-600">
                      No Shipments Found
                    </p>

                    <p className="text-[11px] mt-1">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const config =
                    statusConfig[shipment.status] || statusConfig.Processing;

                  const StatusIcon = config.icon;
                  const isRowUpdating =
                    updatingId === (shipment.mongoId || shipment.id);

                  return (
                    <tr
                      key={shipment.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Shipment */}
                      <td className="p-3.5">
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              viewShipment(shipment.mongoId || shipment.id)
                            }
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                          >
                            {shipment.id}
                          </button>

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
                          {shipment.items !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={13} className="shrink-0" />
                          <span>{shipment.destination}</span>
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
                              viewShipment(shipment.mongoId || shipment.id)
                            }
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[11px] font-semibold transition-colors"
                          >
                            View
                          </button>

                          {/* Delivered */}
                          <button
                            type="button"
                            title="Mark delivered"
                            disabled={isRowUpdating}
                            onClick={() => updateStatus(shipment, "Delivered")}
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} />
                          </button>

                          {/* In Transit */}
                          <button
                            type="button"
                            title="Mark in transit"
                            disabled={isRowUpdating}
                            onClick={() => updateStatus(shipment, "In Transit")}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
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
                                  openMenu === shipment.id ? null : shipment.id,
                                )
                              }
                              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              <MoreHorizontal size={15} />
                            </button>

                            {openMenu === shipment.id && (
                              <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 text-left">
                                {/* View Details */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    viewShipment(
                                      shipment.mongoId || shipment.id,
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Package size={14} />
                                  View Details
                                </button>

                                {/* Processing */}
                                <button
                                  type="button"
                                  disabled={isRowUpdating}
                                  onClick={() =>
                                    updateStatus(shipment, "Processing")
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Clock3 size={14} />
                                  Mark Processing
                                </button>

                                {/* In Transit */}
                                <button
                                  type="button"
                                  disabled={isRowUpdating}
                                  onClick={() =>
                                    updateStatus(shipment, "In Transit")
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Truck size={14} />
                                  Mark In Transit
                                </button>

                                {/* Delivered */}
                                <button
                                  type="button"
                                  disabled={isRowUpdating}
                                  onClick={() =>
                                    updateStatus(shipment, "Delivered")
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <CheckCircle2 size={14} />
                                  Mark Delivered
                                </button>

                                {/* Cancelled */}
                                <button
                                  type="button"
                                  disabled={isRowUpdating}
                                  onClick={() =>
                                    updateStatus(shipment, "Cancelled")
                                  }
                                  className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <XCircle size={14} />
                                  Mark Cancelled
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {/* Tracking */}
                                <button
                                  type="button"
                                  onClick={() => showTracking(shipment)}
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
            Showing {filteredShipments.length} of {shipments.length} shipments
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