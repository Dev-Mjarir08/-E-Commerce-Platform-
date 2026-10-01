import { useState, useEffect } from 'react';
import {
  Shield,
  Globe,
  UserPlus,
  Users,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  User,
  X,
  RefreshCw
} from 'lucide-react';
import adminApi from '../../services/adminApi';

const Settings = () => {
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    secretKey: ''
  });

  const fetchAdmins = async () => {
    try {
      const res = await adminApi.getAllAdmins();
      if (res?.data) {
        setAdmins(res.data);
      }
    } catch (err) {
      console.warn('Failed to load admin list:', err.message);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    let active = true;
    adminApi.getAllAdmins()
      .then((res) => {
        if (active && res?.data) setAdmins(res.data);
      })
      .catch((err) => {
        console.warn('Failed to load admin list:', err.message);
      })
      .finally(() => {
        if (active) setLoadingAdmins(false);
      });
    return () => { active = false; };
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    if (newAdmin.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setCreatingAdmin(true);
    try {
      const res = await adminApi.createAdmin({
        name: newAdmin.name.trim(),
        email: newAdmin.email.trim(),
        password: newAdmin.password,
        phone: newAdmin.phone.trim() || undefined,
        secretKey: newAdmin.secretKey.trim() || undefined
      });

      setSuccessMsg(res?.message || 'Admin account created successfully!');
      setNewAdmin({ name: '', email: '', password: '', phone: '', secretKey: '' });
      setShowCreateModal(false);
      fetchAdmins();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create administrator account.');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Settings</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure multi-tenant marketplace policies, payouts, and administrator accounts
          </p>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Administrator Accounts Management Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Accounts</h3>
              <p className="text-xs text-slate-500">
                Staff members with elevated administrator privileges ({admins.length} registered)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAdmins}
              disabled={loadingAdmins}
              title="Refresh Admin List"
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} className={loadingAdmins ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <UserPlus size={14} />
              <span>Create New Admin</span>
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    {loadingAdmins ? 'Loading admin accounts...' : 'No admin accounts loaded. Click "Create New Admin" to add one.'}
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm._id || adm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                        {adm.name ? adm.name.slice(0, 1).toUpperCase() : 'A'}
                      </div>
                      <span>{adm.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{adm.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {adm.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {adm.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* General Settings Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
            <Globe size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Multi-Tenant Boutique Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">Require admin verification before boutique storefront goes live</p>
            <div className="mt-3 flex items-center gap-2">
              <input type="checkbox" defaultChecked id="tenant-verify" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="tenant-verify" className="text-xs font-semibold text-slate-700">Strict Tenant Onboarding Review Enabled</label>
            </div>
          </div>
        </div>

        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Security & Permissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Role-based authentication enforced across all routes with JWT tokens.</p>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Create New Administrator</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password * (Min 6 chars)</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Key (Optional)</label>
                <input
                  type="password"
                  value={newAdmin.secretKey}
                  onChange={(e) => setNewAdmin({ ...newAdmin, secretKey: e.target.value })}
                  placeholder="Optional Admin Secret Key"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">Leave blank if no ADMIN_SECRET_KEY is required by server.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {creatingAdmin ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Admin</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
