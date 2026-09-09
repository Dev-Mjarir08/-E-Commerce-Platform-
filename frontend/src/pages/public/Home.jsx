import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span>Multi-Tenant E-Commerce Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          M4M Luxury Marketplace
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Multi-tenant fashion and lifestyle commerce platform with dedicated boutique storefronts, catalogue taxonomy, and enterprise admin operations.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg transition-colors"
          >
            <LayoutDashboard size={18} />
            <span>Open Admin Dashboard</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/store/urban-fashion"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold transition-colors"
          >
            <Store size={18} />
            <span>View Demo Storefront</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="block text-2xl font-black text-white">28+</span>
            <span className="text-xs text-slate-500">Curated Styles</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-white">4</span>
            <span className="text-xs text-slate-500">Tenant Boutiques</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-white">6</span>
            <span className="text-xs text-slate-500">Editorial Taxonomies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
