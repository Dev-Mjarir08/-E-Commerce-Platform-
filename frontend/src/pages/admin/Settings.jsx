import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Key, Database, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Settings</h2>
        <p className="text-xs text-slate-500 mt-1">Configure multi-tenant marketplace policies, payouts, and administrator permissions</p>
      </div>

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
            <h3 className="text-sm font-bold text-slate-900">Security & Two-Factor Authentication</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enforce hardware or authenticator TOTP for all Super Administrators</p>
            <button type="button" className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800">
              Configure 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
