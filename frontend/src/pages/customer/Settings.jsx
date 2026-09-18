import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import customerApi from '../../services/customerApi';

export const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    exclusiveDrops: true,
    newsletter: false,
    smsAlerts: false
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await customerApi.changePassword({ currentPassword, newPassword });
      showToast('success', 'Security password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast('error', err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('success', 'Preferences updated.');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Breadcrumb */}
        <div className="pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/profile"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Account Archive</span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E877F]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                Security & Preferences
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Account Settings
            </h1>
            <p className="text-xs text-[#8E877F] font-sans mt-1">
              Configure security credentials, notification channels, and account privacy.
            </p>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className={`p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-rose-50/90 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-[#8E877F] hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section 1: Security & Password */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E3DF]">
            <KeyRound className="w-5 h-5 text-[#111111]" />
            <div>
              <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                Security Password
              </h3>
              <p className="text-xs text-[#8E877F]">
                Keep your authentication credentials protected with a strong multi-character key.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-10 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-[#8E877F] hover:text-[#111111]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 chars"
                    className="w-full px-3 py-2 pr-10 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-[#8E877F] hover:text-[#111111]"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {changingPassword && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Credentials</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Communication Preferences */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E3DF]">
            <Bell className="w-5 h-5 text-[#111111]" />
            <div>
              <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                Notification & Dispatch Channels
              </h3>
              <p className="text-xs text-[#8E877F]">
                Tailor how the Atelier concierge contacts you regarding consignments and events.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            {[
              {
                id: 'orderUpdates',
                title: 'Consignment Milestones & Tracking Pings',
                desc: 'Real-time notifications when your acquisition is dispatched or out for courier delivery.'
              },
              {
                id: 'exclusiveDrops',
                title: 'Private Salon & Archival Drops',
                desc: 'Advance notice on rare garment editions, bespoke releases, and private member salons.'
              },
              {
                id: 'newsletter',
                title: 'Atelier Editorial Journal',
                desc: 'Quarterly curation on textile provenance, design ethos, and master artisans.'
              },
              {
                id: 'smsAlerts',
                title: 'Urgent SMS Concierge Dispatch',
                desc: 'Receive direct SMS verification codes and delivery arrival alerts.'
              }
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 border border-[#E5E3DF] bg-[#F8F7F4]"
              >
                <div className="pr-4">
                  <h5 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-[#8E877F] font-sans mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={notifications[item.id]}
                    onChange={() => handleNotificationToggle(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E5E3DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E3DF] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111111]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Account Verification & Status */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E3DF]">
            <ShieldCheck className="w-5 h-5 text-[#111111]" />
            <div>
              <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                Account Classification
              </h3>
              <p className="text-xs text-[#8E877F]">
                Client privileges and verification standing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F8F7F4] border border-[#E5E3DF]">
              <span className="text-[10px] text-[#8E877F] uppercase block">Assigned Role</span>
              <span className="font-semibold text-[#111111] uppercase mt-1 block">
                {user?.role || 'Customer'}
              </span>
            </div>
            <div className="p-3 bg-[#F8F7F4] border border-[#E5E3DF]">
              <span className="text-[10px] text-[#8E877F] uppercase block">Security Standing</span>
              <span className="font-semibold text-emerald-700 uppercase mt-1 block">
                {user?.status || 'Active'}
              </span>
            </div>
            <div className="p-3 bg-[#F8F7F4] border border-[#E5E3DF]">
              <span className="text-[10px] text-[#8E877F] uppercase block">Verification</span>
              <span className="font-semibold text-[#111111] uppercase mt-1 block">
                {user?.isVerified ? 'Verified Client' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
