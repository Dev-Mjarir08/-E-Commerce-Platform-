import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Package,
  MapPin,
  Heart,
  LogOut,
  Edit3,
  Check,
  Lock,
  Clock,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { updateUser, logoutUser } from '../../redux/slices/authSlice';

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Local state for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Calculate initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'AT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Dispatch redux update user
      await dispatch(
        updateUser({
          name: formData.name,
          phone: formData.phone
        })
      );
      setToastMessage({ type: 'success', text: 'Profile details updated successfully.' });
      setIsEditing(false);
    } catch (err) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-m4m-border flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent block mb-2">
              CLIENT PORTAL • ACCOUNT MANAGEMENT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              My Profile & Preferences
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-m4m-border hover:border-[#111111] hover:bg-[#111111] hover:text-m4m-bg text-[#111111] text-xs font-mono uppercase tracking-wider transition-all rounded-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : 'bg-rose-50/80 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: User Summary Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-m4m-card border border-m4m-border p-6 text-center space-y-5 shadow-xs">
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#111111] text-m4m-bg font-serif text-2xl tracking-widest flex items-center justify-center border-2 border-m4m-border">
                  {getInitials(user?.name)}
                </div>
                {user?.isVerified && (
                  <div
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white"
                    title="Verified Account"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-serif text-xl text-[#111111] font-medium tracking-tight">
                  {user?.name || 'Valued Client'}
                </h2>
                <p className="text-xs text-m4m-accent font-mono mt-1">{user?.email || 'N/A'}</p>
              </div>

              <div className="pt-3 border-t border-m4m-border flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 bg-m4m-bg border border-m4m-border text-[#111111]">
                  ROLE: {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 border ${
                    user?.isVerified
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {user?.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
            </div>

            {/* Quick Navigation Menu */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent mb-4">
                ACCOUNT ARCHIVE
              </h3>
              <nav className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-3 bg-m4m-bg border-l-2 border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] font-medium"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#111111]" />
                    <span>Personal Profile</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 hover:bg-m4m-bg text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-m4m-accent" />
                    <span>Order History</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-m4m-accent" />
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center justify-between p-3 hover:bg-m4m-bg text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-m4m-accent" />
                    <span>Saved Addresses</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-m4m-accent" />
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 hover:bg-m4m-bg text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-m4m-accent" />
                    <span>Wishlist Archive</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-m4m-accent" />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between p-3 hover:bg-m4m-bg text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-m4m-accent" />
                    <span>Active Bag</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-m4m-accent" />
                </Link>
              </nav>
            </div>
          </div>

          {/* Right Column: Main Profile Information Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Details Form Section */}
            <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-m4m-border">
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                    Account Credentials & Information
                  </h3>
                  <p className="text-xs text-m4m-accent font-sans mt-1">
                    Manage your identity, communication preferences, and personal details.
                  </p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3.5 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-m4m-bg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Info</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-m4m-bg border border-m4m-border px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] disabled:opacity-75 transition-colors"
                        placeholder="John Doe"
                      />
                      <User className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email Input (Read-only for security) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        disabled
                        value={formData.email}
                        className="w-full bg-m4m-border/50 border border-m4m-border px-4 py-3 text-xs font-sans text-m4m-secondary cursor-not-allowed"
                      />
                      <Mail className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    <span className="text-[10px] font-mono text-m4m-accent">
                      Email address cannot be changed directly.
                    </span>
                  </div>

                  {/* Phone Number Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-m4m-bg border border-m4m-border px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] disabled:opacity-75 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                      <Phone className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Role Display */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] block">
                      Account Status
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={user?.status ? user.status.toUpperCase() : 'ACTIVE'}
                        className="w-full bg-m4m-border/50 border border-m4m-border px-4 py-3 text-xs font-mono uppercase text-m4m-secondary cursor-not-allowed"
                      />
                      <ShieldCheck className="w-4 h-4 text-m4m-accent absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                {isEditing && (
                  <div className="pt-4 border-t border-m4m-border flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          email: user?.email || ''
                        });
                      }}
                      className="px-5 py-2.5 border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/orders"
                className="bg-m4m-card border border-m4m-border p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-m4m-bg border border-m4m-border flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-m4m-bg transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Orders & Returns
                </h4>
                <p className="text-[11px] text-m4m-accent mt-1">Track shipments and order history</p>
              </Link>

              <Link
                to="/addresses"
                className="bg-m4m-card border border-m4m-border p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-m4m-bg border border-m4m-border flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-m4m-bg transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Address Book
                </h4>
                <p className="text-[11px] text-m4m-accent mt-1">Manage delivery locations</p>
              </Link>

              <Link
                to="/wishlist"
                className="bg-m4m-card border border-m4m-border p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-m4m-bg border border-m4m-border flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-m4m-bg transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Saved Wishlist
                </h4>
                <p className="text-[11px] text-m4m-accent mt-1">Curated garment collection</p>
              </Link>
            </div>

            {/* Security & Authentication Notice */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#111111]" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                  Security & Authentication
                </h3>
              </div>
              <p className="text-xs text-m4m-secondary leading-relaxed">
                Your Atelier client session is secured with JWT token encryption. If you need to update your password or request account deletion, please use our secure identity verification flow.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-m4m-accent">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Session Active</span>
                </div>
                <span>•</span>
                <span>Role: {user?.role || 'Customer'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
