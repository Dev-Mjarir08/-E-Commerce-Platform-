import React, { useState, useEffect } from "react";
import {
  FaUniversity,
  FaReceipt,
  FaTruck,
  FaBell,
  FaLock,
  FaCheckCircle,
  FaInfoCircle,
  FaSave,
  FaCreditCard,
  FaSlidersH,
  FaSpinner,
} from "react-icons/fa";
import storeApi from "../../services/storeApi";

export default function StoreSettings() {
  // Active Settings Tab
  const [activeTab, setActiveTab] = useState("payouts");
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Vendor Operational Settings State
  const [settings, setSettings] = useState({
    // Banking & Payouts
    payoutMethod: "bank", // 'bank' or 'paypal'
    bankName: "JPMorgan Chase",
    accountHolder: "Aura Tech Enterprises LLC",
    accountNumber: "••••••••4821",
    routingNumber: "021000021",
    paypalEmail: "payouts@auratech.com",
    payoutSchedule: "Weekly", // 'Daily', 'Weekly', 'Monthly'

    // Tax & Compliance
    taxId: "XX-XXX8910",
    businessType: "LLC",
    collectTax: true,
    defaultTaxRate: "8.25",

    // Fulfillment & Shipping Defaults
    freeShippingThreshold: "75.00",
    processingTime: "1-2 Business Days",
    autoFulfillDigital: true,
    enableLocalPickup: false,

    // Store Notifications
    orderEmailAlerts: true,
    lowStockAlerts: true,
    lowStockThreshold: "5",
    customerSmsAlerts: false,
  });

  // Fetch real settings from backend on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await storeApi.getStoreSettings();
        const data = res?.data || res;
        if (data?.settings && Object.keys(data.settings).length > 0) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      } catch (err) {
        console.warn("Notice loading operational settings:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await storeApi.updateStoreSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update settings.";
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Store Operational Settings
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Configure payout destinations, tax configurations, fulfillment options, and notification triggers.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <FaSpinner className="text-xs animate-spin" />
            ) : (
              <FaSave className="text-xs" />
            )}
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* NOTIFICATION FEEDBACK */}
        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <FaCheckCircle className="text-emerald-600 text-sm" />
            <span>Operational settings updated successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <FaInfoCircle className="text-rose-600 text-sm" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium py-1">
            <FaSpinner className="animate-spin text-teal-700" />
            <span>Loading store settings from server...</span>
          </div>
        )}

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: "payouts", label: "Payouts & Banking", icon: FaUniversity },
            { id: "tax", label: "Tax & Compliance", icon: FaReceipt },
            { id: "fulfillment", label: "Fulfillment Defaults", icon: FaTruck },
            { id: "notifications", label: "Notification Triggers", icon: FaBell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3.5 pt-1 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-teal-800 text-teal-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={isActive ? "text-teal-800" : "text-slate-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* TAB 1: PAYOUTS & BANKING */}
          {activeTab === "payouts" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FaUniversity className="text-teal-700" /> Payout Disbursement
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select where you would like revenue from product sales deposited.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <FaLock className="text-[10px]" /> Encrypted
                </span>
              </div>

              {/* Payout Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => handleChange("payoutMethod", "bank")}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    settings.payoutMethod === "bank"
                      ? "border-teal-700 bg-teal-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
                      <FaUniversity />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Direct Bank Deposit (ACH)</p>
                      <p className="text-xs text-slate-400">1-2 business days payout turnaround</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payoutMethod"
                    checked={settings.payoutMethod === "bank"}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-800 focus:ring-teal-700"
                  />
                </label>

                <label
                  onClick={() => handleChange("payoutMethod", "paypal")}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    settings.payoutMethod === "paypal"
                      ? "border-teal-700 bg-teal-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
                      <FaCreditCard />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">PayPal Account</p>
                      <p className="text-xs text-slate-400">Instant transfer upon marketplace approval</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payoutMethod"
                    checked={settings.payoutMethod === "paypal"}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-800 focus:ring-teal-700"
                  />
                </label>
              </div>

              {/* Bank Account Fields */}
              {settings.payoutMethod === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={settings.accountHolder}
                      onChange={(e) => handleChange("accountHolder", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={settings.routingNumber}
                      onChange={(e) => handleChange("routingNumber", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Account Number
                    </label>
                    <input
                      type="password"
                      value={settings.accountNumber}
                      onChange={(e) => handleChange("accountNumber", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    PayPal Receiver Email
                  </label>
                  <input
                    type="email"
                    value={settings.paypalEmail}
                    onChange={(e) => handleChange("paypalEmail", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              )}

              {/* Schedule Dropdown */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Disbursement Frequency
                </label>
                <select
                  value={settings.payoutSchedule}
                  onChange={(e) => handleChange("payoutSchedule", e.target.value)}
                  className="w-full sm:w-64 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly (Every Monday)</option>
                  <option value="Monthly">Monthly (1st of month)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: TAX & COMPLIANCE */}
          {activeTab === "tax" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaReceipt className="text-teal-700" /> Tax Identification & Rates
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set tax collection rules for store sales.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Employer Identification Number (EIN) / Tax ID
                  </label>
                  <input
                    type="text"
                    value={settings.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Business Entity Type
                  </label>
                  <select
                    value={settings.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  >
                    <option value="LLC">LLC (Limited Liability Company)</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <label className="flex items-center gap-2 text-sm text-slate-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.collectTax}
                    onChange={(e) => handleChange("collectTax", e.target.checked)}
                    className="w-4 h-4 rounded text-teal-800 focus:ring-teal-700"
                  />
                  Automatically calculate and charge sales tax at checkout
                </label>

                {settings.collectTax && (
                  <div className="w-full sm:w-64 pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Default Sales Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.defaultTaxRate}
                      onChange={(e) => handleChange("defaultTaxRate", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FULFILLMENT DEFAULTS */}
          {activeTab === "fulfillment" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaTruck className="text-teal-700" /> Fulfillment Rules
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set default processing expectations and shipping options.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Standard Processing Time
                  </label>
                  <select
                    value={settings.processingTime}
                    onChange={(e) => handleChange("processingTime", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  >
                    <option value="Same Day">Same Business Day</option>
                    <option value="1-2 Business Days">1-2 Business Days</option>
                    <option value="3-5 Business Days">3-5 Business Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Free Shipping Minimum Spend ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoFulfillDigital}
                    onChange={(e) => handleChange("autoFulfillDigital", e.target.checked)}
                    className="w-4 h-4 rounded text-teal-800 focus:ring-teal-700"
                  />
                  Automatically complete digital item downloads upon payment confirmation
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableLocalPickup}
                    onChange={(e) => handleChange("enableLocalPickup", e.target.checked)}
                    className="w-4 h-4 rounded text-teal-800 focus:ring-teal-700"
                  />
                  Allow local customer warehouse pickup
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaBell className="text-teal-700" /> Operational Notifications
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose what events alert you and your staff.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">New Order Alerts</p>
                    <p className="text-xs text-slate-500">Receive an email immediately when a buyer places an order.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.orderEmailAlerts}
                    onChange={(e) => handleChange("orderEmailAlerts", e.target.checked)}
                    className="w-5 h-5 rounded text-teal-800 focus:ring-teal-700"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Low Inventory Warnings</p>
                    <p className="text-xs text-slate-500">Get notified when product stock dips below a threshold.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.lowStockAlerts}
                    onChange={(e) => handleChange("lowStockAlerts", e.target.checked)}
                    className="w-5 h-5 rounded text-teal-800 focus:ring-teal-700"
                  />
                </div>

                {settings.lowStockAlerts && (
                  <div className="pl-4 pt-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Stock Alert Threshold Quantity
                    </label>
                    <input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleChange("lowStockThreshold", e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}