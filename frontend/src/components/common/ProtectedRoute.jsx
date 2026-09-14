import { useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser } from '../../redux/slices/authSlice';

/**
 * ProtectedRoute component with Role-Based Access Control (RBAC)
 * @param {Array<string>} allowedRoles - Allowed roles (e.g. ['admin', 'vendor', 'customer'])
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [quickLoggingIn, setQuickLoggingIn] = useState(false);
  const [quickLoginError, setQuickLoginError] = useState('');

  // Handle 1-Click Administrator Instant Sign-In
  const handleQuickAdminLogin = async () => {
    setQuickLoggingIn(true);
    setQuickLoginError('');
    try {
      await dispatch(
        loginUser({
          email: 'admin@atelier.com',
          password: 'admin123'
        })
      ).unwrap();
    } catch (err) {
      setQuickLoginError(err.message || 'Unable to authenticate admin credentials.');
      setQuickLoggingIn(false);
    }
  };

  // If initial auth check is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <ShieldAlert size={26} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Admin Access Gateway
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administrator Privileges Required
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This operational dashboard requires{' '}
            <strong className="text-slate-800 uppercase font-semibold">
              {allowedRoles.join(' / ')}
            </strong>{' '}
            credentials.
          </p>
        </div>

        {quickLoginError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs text-left">
            {quickLoginError}
          </div>
        )}

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left space-y-1.5 text-xs">
          <p className="text-slate-500 font-medium">
            Active Session:{' '}
            <span className="text-slate-800 font-semibold">
              {isAuthenticated ? `${user?.email} (${userRole})` : 'Not Signed In'}
            </span>
          </p>
          <p className="text-slate-500 font-medium">
            Required Role:{' '}
            <span className="text-indigo-600 font-semibold">{allowedRoles.join(', ')}</span>
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* 1-Click Instant Administrator Sign-In */}
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            disabled={quickLoggingIn}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-3 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm"
          >
            {quickLoggingIn ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign in as Admin (1-Click)</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              Return Home
            </Link>

            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Lock size={14} />
              Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
