import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import storeApi from "../../../services/storeApi";
import {
  ArrowLeft,
  Store,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Star,
  CalendarDays,
  User,
  Globe,
  Building2,
  CheckCircle2,
  Clock3,
  Ban,
  XCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await storeApi.getStoreById(id);

        setStore(response.data || response.store || response);
      } catch (err) {
        setError(
          err?.message || "Failed to fetch store details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2
        };

      case "pending":
        return {
          label: "Pending",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock3
        };

      case "suspended":
        return {
          label: "Suspended",
          className:
            "bg-rose-50 text-rose-700 border-rose-200",
          icon: Ban
        };

      case "closed":
        return {
          label: "Closed",
          className:
            "bg-slate-100 text-slate-600 border-slate-300",
          icon: XCircle
        };

      default:
        return {
          label: status || "Unknown",
          className:
            "bg-slate-100 text-slate-600 border-slate-300",
          icon: Store
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getOwnerName = () => {
    if (!store?.owner) return "N/A";

    if (typeof store.owner === "string") {
      return store.owner;
    }

    return (
      store.owner.name ||
      store.owner.fullName ||
      `${store.owner.firstName || ""} ${store.owner.lastName || ""}`.trim() ||
      "N/A"
    );
  };

  const getOwnerEmail = () => {
    if (!store?.owner) return store?.email || "N/A";

    if (typeof store.owner === "string") {
      return store.email || "N/A";
    }

    return store.owner.email || store.email || "N/A";
  };

  const getLogoUrl = () => {
    if (!store?.logo) return null;

    if (typeof store.logo === "string") {
      return store.logo;
    }

    return store.logo.url || null;
  };

  const getBannerUrl = () => {
    if (!store?.banner) return null;

    if (typeof store.banner === "string") {
      return store.banner;
    }

    return store.banner.url || null;
  };

  const statusConfig = getStatusConfig(store?.status);
  const StatusIcon = statusConfig.icon;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Loading store details...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Fetching store information from the database
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/stores")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Stores
        </button>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />

          <h2 className="text-base font-bold text-rose-800">
            Unable to Load Store
          </h2>

          <p className="text-xs text-rose-600 mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/stores")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to Stores
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h2 className="text-base font-bold text-slate-800">
            Store Not Found
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            The requested store could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/admin/stores")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Stores
      </button>

      {/* Store Hero */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="h-44 bg-slate-900 relative overflow-hidden">
          {getBannerUrl() ? (
            <img
              src={getBannerUrl()}
              alt={`${store.name} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" />
          )}

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">

              {/* Logo */}
              <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
                {getLogoUrl() ? (
                  <img
                    src={getLogoUrl()}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-indigo-600">
                    {store.name?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="pb-1 text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">
                    {store.name}
                  </h1>

                  {store.isVerified && (
                    <ShieldCheck
                      size={19}
                      className="text-blue-300"
                    />
                  )}
                </div>

                <p className="text-xs text-slate-200 mt-1">
                  /{store.slug}
                </p>
              </div>
            </div>

            {/* Status */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusConfig.className}`}
            >
              <StatusIcon size={14} />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Hero Information */}
        <div className="p-5">

          <div className="flex flex-wrap items-center gap-2 mb-4">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
              <Store size={13} />
              Store
            </span>

            {store.isVerified && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
                <ShieldCheck size={13} />
                Verified Store
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700">
              <Star size={13} />
              {Number(store.ratingAverage || 0).toFixed(1)}
              ({store.ratingCount || 0} reviews)
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-6 max-w-4xl">
            {store.description || "No store description has been provided."}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Star size={17} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Rating
              </p>

              <p className="text-lg font-black text-slate-900">
                {Number(store.ratingAverage || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Verification
              </p>

              <p className="text-sm font-bold text-slate-900">
                {store.isVerified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarDays size={17} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Created
              </p>

              <p className="text-sm font-bold text-slate-900">
                {formatDate(store.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCw size={17} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Updated
              </p>

              <p className="text-sm font-bold text-slate-900">
                {formatDate(store.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Store Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Store Information
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Core storefront identity and contact information
            </p>
          </div>

          <div className="p-5 space-y-5">

            <InfoRow
              icon={Store}
              label="Store Name"
              value={store.name}
            />

            <InfoRow
              icon={Globe}
              label="Store Slug"
              value={`/${store.slug}`}
              mono
            />

            <InfoRow
              icon={Mail}
              label="Store Email"
              value={store.email || "Not provided"}
            />

            <InfoRow
              icon={Phone}
              label="Phone"
              value={store.phone || "Not provided"}
            />

            <InfoRow
              icon={Star}
              label="Rating"
              value={`${Number(store.ratingAverage || 0).toFixed(1)} / 5 (${store.ratingCount || 0} ratings)`}
            />

          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Store Owner
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Merchant account associated with this storefront
            </p>
          </div>

          <div className="p-5 space-y-5">

            <InfoRow
              icon={User}
              label="Owner"
              value={getOwnerName()}
            />

            <InfoRow
              icon={Mail}
              label="Owner Email"
              value={getOwnerEmail()}
            />

            {store.owner?.phone && (
              <InfoRow
                icon={Phone}
                label="Owner Phone"
                value={store.owner.phone}
              />
            )}

            {store.owner?._id && (
              <InfoRow
                icon={Building2}
                label="Owner ID"
                value={store.owner._id}
                mono
              />
            )}

            <InfoRow
              icon={CalendarDays}
              label="Store Created"
              value={formatDateTime(store.createdAt)}
            />

          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Store Address
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Registered storefront location
            </p>
          </div>

          <div className="p-5">

            {store.address &&
              Object.values(store.address).some(Boolean) ? (
              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin size={17} />
                </div>

                <div className="space-y-1 text-sm text-slate-700">

                  {store.address.street && (
                    <p>{store.address.street}</p>
                  )}

                  <p>
                    {[
                      store.address.city,
                      store.address.state,
                      store.address.postalCode
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {store.address.country && (
                    <p>{store.address.country}</p>
                  )}

                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No address information has been provided.
              </p>
            )}

          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              System Information
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Database and storefront metadata
            </p>
          </div>

          <div className="p-5 space-y-5">

            <InfoRow
              icon={Building2}
              label="Store ID"
              value={store._id || store.id}
              mono
            />

            <InfoRow
              icon={CalendarDays}
              label="Created At"
              value={formatDateTime(store.createdAt)}
            />

            <InfoRow
              icon={RefreshCw}
              label="Last Updated"
              value={formatDateTime(store.updatedAt)}
            />

            <InfoRow
              icon={ShieldCheck}
              label="Verified"
              value={store.isVerified ? "Yes" : "No"}
            />

            <InfoRow
              icon={Store}
              label="Current Status"
              value={store.status}
            />

          </div>
        </div>
      </div>

      {/* Raw Store Data */}
      <details className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <summary className="cursor-pointer p-5 text-sm font-bold text-slate-800 hover:bg-slate-50">
          View Complete Store Record
        </summary>

        <div className="p-5 border-t border-slate-200">
          <pre className="bg-slate-950 text-slate-200 rounded-lg p-4 overflow-x-auto text-[11px] leading-5">
            {JSON.stringify(store, null, 2)}
          </pre>
        </div>

      </details>
    </div>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  mono = false
}) => {
  return (
    <div className="flex items-start gap-3">

      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          {label}
        </p>

        <p
          className={`text-xs font-semibold text-slate-800 mt-1 break-words ${mono ? "font-mono" : ""
            }`}
        >
          {value || "N/A"}
        </p>

      </div>
    </div>
  );
};

export default StoreDetails;