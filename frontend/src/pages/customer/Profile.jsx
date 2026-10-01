import { useState, useRef } from 'react';
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
  AlertCircle,
  LayoutDashboard,
  Store,
  Camera,
  Upload
} from 'lucide-react';
import { updateUser, logoutUser } from '../../redux/slices/authSlice';
import { useToast } from '../../context/ToastContext';
import customerApi from '../../services/customerApi';
import { getImageUrl, DEFAULT_COVER_FALLBACK } from '../../utils/imageUrl';

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  // Hidden file input references for avatar and cover banner
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Local state for editing form details
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  // Local loading states for saving and uploading
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Local preview states for instant visual feedback
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || user?.avatar || null);
  const [coverPreview, setCoverPreview] = useState(user?.coverImage?.url || user?.coverImage || null);

  // Helper to generate initials when no avatar image exists
  const getInitials = (name) => {
    if (!name) return 'AT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Handle Profile Avatar Upload
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Prepare multipart form data
    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      // Send file to customer avatar endpoint
      const res = await customerApi.uploadAvatar(uploadData);
      const newAvatar = res?.data?.avatar || res?.avatar || { url: previewUrl };

      // Update Redux state and localStorage so Navbar immediately updates
      dispatch(updateUser({ avatar: newAvatar }));
      showToast('Profile photo updated successfully!', 'success');
    } catch (err) {
      console.error('Avatar upload error:', err);
      showToast(err?.message || 'Failed to upload profile photo.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 2. Handle Cover Banner Upload
  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);

    // Prepare multipart form data
    const uploadData = new FormData();
    uploadData.append('image', file);
    uploadData.append('cover', file);

    setUploadingCover(true);
    try {
      // Send file to customer cover endpoint
      const res = await customerApi.uploadCover(uploadData);
      const newCover = res?.data?.coverImage || res?.coverImage || { url: previewUrl };

      // Update Redux state and localStorage
      dispatch(updateUser({ coverImage: newCover }));
      showToast('Cover banner photo updated successfully!', 'success');
    } catch (err) {
      console.error('Cover upload error:', err);
      showToast(err?.message || 'Failed to update cover photo.', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // 3. Handle Saving Profile Text Information
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Send update payload to backend API
      await customerApi.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      // Update Redux state
      dispatch(
        updateUser({
          name: formData.name.trim(),
          phone: formData.phone.trim()
        })
      );

      showToast('Profile details updated successfully.', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 4. Handle User Logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    showToast('Signed out of Atelier session.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] py-8 sm:py-12 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#111111] selection:text-[#FAF9F6]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-1">
              CLIENT PORTAL • ACCOUNT MANAGEMENT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase font-normal">
              My Profile & Wardrobe
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-mono uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* HERO COVER BANNER & PROFILE HEADER */}
        <div className="bg-white border border-[#E5E3DF] shadow-sm overflow-hidden relative">
          
          {/* Cover Photo Area */}
          <div className="relative h-44 sm:h-60 bg-[#1A1A1A] overflow-hidden group">
            {coverPreview ? (
              <img
                src={getImageUrl(coverPreview, DEFAULT_COVER_FALLBACK)}
                alt="Profile Cover"
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-[#111111] via-[#1E1E1E] to-[#2B2B2B] flex items-center justify-center">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#8E877F]">
                  ATELIER CLIENT SANCTUARY • EST. 2026
                </span>
              </div>
            )}

            {/* Edit Cover Photo Button */}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider px-3.5 py-2 border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              title="Change cover background"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{uploadingCover ? 'Uploading...' : 'Edit Cover'}</span>
            </button>

            {/* Hidden Cover File Input */}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverFileChange}
              className="hidden"
            />
          </div>

          {/* Profile Header Lower Bar with Avatar */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
              
              {/* Avatar Circle with Upload Trigger */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#111111] text-white flex items-center justify-center text-3xl font-serif overflow-hidden border-4 border-white shadow-xl ring-1 ring-[#E5E3DF]">
                  {avatarPreview ? (
                    <img
                      src={getImageUrl(avatarPreview)}
                      alt={user?.name || 'User Avatar'}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarPreview(null)}
                    />
                  ) : (
                    <span>{getInitials(user?.name)}</span>
                  )}
                </div>

                {/* Avatar Camera Button */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-1 right-1 bg-[#111111] hover:bg-[#333333] text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                  title="Upload profile photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {/* Hidden Avatar File Input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              {/* User Name & Identity */}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight">
                    {user?.name || 'Valued Client'}
                  </h2>
                  {user?.isVerified && (
                    <span title="Verified Account">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8E877F] font-mono">{user?.email || 'N/A'}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 bg-[#FAF9F6] border border-[#E5E3DF] text-[#111111]">
                    ROLE: {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 border ${
                      user?.isVerified
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {user?.isVerified ? 'VERIFIED' : 'ACTIVE CLIENT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Edit Information Shortcut */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider px-4 py-2.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Account Info</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Account Navigation Archive (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E5E3DF] p-6 space-y-3 shadow-xs">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] mb-4">
                ACCOUNT ARCHIVE
              </h3>
              
              <nav className="space-y-1">
                {/* Operations Dashboard Shortcut (Admin / Vendor only) */}
                {(user?.role === 'admin' || user?.role === 'vendor' || user?.role === 'seller') && (
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
                    className="flex items-center justify-between p-3 bg-[#111111] text-[#F8F7F4] hover:bg-[#222222] text-xs font-mono uppercase tracking-wider font-semibold transition-colors mb-2"
                  >
                    <div className="flex items-center gap-3">
                      {user.role === 'admin' ? (
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Store className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>{user.role === 'admin' ? 'Admin Suite' : 'Vendor Portal'}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/70" />
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] border-l-2 border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] font-medium"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#111111]" />
                    <span>Personal Profile</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 hover:bg-[#FAF9F6] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#8E877F]" />
                    <span>Order History</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center justify-between p-3 hover:bg-[#FAF9F6] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#8E877F]" />
                    <span>Saved Addresses</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 hover:bg-[#FAF9F6] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#8E877F]" />
                    <span>Wishlist Archive</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between p-3 hover:bg-[#FAF9F6] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#8E877F]" />
                    <span>Active Bag</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 hover:bg-[#FAF9F6] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-[#8E877F]" />
                    <span>Security & Password</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </Link>
              </nav>
            </div>

            {/* Quick Media Upload Hint Box */}
            <div className="bg-[#FAF9F6] border border-[#E5E3DF] p-5 text-xs text-[#666666] space-y-2">
              <span className="font-mono uppercase tracking-wider text-[10px] text-[#111111] font-semibold block">
                PHOTO MANAGEMENT TIP
              </span>
              <p className="leading-relaxed">
                You can update your personal avatar and cover banner photo anytime by clicking the camera icons above. Supported formats: JPEG, PNG, WEBP.
              </p>
            </div>
          </div>

          {/* Right Column: Main Profile Information Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Details Form Section */}
            <div className="bg-white border border-[#E5E3DF] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E3DF]">
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                    Account Credentials & Information
                  </h3>
                  <p className="text-xs text-[#8E877F] font-sans mt-1">
                    Manage your personal details, contact number, and wardrobe profile.
                  </p>
                </div>
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
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] disabled:opacity-75 transition-colors"
                        placeholder="John Doe"
                      />
                      <User className="w-4 h-4 text-[#8E877F] absolute right-3.5 top-3.5 pointer-events-none" />
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
                        className="w-full bg-[#F0EFEB] border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-[#666666] cursor-not-allowed"
                      />
                      <Mail className="w-4 h-4 text-[#8E877F] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    <span className="text-[10px] font-mono text-[#8E877F]">
                      Primary identity email cannot be modified directly.
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
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] disabled:opacity-75 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                      <Phone className="w-4 h-4 text-[#8E877F] absolute right-3.5 top-3.5 pointer-events-none" />
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
                        className="w-full bg-[#F0EFEB] border border-[#E5E3DF] px-4 py-3 text-xs font-mono uppercase text-[#666666] cursor-not-allowed"
                      />
                      <ShieldCheck className="w-4 h-4 text-[#8E877F] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                {isEditing && (
                  <div className="pt-4 border-t border-[#E5E3DF] flex items-center justify-end gap-4">
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
                      className="px-5 py-2.5 border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
                className="bg-white border border-[#E5E3DF] p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-[#FAF9F6] border border-[#E5E3DF] flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Orders & Returns
                </h4>
                <p className="text-[11px] text-[#8E877F] mt-1">Track shipments and order history</p>
              </Link>

              <Link
                to="/addresses"
                className="bg-white border border-[#E5E3DF] p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-[#FAF9F6] border border-[#E5E3DF] flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Address Book
                </h4>
                <p className="text-[11px] text-[#8E877F] mt-1">Manage delivery locations</p>
              </Link>

              <Link
                to="/wishlist"
                className="bg-white border border-[#E5E3DF] p-5 hover:border-[#111111] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 bg-[#FAF9F6] border border-[#E5E3DF] flex items-center justify-center text-[#111111] mb-3 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Saved Wishlist
                </h4>
                <p className="text-[11px] text-[#8E877F] mt-1">Curated garment collection</p>
              </Link>
            </div>

            {/* Security & Authentication Notice */}
            <div className="bg-white border border-[#E5E3DF] p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#111111]" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                  Security & Authentication
                </h3>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">
                Your Atelier client session is secured with JWT token authentication. You can change your password anytime under the Security tab.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#8E877F]">
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
