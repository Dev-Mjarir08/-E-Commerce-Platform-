import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  MapPin,
  User,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  CalendarDays,
  Hash,
  Copy,
  ExternalLink,
  Navigation,
  Box,
  ClipboardCheck,
} from "lucide-react";

const shipments = [
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
    customerEmail: "aarav.mehta@example.com",
    customerPhone: "+91 98765 43210",
    address: "42 Linking Road, Bandra West, Mumbai, Maharashtra",
    origin: "Delhi Warehouse",
    shippedDate: "Sep 20, 2026",
    lastUpdated: "Sep 22, 2026, 10:42 AM",
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
    customerEmail: "diya.shah@example.com",
    customerPhone: "+91 98765 12345",
    address: "18 City Light Road, Surat, Gujarat",
    origin: "Mumbai Warehouse",
    shippedDate: "Sep 19, 2026",
    lastUpdated: "Sep 21, 2026, 4:18 PM",
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
    customerEmail: "rohan.kapoor@example.com",
    customerPhone: "+91 99887 66554",
    address: "72 Vasant Kunj, New Delhi, India",
    origin: "Bengaluru Warehouse",
    shippedDate: "Sep 21, 2026",
    lastUpdated: "Sep 22, 2026, 9:15 AM",
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
    customerEmail: "meera.patel@example.com",
    customerPhone: "+91 91234 56789",
    address: "11 Satellite Road, Ahmedabad, Gujarat",
    origin: "Mumbai Warehouse",
    shippedDate: "Sep 20, 2026",
    lastUpdated: "Sep 22, 2026, 8:50 AM",
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
    customerEmail: "kabir.singh@example.com",
    customerPhone: "+91 90123 45678",
    address: "29 Indiranagar, Bengaluru, Karnataka",
    origin: "Delhi Warehouse",
    shippedDate: "Sep 19, 2026",
    lastUpdated: "Sep 22, 2026, 7:35 AM",
  },
];

