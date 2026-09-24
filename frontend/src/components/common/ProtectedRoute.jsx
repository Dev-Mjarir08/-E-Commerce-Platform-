import { useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight, ShieldCheck, Store, Sparkles, Loader2 } from 'lucide-react';
import { loginUser } from '../../redux/slices/authSlice';

/**
 * ProtectedRoute component with Role-Based Access Control (RBAC)
 * @param {Array<string>} allowedRoles - Allowed roles (e.g. ['admin', 'vendor', 'customer'])
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  // Determine if this is a vendor portal route
  const isVendorRoute = allowedRoles.includes('vendor') || allowedRoles.includes('seller') || location.pathname.startsWith('/vendor');

  // Handle 1-Click Demo Login
  const handleDemoLogin = async (roleType) => {
    setDemoLoading(true);
    setDemoError('');
    try {
      if (roleType === 'vendor') {
        await dispatch(loginUser({ email: 'vendor@atelier.com', password: 'vendor123' })).unwrap();
      } else {
        await dispatch(loginUser({ email: 'admin@atelier.com', password: 'admin123' })).unwrap();
      }
    } catch (err) {
      setDemoError(typeof err === 'string' ? err : 'Demo authentication failed. Please check credentials.');
    } finally {
      setDemoLoading(false);
    }
  };

  // If initial auth check is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-[#111111]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  // Check role authorization
  const userRole = user?.role;
  const isAuthorized = isAuthenticated && user && (allowedRoles.length === 0 || allowedRoles.includes(userRole));

  // If authorized, render child routes
  if (isAuthorized) {
    return <Outlet />;
  }

  // If not authorized or not logged in, show access gateway
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-10 shadow-lg text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF9F6] border border-[#E5E3DF] flex items-center justify-center text-[#111111]">
          {isVendorRoute ? <Store size={26} /> : <ShieldAlert size={26} />}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#8E877F]">
            {isVendorRoute ? 'Vendor Portal Authentication' : 'Admin Access Gateway'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] tracking-tight uppercase">
            {isVendorRoute ? 'Vendor Partner Access Required' : 'Privileges Required'}
          </h2>
          <p className="text-xs text-[#666666] leading-relaxed">
            This operational dashboard requires{' '}
            <strong className="text-[#111111] uppercase font-semibold">
              {allowedRoles.join(' / ') || 'authorized'}
            </strong>{' '}
            credentials.
          </p>
        </div>

        {demoError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs text-left">
            {demoError}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Quick Demo Access Button */}
          {isVendorRoute ? (
            <button
              type="button"
              onClick={() => handleDemoLogin('vendor')}
              disabled={demoLoading}
              className="w-full bg-[#111111] hover:bg-[#2B2B2B] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.2em] py-3.5 px-5 transition-all flex items-center justify-center gap-2 group shadow-sm disabled:opacity-60"
            >
              {demoLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={15} className="text-amber-300" />
                  <span>1-Click Demo Vendor Login</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={demoLoading}
              className="w-full bg-[#111111] hover:bg-[#2B2B2B] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.2em] py-3.5 px-5 transition-all flex items-center justify-center gap-2 group shadow-sm disabled:opacity-60"
            >
              {demoLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={15} className="text-amber-300" />
                  <span>1-Click Demo Admin Login</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}

          {/* Standard Sign In Link */}
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
            className="w-full bg-[#FAF9F6] hover:bg-[#F0EEEB] text-[#111111] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider py-3 px-5 transition-colors flex items-center justify-center gap-2"
          >
            <Lock size={14} />
            <span>Sign In with Custom Account</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-[#E5E3DF] hover:bg-[#FAF9F6] text-[#666666] text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={13} />
              Return Home
            </Link>

            <Link
              to="/register"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-[#E5E3DF] hover:bg-[#FAF9F6] text-[#666666] text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <ShieldCheck size={13} />
              Create Account
            </Link>
          </div>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DF] text-left text-[11px] font-mono text-[#666666] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider">
            Development Credentials:
          </div>
          <div>Vendor: <span className="text-[#111111] font-semibold">vendor@atelier.com</span> / <span className="text-[#111111] font-semibold">vendor123</span></div>
          <div>Admin: <span className="text-[#111111] font-semibold">admin@atelier.com</span> / <span className="text-[#111111] font-semibold">admin123</span></div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
