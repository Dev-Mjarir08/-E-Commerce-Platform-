import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component with Role-Based Access Control (RBAC)
 * Handles clean session authentication and role validation.
 * @param {Array<string>} allowedRoles - Allowed roles (e.g. ['admin', 'vendor', 'customer'])
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Check if a saved token exists in storage
  const hasSavedToken = Boolean(localStorage.getItem('atelier_token'));

  // If initial auth check is resolving or token exists while user profile is being fetched
  if (loading || (hasSavedToken && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-[#111111]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated and no token, redirect directly to standard login page
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Normalize user role and allowed roles
  const userRole = (user?.role || '').toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  // Check if user is vendor/seller or admin
  const isVendorOrSeller = userRole === 'vendor' || userRole === 'seller';
  const isAdmin = userRole === 'admin';

  // Role validation:
  // 1. If no specific roles required, allow access
  // 2. Direct role match
  // 3. Admin has access to all operational suites
  // 4. 'seller' and 'vendor' are treated interchangeably
  const isAuthorized =
    normalizedAllowedRoles.length === 0 ||
    normalizedAllowedRoles.includes(userRole) ||
    isAdmin ||
    (isVendorOrSeller && (normalizedAllowedRoles.includes('vendor') || normalizedAllowedRoles.includes('seller')));

  // If authorized, render child routes
  if (isAuthorized) {
    return <Outlet />;
  }

  // If logged in but unauthorized (e.g. customer attempting /admin or /vendor), redirect home
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