const statusConfig = {
  Processing: {
    icon: Clock3,
    className:
      "bg-slate-100 text-slate-700 border-slate-200",
  },
  "In Transit": {
    icon: Truck,
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Out for Delivery": {
    icon: MapPin,
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },
  Delivered: {
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Delayed: {
    icon: AlertTriangle,
    className:
      "bg-rose-50 text-rose-700 border-rose-200",
  },
  Cancelled: {
    icon: XCircle,
    className:
      "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const shipment = useMemo(
    () => shipments.find((item) => item.id === id),
    [id],
  );

  const [currentStatus, setCurrentStatus] = useState(
    shipment?.status || "Processing",
  );

  if (!shipment) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <Package
            size={42}
            className="mx-auto text-slate-300 mb-3"
          />

          <h2 className="text-lg font-bold text-slate-900">
            Shipment Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            The shipment you are looking for does not exist
            or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/shipping")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
          >
            <ArrowLeft size={14} />
            Back to Shipping
          </button>
        </div>
      </div>
    );
  }

  const config =
    statusConfig[currentStatus] ||
    statusConfig.Processing;

  const StatusIcon = config.icon;

  const updateStatus = (status) => {
    setCurrentStatus(status);
  };

  const copyTracking = async () => {
    try {
      await navigator.clipboard.writeText(
        shipment.tracking,
      );

      alert("Tracking number copied.");
    } catch {
      alert(`Tracking Number: ${shipment.tracking}`);
    }
  };

  const openTracking = () => {
    alert(
      `Tracking ${shipment.tracking} with ${shipment.carrier}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/shipping")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3"
            >
              <ArrowLeft size={14} />
              Back to Shipping
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shipment Details
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${config.className}`}
              >
                <StatusIcon size={12} />
                {currentStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="font-mono text-xs font-bold text-indigo-600">
                {shipment.id}
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span className="font-mono text-xs text-slate-500">
                {shipment.orderId}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/shipping")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus("In Transit")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100"
            >
              <Truck size={14} />
              In Transit
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus("Delivered")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100"
            >
              <CheckCircle2 size={14} />
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Shipment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Shipment ID
            </span>

            <Hash
              size={17}
              className="text-indigo-500"
            />
          </div>

          <p className="font-mono font-bold text-slate-900 mt-3">
            {shipment.id}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Shipment reference
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Carrier
            </span>

            <Truck
              size={17}
              className="text-blue-500"
            />
          </div>

          <p className="font-bold text-slate-900 mt-3">
            {shipment.carrier}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Shipping partner
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Items
            </span>

            <Box
              size={17}
              className="text-amber-500"
            />
          </div>

          <p className="font-bold text-slate-900 mt-3">
            {shipment.items} item
            {shipment.items !== 1 ? "s" : ""}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Total items in shipment
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ETA
            </span>

            <CalendarDays
              size={17}
              className="text-emerald-500"
            />
          </div>

          <p className="font-bold text-slate-900 mt-3">
            {shipment.eta}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Expected delivery
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tracking Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tracking Information
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Shipment carrier and tracking details.
                  </p>
                </div>

                <Truck
                  size={18}
                  className="text-indigo-500"
                />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Carrier
                  </label>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Truck
                        size={17}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {shipment.carrier}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Delivery partner
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tracking Number
                  </label>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {shipment.tracking}
                      </span>
                    </div>

                    <button
                      type="button"
                      title="Copy tracking number"
                      onClick={copyTracking}
                      className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      type="button"
                      title="Tracking information"
                      onClick={openTracking}
                      className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                    >
                      <ExternalLink size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Package
                        size={16}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Origin
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {shipment.origin}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="hidden md:block text-slate-300"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin
                        size={16}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Destination
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {shipment.destination}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Delivery Information
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Customer destination and delivery address.
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <MapPin
                    size={17}
                    className="text-rose-600"
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Delivery Address
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-6">
                    {shipment.address}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {shipment.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Navigation
                  size={17}
                  className="text-indigo-500"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Shipment Timeline
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Latest shipment activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="relative">
                <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-200" />

                <div className="relative flex gap-4 pb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center z-10">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Shipment Created
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Shipment was created and assigned to{" "}
                      {shipment.carrier}.
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      {shipment.shippedDate}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center z-10">
                    <Truck
                      size={15}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Shipment Dispatched
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Package has been dispatched from{" "}
                      {shipment.origin}.
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      Sep 21, 2026
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center z-10">
                    <MapPin
                      size={15}
                      className="text-amber-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Current Location
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Shipment is currently being processed
                      for delivery.
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      {shipment.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center z-10">
                    <ClipboardCheck
                      size={15}
                      className="text-slate-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Expected Delivery
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Estimated arrival at customer
                      destination.
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      {shipment.eta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <User
                  size={17}
                  className="text-indigo-500"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Customer
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Recipient information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {shipment.customer
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-3">
                {shipment.customer}
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                {shipment.customerEmail}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {shipment.customerPhone}
              </p>
            </div>
          </div>

          {/* Order */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Order Information
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Order ID
                </p>

                <p className="font-mono text-sm font-bold text-indigo-600 mt-1">
                  {shipment.orderId}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Items
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {shipment.items} item
                  {shipment.items !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Update Status
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Change the current shipment status.
              </p>
            </div>

            <div className="p-4 space-y-2">
              {Object.keys(statusConfig).map(
                (status) => {
                  const StatusOptionIcon =
                    statusConfig[status].icon;

                  const active =
                    currentStatus === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        updateStatus(status)
                      }
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                        active
                          ? statusConfig[status]
                              .className
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <StatusOptionIcon size={15} />

                      <span className="text-xs font-semibold">
                        {status}
                      </span>

                      {active && (
                        <CheckCircle2
                          size={14}
                          className="ml-auto"
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Shipment Dates */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Shipment Dates
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={16}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Shipped
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {shipment.shippedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={16}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {shipment.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={16}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Expected Delivery
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {shipment.eta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-800">
              Shipment {shipment.id}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Current status: {currentStatus}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                updateStatus("Delayed")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-600 bg-rose-50 rounded-lg text-xs font-semibold hover:bg-rose-100"
            >
              <AlertTriangle size={14} />
              Mark Delayed
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus("Delivered")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
            >
              <CheckCircle2 size={14} />
              Mark Delivered
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/shipping")
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back to Shipping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;