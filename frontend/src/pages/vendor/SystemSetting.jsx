import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Building2,
  Truck,
  CreditCard,
  Bell,
  ShieldCheck,
  FileText,
  Camera,
  Upload,
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Key,
  Smartphone,
  LogOut,
  AlertTriangle,
  Info,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  Clock,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  profile: {
    storeName: "Apex Craftworks",
    storeSlug: "apex-craftworks",
    tagline: "Handcrafted Premium Artisan Goods",
    description:
      "We craft sustainable, high-quality handmade products for modern eco-conscious living.",
    email: "vendor@apexcraft.com",
    phone: "+1 (555) 234-5678",
    website: "https://apexcraft.com",
    logoUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    socials: {
      instagram: "@apexcraftworks",
      facebook: "apexcraftworks",
      twitter: "@apexcraft"
    }
  },

  shipping: {
    fulfillmentType: "hybrid",
    handlingTimeDays: 2,
    freeShippingThreshold: 75,

    returnAddress: {
      street: "100 Artisan Way, Suite 400",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "United States"
    },

    shippingZones: [
      {
        id: "z1",
        name: "Domestic (US Standard)",
        fee: 5.99,
        minDays: 3,
        maxDays: 5,
        enabled: true
      },
      {
        id: "z2",
        name: "Domestic Express",
        fee: 14.99,
        minDays: 1,
        maxDays: 2,
        enabled: true
      },
      {
        id: "z3",
        name: "International Priority",
        fee: 29.99,
        minDays: 7,
        maxDays: 14,
        enabled: false
      }
    ]
  },

  payment: {
    payoutMethod: "bank",
    currency: "USD",
    payoutSchedule: "weekly",
    taxId: "US-987654321",

    bankDetails: {
      bankName: "Chase Bank",
      accountHolder: "Apex Craftworks LLC",
      accountNumber: "••••••••4821",
      routingNumber: "122000030"
    },

    paypalEmail: "payouts@apexcraft.com",
    stripeConnected: true
  },

  notifications: {
    email: {
      newOrders: true,
      lowStock: true,
      customerMessages: true,
      payouts: true,
      marketing: false
    },

    sms: {
      newOrders: true,
      urgentSecurity: true,
      lowStock: false
    },

    push: {
      newOrders: true,
      customerMessages: true
    }
  },

  security: {
    twoFactorEnabled: true,
    twoFactorMethod: "authenticator",

    apiKeys: [
      {
        id: "key_1",
        name: "Inventory Sync Service",
        created: "2026-01-15",
        lastUsed: "2 mins ago"
      },
      {
        id: "key_2",
        name: "Custom ERP Integration",
        created: "2026-02-10",
        lastUsed: "Yesterday"
      }
    ],

    activeSessions: [
      {
        id: "s1",
        device: "Chrome / macOS (San Francisco, USA)",
        current: true,
        ip: "192.168.1.1"
      },
      {
        id: "s2",
        device: "Safari / iOS 19 (Portland, USA)",
        current: false,
        ip: "10.0.0.45"
      }
    ]
  },

  policy: {
    returnWindowDays: 30,
    restockingFeePercent: 0,
    customReturnPolicy:
      "We offer full refunds on non-personalized items returned within 30 days in original packaging.",
    termsOfService:
      "Standard marketplace vendor agreement applies. All handcrafted items may have slight variance.",

    faqs: [
      {
        id: "f1",
        q: "Do you ship internationally?",
        a: "Yes, we ship selected items worldwide via priority courier."
      },
      {
        id: "f2",
        q: "How long does custom crafting take?",
        a: "Custom products require an additional 3-5 business days before dispatch."
      }
    ]
  }
};

