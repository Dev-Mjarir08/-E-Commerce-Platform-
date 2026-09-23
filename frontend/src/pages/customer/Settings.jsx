import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Eye,
  Heart,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, updateUser } from "../../redux/slices/authSlice";

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Active section tab state: 'account' | 'security' | 'notifications' | 'privacy' | 'danger'
  const [activeTab, setActiveTab] = useState("account");

  // Account Settings Form State
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [savingAccount, setSavingAccount] = useState(false);

  // Password & Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notification Preferences State (persisted in localStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("atelier_notification_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved notification settings:", e);
    }
    return {
      emailReceipts: true,
      orderUpdates: true,
      privilegeSales: true,
      wishlistAlerts: false,
      smsAlerts: true,
    };
  });

  // Privacy Settings State (persisted in localStorage)
  const [privacy, setPrivacy] = useState(() => {
    try {
      const saved = localStorage.getItem("atelier_privacy_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved privacy settings:", e);
    }
    return {
      profileSearchable: false,
      activityTracking: true,
      personalizedRecommendations: true,
      dataSharingPartners: false,
    };
  });

  // Delete Account Modal & Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Toast message feed
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      await dispatch(
        updateUser({
          name: accountForm.name,
          phone: accountForm.phone,
        }),
      );
      showToast(
        "success",
        "Account credentials and profile info updated successfully.",
      );
    } catch (err) {
      showToast(
        "error",
        err.message || "Failed to update account information.",
      );
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("error", "Please enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters long.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("success", "Security credentials updated successfully.");
    }, 800);
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(
          "atelier_notification_settings",
          JSON.stringify(updated),
        );
      } catch (err) {
        console.warn("Failed to save notification settings:", err);
      }
      return updated;
    });
    showToast("info", "Notification preferences saved.");
  };

  const handleTogglePrivacy = (key) => {
    setPrivacy((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(
          "atelier_privacy_settings",
          JSON.stringify(updated),
        );
      } catch (err) {
        console.warn("Failed to save privacy settings:", err);
      }
      return updated;
    });
    showToast("info", "Privacy settings updated.");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== "DELETE") {
      showToast("error", "Please type DELETE to confirm account removal.");
      return;
    }

    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfirmationText("");
      dispatch(logoutUser());
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#111111] selection:text-m4m-bg">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="pb-6 border-b border-m4m-border flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent block mb-2">
              CLIENT CONCIERGE • CONFIGURATION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Account Settings & Preferences
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] hover:border-[#111111] transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all ${
              toastMessage.type === "success"
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                : toastMessage.type === "error"
                  ? "bg-rose-50/80 border-rose-300 text-rose-900"
                  : "bg-amber-50/80 border-amber-300 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : toastMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              ) : (
                <Sliders className="w-4 h-4 text-amber-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-m4m-accent hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Grid: Left Navigation Tabs (4 cols) & Right Form Pane (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick User Identity Summary */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#111111] text-m4m-bg font-serif text-lg flex items-center justify-center font-bold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "AT"}
                </div>
                <div>
                  <h3 className="font-serif text-base uppercase text-[#111111] font-semibold">
                    {user?.name || "Valued Client"}
                  </h3>
                  <p className="text-xs font-mono text-m4m-accent">
                    {user?.email || "client@atelier.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Tab Menu */}
            <div className="bg-m4m-card border border-m4m-border p-4 space-y-1 shadow-xs font-mono text-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-m4m-accent block px-3 py-2">
                SETTINGS CATEGORIES
              </span>

              {/* Tab 1: Account */}
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-all ${
                  activeTab === "account"
                    ? "border-[#111111] bg-m4m-bg text-[#111111] font-semibold"
                    : "border-transparent text-m4m-secondary hover:bg-m4m-bg hover:text-[#111111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Account Credentials</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Tab 2: Security */}
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-all ${
                  activeTab === "security"
                    ? "border-[#111111] bg-m4m-bg text-[#111111] font-semibold"
                    : "border-transparent text-m4m-secondary hover:bg-m4m-bg hover:text-[#111111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span>Password & Security</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Tab 3: Notifications */}
              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-all ${
                  activeTab === "notifications"
                    ? "border-[#111111] bg-m4m-bg text-[#111111] font-semibold"
                    : "border-transparent text-m4m-secondary hover:bg-m4m-bg hover:text-[#111111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notification Alerts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Tab 4: Privacy */}
              <button
                type="button"
                onClick={() => setActiveTab("privacy")}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-all ${
                  activeTab === "privacy"
                    ? "border-[#111111] bg-m4m-bg text-[#111111] font-semibold"
                    : "border-transparent text-m4m-secondary hover:bg-m4m-bg hover:text-[#111111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4" />
                  <span>Privacy & Data</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Tab 5: Danger Zone */}
              <button
                type="button"
                onClick={() => setActiveTab("danger")}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-all ${
                  activeTab === "danger"
                    ? "border-rose-600 bg-rose-50 text-rose-900 font-semibold"
                    : "border-transparent text-rose-800 hover:bg-rose-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Danger Zone</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent block mb-2">
                RELATED CONCIERGE VIEWS
              </span>
              <div className="space-y-2 text-xs font-mono">
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-m4m-secondary hover:text-[#111111]"
                >
                  <Package className="w-3.5 h-3.5 text-m4m-accent" />
                  <span>Order Archive</span>
                </Link>
                <Link
                  to="/addresses"
                  className="flex items-center gap-2 text-m4m-secondary hover:text-[#111111]"
                >
                  <MapPin className="w-3.5 h-3.5 text-m4m-accent" />
                  <span>Delivery Address Book</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 text-m4m-secondary hover:text-[#111111]"
                >
                  <Heart className="w-3.5 h-3.5 text-m4m-accent" />
                  <span>Saved Wishlist</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Main Pane */}
          <div className="lg:col-span-8 space-y-8">
            {/* SECTION 1: ACCOUNT SETTINGS */}
            {(activeTab === "account" || activeTab === "all") && (
              <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      1. Account Credentials & Info
                    </h2>
                    <p className="text-xs text-m4m-secondary font-sans mt-1">
                      Update your account name, primary phone number, and client
                      status.
                    </p>
                  </div>
                  <User className="w-5 h-5 text-m4m-accent" />
                </div>

                <form onSubmit={handleSaveAccount} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={accountForm.name}
                          onChange={handleAccountInputChange}
                          required
                          className="w-full bg-m4m-bg border border-m4m-border px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                          placeholder="John Doe"
                        />
                        <User className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={accountForm.email}
                          className="w-full bg-m4m-border/50 border border-m4m-border px-4 py-3 text-xs font-sans text-m4m-secondary cursor-not-allowed"
                        />
                        <Mail className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                      <span className="text-[10px] font-mono text-m4m-accent">
                        Email changes require security verification.
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="phone"
                          value={accountForm.phone}
                          onChange={handleAccountInputChange}
                          className="w-full bg-m4m-bg border border-m4m-border px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                          placeholder="+91 98765 43210"
                        />
                        <Phone className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Account Role / Status */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Client Tier / Privilege
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value={
                            user?.role
                              ? `${user.role.toUpperCase()} (VERIFIED)`
                              : "CUSTOMER (VERIFIED)"
                          }
                          className="w-full bg-m4m-border/50 border border-m4m-border px-4 py-3 text-xs font-mono text-m4m-secondary cursor-not-allowed"
                        />
                        <ShieldCheck className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-m4m-border flex justify-end">
                    <button
                      type="submit"
                      disabled={savingAccount}
                      className="px-6 py-3 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xs"
                    >
                      {savingAccount ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECTION 2: PASSWORD / SECURITY */}
            {(activeTab === "security" || activeTab === "all") && (
              <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      2. Password & Security Credentials
                    </h2>
                    <p className="text-xs text-m4m-secondary font-sans mt-1">
                      Manage your password and authentication protections.
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-m4m-accent" />
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••••••"
                        className="w-full bg-m4m-bg border border-m4m-border px-4 py-2.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••••••"
                        className="w-full bg-m4m-bg border border-m4m-border px-4 py-2.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••••••"
                        className="w-full bg-m4m-bg border border-m4m-border px-4 py-2.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-m4m-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-m4m-accent">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>256-Bit Encrypted Session</span>
                    </div>

                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="px-6 py-3 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {updatingPassword ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECTION 3: NOTIFICATION SETTINGS */}
            {(activeTab === "notifications" || activeTab === "all") && (
              <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      3. Notification & Alert Preferences
                    </h2>
                    <p className="text-xs text-m4m-secondary font-sans mt-1">
                      Configure how and when you receive order receipts and
                      concierge updates.
                    </p>
                  </div>
                  <Bell className="w-5 h-5 text-m4m-accent" />
                </div>

                <div className="divide-y divide-m4m-border">
                  {/* Toggle Option 1: Order Updates */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Order & Shipment Updates
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Receive digital receipts, tracking numbers, and delivery
                        confirmation alerts.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle order and shipment updates"
                      aria-pressed={notifications.orderUpdates}
                      onClick={() => handleToggleNotification("orderUpdates")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.orderUpdates
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          notifications.orderUpdates
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Option 2: Email Receipts */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Email Invoices & Transaction Copies
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Automated PDF receipt generation sent directly to
                        primary account email.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle email invoices and transaction copies"
                      aria-pressed={notifications.emailReceipts}
                      onClick={() => handleToggleNotification("emailReceipts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.emailReceipts
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          notifications.emailReceipts
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Option 3: Privilege Sales */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Privilege Sale & Private Collection Invites
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Exclusive advance notification for seasonal drops and
                        bespoke runway previews.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle privilege sale and private collection invites"
                      aria-pressed={notifications.privilegeSales}
                      onClick={() => handleToggleNotification("privilegeSales")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.privilegeSales
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          notifications.privilegeSales
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Option 4: Wishlist Alerts */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Wishlist Back-in-Stock & Price Alerts
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Alerts when saved items from your wishlist are restocked
                        or discounted.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle wishlist alerts"
                      aria-pressed={notifications.wishlistAlerts}
                      onClick={() => handleToggleNotification("wishlistAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.wishlistAlerts
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          notifications.wishlistAlerts
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: PRIVACY */}
            {(activeTab === "privacy" || activeTab === "all") && (
              <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      4. Privacy Controls & Data Sharing
                    </h2>
                    <p className="text-xs text-m4m-secondary font-sans mt-1">
                      Manage how your client profile data and browsing telemetry
                      are utilized.
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-m4m-accent" />
                </div>

                <div className="divide-y divide-m4m-border">
                  {/* Privacy Option 1: Personalized Recommendations */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Personalized Atelier Recommendations
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Tailor homepage lookbooks and catalog suggestions to
                        your styling history.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle personalized recommendations"
                      aria-pressed={privacy.personalizedRecommendations}
                      onClick={() =>
                        handleTogglePrivacy("personalizedRecommendations")
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        privacy.personalizedRecommendations
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          privacy.personalizedRecommendations
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Privacy Option 2: Activity Tracking */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        Session Activity Telemetry
                      </h4>
                      <p className="text-xs text-m4m-secondary">
                        Allow secure analytical logging to improve navigation
                        performance.
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle session activity telemetry"
                      aria-pressed={privacy.activityTracking}
                      onClick={() => handleTogglePrivacy("activityTracking")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        privacy.activityTracking
                          ? "bg-[#111111]"
                          : "bg-m4m-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          privacy.activityTracking
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: DANGER ZONE */}
            {(activeTab === "danger" || activeTab === "all") && (
              <div className="bg-m4m-card border border-rose-300 p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600" />

                <div className="pb-4 border-b border-rose-200 flex items-center justify-between text-rose-900">
                  <div>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-rose-950 font-bold">
                      5. Danger Zone & Account Termination
                    </h2>
                    <p className="text-xs text-rose-800 font-sans mt-1">
                      Irreversible account operations and session termination
                      options.
                    </p>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-rose-700" />
                </div>

                <div className="space-y-6">
                  {/* Option 1: Sign Out Session */}
                  <div className="p-4 bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-rose-950 font-semibold">
                        Terminate Current Client Session
                      </h4>
                      <p className="text-xs text-rose-800">
                        Sign out of your active Atelier session on this device.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-rose-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-rose-950 transition-colors flex items-center gap-2 shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Now</span>
                    </button>
                  </div>

                  {/* Option 2: Delete Account */}
                  <div className="p-4 bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm uppercase text-rose-950 font-semibold">
                        Permanent Account Deletion
                      </h4>
                      <p className="text-xs text-rose-800">
                        Remove client profile, saved address records, and clear
                        local session archives.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-5 py-2.5 border border-rose-700 text-rose-900 hover:bg-rose-700 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs">
          <div className="bg-m4m-card border border-rose-300 max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-m4m-accent hover:text-[#111111] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-rose-200 flex items-center gap-3 text-rose-900">
              <ShieldAlert className="w-6 h-6 text-rose-700" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-800 block">
                  PERMANENT ACTION
                </span>
                <h3 className="font-serif text-lg uppercase tracking-wider text-rose-950">
                  Confirm Account Removal
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              This action cannot be reversed. Please type{" "}
              <strong className="font-mono text-rose-900">DELETE</strong> in the
              box below to authorize account termination and session wipe.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                Type DELETE to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-m4m-bg border border-m4m-border px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="pt-3 border-t border-m4m-border flex justify-end gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-m4m-border text-m4m-secondary hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={
                  deleting ||
                  deleteConfirmationText.trim().toUpperCase() !== "DELETE"
                }
                className="px-5 py-2 bg-rose-900 text-white uppercase tracking-wider hover:bg-rose-950 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
