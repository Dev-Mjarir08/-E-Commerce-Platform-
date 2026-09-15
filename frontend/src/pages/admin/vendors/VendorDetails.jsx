import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Store, Mail, Phone, MapPin, Package, Star } from "lucide-react";
import { stores } from "../../../data/stores";

const VendorDetails = () => {
  const { id } = useParams();

  const vendor = stores.find(
    (store) => String(store.id) === String(id)
  );

  if (!vendor) {
    return (
      <div className="p-6">
        <Link
          to="/admin/vendors"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Vendors
        </Link>

        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Vendor Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The vendor you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/vendors"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Vendors
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vendor Details
            </h1>
            <p className="mt-1 text-gray-500">
              View complete information about this vendor.
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              vendor.status === "active"
                ? "bg-green-100 text-green-700"
                : vendor.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {vendor.status || "Active"}
          </span>
        </div>
      </div>

      {/* Vendor Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-4 border-b pb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
              <Store size={30} className="text-gray-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {vendor.name || vendor.storeName || "Vendor"}
              </h2>

              <p className="text-sm text-gray-500">
                Vendor ID: #{vendor.id}
              </p>
            </div>
          </div>

          <div className="grid gap-5 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-gray-500" size={19} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {vendor.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1 text-gray-500" size={19} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {vendor.phone || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-gray-500" size={19} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">
                  {vendor.location || vendor.address || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="mt-1 text-gray-500" size={19} />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-medium text-gray-800">
                  {vendor.rating || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-3">
                <Package size={22} className="text-gray-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vendor.products?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Vendor Status</p>
            <p className="mt-2 text-xl font-semibold capitalize text-gray-900">
              {vendor.status || "Active"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;