export default function VendorSettings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vendor_system_settings');

    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [toast, setToast] = useState(null);

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle state modifications
  const updateSettingsGroup = (group, newValues) => {
    setSettings((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        ...newValues
      }
    }));

    setHasUnsavedChanges(true);
  };

  // Save settings
  const handleSaveAll = () => {
    localStorage.setItem(
      'vendor_system_settings',
      JSON.stringify(settings)
    );

    setHasUnsavedChanges(false);

    setToast({
      type: 'success',
      title: 'Settings Saved',
      message:
        'Your store settings have been successfully updated and published.'
    });
  };

  // Reset settings
  const handleReset = () => {
    const saved = localStorage.getItem('vendor_system_settings');

    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      setSettings(DEFAULT_SETTINGS);
    }

    setHasUnsavedChanges(false);

    setToast({
      type: 'info',
      title: 'Changes Reverted',
      message:
        'All unsaved form changes have been reset to current saved values.'
    });
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Store Profile',
      icon: Building2,
      desc: 'Branding, logo, banner & contact details'
    },
    {
      id: 'shipping',
      label: 'Shipping & Delivery',
      icon: Truck,
      desc: 'Zones, fulfillment rules & handling'
    },
    {
      id: 'payment',
      label: 'Payments & Payouts',
      icon: CreditCard,
      desc: 'Payout options, tax ID & schedules'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      desc: 'Email, SMS & push alert preferences'
    },
    {
      id: 'security',
      label: 'Security & Access',
      icon: ShieldCheck,
      desc: '2FA, active sessions & API access'
    },
    {
      id: 'policy',
      label: 'Store Policies',
      icon: FileText,
      desc: 'Returns, terms of service & FAQs'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">

      {/* ================= TOAST NOTIFICATION ================= */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 border border-emerald-500/30 text-white px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">

          <div
            className={`p-2 rounded-lg ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold">
              {toast.title}
            </h4>

            <p className="text-xs text-slate-400">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* ================= HEADER & ACTIONS ================= */}
      <div className="max-w-7xl mx-auto mb-8">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <span>Vendor Control Center</span>
              <span>•</span>
              <span>Settings</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              System Settings
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* UNSAVED CHANGES */}
            {hasUnsavedChanges && (
              <div className="hidden sm:flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-medium">
                <AlertTriangle className="w-4 h-4" />
                Unsaved Changes
              </div>
            )}

            {/* DISCARD */}
            <button
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                hasUnsavedChanges
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  : 'bg-slate-800/40 text-slate-600 border border-slate-800/50 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Discard
            </button>

            {/* SAVE */}
            <button
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg ${
                hasUnsavedChanges
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                  : 'bg-emerald-950/40 text-emerald-800 border border-emerald-900/30 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ================= SIDEBAR NAVIGATION ================= */}
        <div className="lg:col-span-3 space-y-1">

          <nav className="space-y-1 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/80">

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    />

                    <div className="text-left">
                      <div className="text-sm">
                        {tab.label}
                      </div>
                    </div>

                  </div>

                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              );
            })}

          </nav>
        </div>

        {/* ================= TAB PANELS CONTAINER ================= */}
        <div className="lg:col-span-9 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xs">

          {activeTab === 'profile' && (
            <ProfileSettings
              data={settings.profile}
              onChange={(updated) =>
                updateSettingsGroup('profile', updated)
              }
            />
          )}

          {activeTab === 'shipping' && (
            <ShippingSettings
              data={settings.shipping}
              onChange={(updated) =>
                updateSettingsGroup('shipping', updated)
              }
            />
          )}

          {activeTab === 'payment' && (
            <PaymentSettings
              data={settings.payment}
              onChange={(updated) =>
                updateSettingsGroup('payment', updated)
              }
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              data={settings.notifications}
              onChange={(updated) =>
                updateSettingsGroup('notifications', updated)
              }
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettings
              data={settings.security}
              onChange={(updated) =>
                updateSettingsGroup('security', updated)
              }
            />
          )}

          {activeTab === 'policy' && (
            <PolicySettings
              data={settings.policy}
              onChange={(updated) =>
                updateSettingsGroup('policy', updated)
              }
            />
          )}

        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROFILE SETTINGS
   ========================================================================= */

function ProfileSettings({ data, onChange }) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Store Branding & Identity
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Configure your public vendor storefront details and contact information.
        </p>
      </div>

      {/* STORE IMAGES */}
      <div className="space-y-4 pt-2">

        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Store Images
        </label>

        <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 group bg-slate-900">

          <img
            src={data.bannerUrl}
            alt="Store Banner"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs font-medium text-white">
              <Camera className="w-4 h-4 text-emerald-400" />
              Change Cover Banner
            </div>

          </div>

          {/* LOGO */}
          <div className="absolute bottom-4 left-4 flex items-end gap-4">

            <div className="relative w-20 h-20 rounded-2xl border-2 border-slate-900 overflow-hidden bg-slate-800 group/logo shadow-xl">

              <img
                src={data.logoUrl}
                alt="Store Logo"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-emerald-400" />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Store Name
          </label>

          <input
            type="text"
            value={data.storeName}
            onChange={(e) =>
              onChange({ storeName: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Store URL Handle (Slug)
          </label>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400">

            <span className="text-slate-600 text-xs mr-1">
              market.com/store/
            </span>

            <input
              type="text"
              value={data.storeSlug}
              onChange={(e) =>
                onChange({ storeSlug: e.target.value })
              }
              className="bg-transparent text-slate-100 focus:outline-none w-full text-sm"
            />

          </div>
        </div>

        <div className="sm:col-span-2">

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Store Tagline
          </label>

          <input
            type="text"
            value={data.tagline}
            onChange={(e) =>
              onChange({ tagline: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />

        </div>

        <div className="sm:col-span-2">

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Store Description / Bio
          </label>

          <textarea
            rows={3}
            value={data.description}
            onChange={(e) =>
              onChange({ description: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />

        </div>
      </div>

      {/* CONTACT */}
      <div className="pt-4 border-t border-slate-800/80">

        <h3 className="text-sm font-semibold text-white mb-3">
          Public Support Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Customer Support Email
            </label>

            <div className="relative">

              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />

              <input
                type="email"
                value={data.email}
                onChange={(e) =>
                  onChange({ email: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />

            </div>
          </div>

          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Support Phone Number
            </label>

            <div className="relative">

              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />

              <input
                type="text"
                value={data.phone}
                onChange={(e) =>
                  onChange({ phone: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SHIPPING SETTINGS
   ========================================================================= */

function ShippingSettings({ data, onChange }) {
  const toggleZone = (id) => {
    const updated = data.shippingZones.map((zone) =>
      zone.id === id
        ? { ...zone, enabled: !zone.enabled }
        : zone
    );

    onChange({ shippingZones: updated });
  };

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Shipping & Fulfillment
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Configure your delivery speeds, handling times, and geographic zones.
        </p>
      </div>

      {/* FULFILLMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {[
          {
            id: 'vendor',
            title: 'Self-Fulfilled',
            desc: 'You pack & ship directly'
          },
          {
            id: 'marketplace',
            title: 'Marketplace Logistics',
            desc: 'Platform handles fulfillment'
          },
          {
            id: 'hybrid',
            title: 'Hybrid Shipping',
            desc: 'Flexible combination'
          }
        ].map((type) => (
          <div
            key={type.id}
            onClick={() =>
              onChange({ fulfillmentType: type.id })
            }
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              data.fulfillmentType === type.id
                ? 'bg-emerald-500/10 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <h4 className="text-sm font-bold">
              {type.title}
            </h4>

            <p className="text-xs text-slate-400 mt-1">
              {type.desc}
            </p>
          </div>
        ))}

      </div>

      {/* GLOBAL SHIPPING DEFAULTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Standard Order Handling Time
          </label>

          <select
            value={data.handlingTimeDays}
            onChange={(e) =>
              onChange({
                handlingTimeDays: Number(e.target.value)
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value={1}>
              Same Business Day (1 Day)
            </option>
            <option value={2}>
              1 - 2 Business Days
            </option>
            <option value={3}>
              3 - 5 Business Days
            </option>
            <option value={7}>
              1 Week
            </option>
          </select>

        </div>

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Free Shipping Order Threshold ($)
          </label>

          <div className="relative">

            <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />

            <input
              type="number"
              value={data.freeShippingThreshold}
              onChange={(e) =>
                onChange({
                  freeShippingThreshold: Number(e.target.value)
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />

          </div>
        </div>
      </div>

      {/* SHIPPING ZONES */}
      <div className="pt-4 border-t border-slate-800/80">

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-sm font-semibold text-white">
            Configured Shipping Zones
          </h3>

          <button className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Zone
          </button>

        </div>

        <div className="space-y-3">

          {data.shippingZones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800/80 rounded-xl"
            >

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={zone.enabled}
                  onChange={() =>
                    toggleZone(zone.id)
                  }
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950"
                />

                <div>

                  <h4 className="text-sm font-semibold text-slate-200">
                    {zone.name}
                  </h4>

                  <p className="text-xs text-slate-400">
                    Est. Delivery: {zone.minDays}-{zone.maxDays} Business Days
                  </p>

                </div>
              </div>

              <div className="text-right">

                <span className="text-sm font-bold text-emerald-400">
                  ${zone.fee.toFixed(2)}
                </span>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAYMENT SETTINGS
   ========================================================================= */

function PaymentSettings({ data, onChange }) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Payment & Payout Options
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Manage payout methods, tax credentials, and disbursement cycles.
        </p>
      </div>

      {/* PAYOUT METHOD */}
      <div className="space-y-3">

        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Primary Payout Method
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {[
            {
              id: 'bank',
              name: 'Direct Bank Transfer',
              detail: 'ACH / Wire Transfer'
            },
            {
              id: 'stripe',
              name: 'Stripe Express',
              detail: 'Instant Connect'
            },
            {
              id: 'paypal',
              name: 'PayPal Account',
              detail: 'Digital Wallet'
            }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() =>
                onChange({ payoutMethod: m.id })
              }
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                data.payoutMethod === m.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <h4 className="text-sm font-bold">
                {m.name}
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                {m.detail}
              </p>
            </button>
          ))}

        </div>
      </div>

      {/* BANK CONFIGURATION */}
      {data.payoutMethod === 'bank' && (
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">

          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Bank Account Credentials
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>

              <label className="block text-xs text-slate-400 mb-1">
                Bank Name
              </label>

              <input
                type="text"
                value={data.bankDetails.bankName}
                onChange={(e) =>
                  onChange({
                    bankDetails: {
                      ...data.bankDetails,
                      bankName: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />

            </div>

            <div>

              <label className="block text-xs text-slate-400 mb-1">
                Account Holder Name
              </label>

              <input
                type="text"
                value={data.bankDetails.accountHolder}
                onChange={(e) =>
                  onChange({
                    bankDetails: {
                      ...data.bankDetails,
                      accountHolder: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />

            </div>

          </div>
        </div>
      )}

      {/* TAX & PAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Tax Identification Number (EIN / GSTIN / VAT)
          </label>

          <input
            type="text"
            value={data.taxId}
            onChange={(e) =>
              onChange({ taxId: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
          />

        </div>

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Automated Payout Schedule
          </label>

          <select
            value={data.payoutSchedule}
            onChange={(e) =>
              onChange({
                payoutSchedule: e.target.value
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="daily">
              Daily Settlements
            </option>

            <option value="weekly">
              Weekly (Every Monday)
            </option>

            <option value="monthly">
              Monthly (1st of month)
            </option>
          </select>

        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   NOTIFICATION SETTINGS
   ========================================================================= */

function NotificationSettings({ data, onChange }) {
  const toggleNotif = (channel, key) => {
    onChange({
      [channel]: {
        ...data[channel],
        [key]: !data[channel][key]
      }
    });
  };

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Notification Preferences
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Control real-time order alerts, inventory notifications, and financial updates.
        </p>
      </div>

      {/* EMAIL */}
      <div className="space-y-3">

        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
          Email Channels
        </h3>

        {[
          {
            key: 'newOrders',
            label: 'New Order Receipts',
            desc: 'Instant email when a customer places an order'
          },
          {
            key: 'lowStock',
            label: 'Low Stock Threshold Warnings',
            desc: 'Alert when inventory counts drop below safety stock'
          },
          {
            key: 'payouts',
            label: 'Payout Disbursements',
            desc: 'Confirmations when payout transfers process'
          }
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800/80 rounded-xl"
          >

            <div>

              <p className="text-sm font-medium text-slate-200">
                {item.label}
              </p>

              <p className="text-xs text-slate-500">
                {item.desc}
              </p>

            </div>

            <button
              onClick={() =>
                toggleNotif('email', item.key)
              }
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                data.email[item.key]
                  ? 'bg-emerald-500 justify-end'
                  : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

/* =========================================================================
   SECURITY SETTINGS
   ========================================================================= */

function SecuritySettings({ data, onChange }) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Security & API Credentials
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Protect your account with Two-Factor Authentication and API integration keys.
        </p>
      </div>

      {/* 2FA */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Smartphone className="w-6 h-6" />
          </div>

          <div>

            <h4 className="text-sm font-bold text-white">
              Two-Factor Authentication (2FA)
            </h4>

            <p className="text-xs text-slate-400">
              Authenticator app or SMS code verification
            </p>

          </div>
        </div>

        <button
          onClick={() =>
            onChange({
              twoFactorEnabled: !data.twoFactorEnabled
            })
          }
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            data.twoFactorEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          {data.twoFactorEnabled
            ? 'Enabled'
            : 'Enable 2FA'}
        </button>

      </div>

      {/* API KEYS */}
      <div className="pt-2">

        <h3 className="text-sm font-semibold text-white mb-3">
          Active API Access Keys
        </h3>

        <div className="space-y-2">

          {data.apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs"
            >

              <div className="flex items-center gap-3">

                <Key className="w-4 h-4 text-emerald-400" />

                <div>

                  <span className="text-slate-200 font-sans font-medium block">
                    {key.name}
                  </span>

                  <span className="text-slate-500 text-[11px]">
                    Last used: {key.lastUsed}
                  </span>

                </div>

              </div>

              <button className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   POLICY SETTINGS
   ========================================================================= */

function PolicySettings({ data, onChange }) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">
          Store Policies & Customer Information
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Specify return policies, terms, and custom frequently asked questions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Return Window (Days)
          </label>

          <input
            type="number"
            value={data.returnWindowDays}
            onChange={(e) =>
              onChange({
                returnWindowDays: Number(e.target.value)
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />

        </div>

        <div>

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Restocking Fee (%)
          </label>

          <input
            type="number"
            value={data.restockingFeePercent}
            onChange={(e) =>
              onChange({
                restockingFeePercent: Number(e.target.value)
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />

        </div>

        <div className="sm:col-span-2">

          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Custom Return Policy Terms
          </label>

          <textarea
            rows={4}
            value={data.customReturnPolicy}
            onChange={(e) =>
              onChange({
                customReturnPolicy: e.target.value
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />

        </div>

      </div>
    </div>
  );
}
