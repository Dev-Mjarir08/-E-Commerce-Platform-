import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Store,
  Shield,
  UserCheck
} from 'lucide-react';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  // Validate form before submission
  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check frontend validation first
    if (!validate()) {
      showToast('Please enter a valid email address and password.', 'warning');
      return;
    }

    try {
      // Dispatch Redux login thunk
      const data = await dispatch(
        loginUser({
          email: formData.email.trim(),
          password: formData.password
        })
      ).unwrap();

      const payload = data?.data || data;
      const user = payload?.user || data?.user || { email: formData.email, name: 'User', role: 'customer' };
      const hasStore = Boolean(payload?.store || data?.store);

      // Determine target destination based on user role
      let targetPath = '/';
      let welcomeMsg = '';

      if (user.role === 'admin') {
        targetPath = '/admin/dashboard';
        welcomeMsg = `Welcome, Administrator ${user.name || ''}. Opening Admin Suite...`;
      } else if (user.role === 'vendor' || user.role === 'seller' || hasStore) {
        // ALWAYS route vendor partners to Vendor Dashboard
        targetPath = (redirectParam && redirectParam.startsWith('/vendor'))
          ? decodeURIComponent(redirectParam)
          : '/vendor/dashboard';
        welcomeMsg = `Welcome, Partner ${user.name || ''}. Opening Vendor Portal...`;
      } else {
        targetPath = (redirectParam && !redirectParam.startsWith('/login'))
          ? decodeURIComponent(redirectParam)
          : '/';
        welcomeMsg = `Welcome back, ${user.name || ''}! Redirecting to boutique...`;
      }

      setSuccessMessage(welcomeMsg);
      showToast(welcomeMsg, 'success');

      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 500);
    } catch (err) {
      // Show user-friendly toast message for invalid password or email
      const errorMsg =
        typeof err === 'string'
          ? err
          : err?.message || 'Invalid email address or password. Please verify your credentials.';
      
      console.warn('Login rejected:', errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Quick fill handler for demo accounts
  const handleQuickFill = async (email, password) => {
    setFormData({ email, password, rememberMe: true });
    setFormErrors({});
    if (error) dispatch(clearError());

    try {
      const data = await dispatch(loginUser({ email, password })).unwrap();
      const payload = data?.data || data;
      const user = payload?.user || data?.user || { email, role: 'customer' };
      const hasStore = Boolean(payload?.store || data?.store);
      let targetPath = '/';

      if (user.role === 'admin') {
        targetPath = '/admin/dashboard';
      } else if (user.role === 'vendor' || user.role === 'seller' || hasStore) {
        targetPath = (redirectParam && redirectParam.startsWith('/vendor'))
          ? decodeURIComponent(redirectParam)
          : '/vendor/dashboard';
      } else {
        targetPath = (redirectParam && !redirectParam.startsWith('/login'))
          ? decodeURIComponent(redirectParam)
          : '/';
      }

      const msg = `Signed in successfully as ${user.name || email}`;
      setSuccessMessage(msg);
      showToast(msg, 'success');

      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 400);
    } catch (err) {
      const errorMsg =
        typeof err === 'string' ? err : err?.message || 'Quick login failed. Please check credentials.';
      showToast(errorMsg, 'error');
    }
  };



  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      {/* Top Header Bar */}
      <header className="border-b border-[#E5E3DF] bg-[#F8F7F4]/90 backdrop-blur-md sticky top-0 z-30 py-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Boutique</span>
          </Link>

          <Link to="/" className="text-center group">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#111111] font-normal leading-none">
              ATELIER
            </h1>
            <span className="block text-[8px] font-mono tracking-[0.35em] text-[#8E877F] uppercase mt-1">
              INDEPENDENT FASHION SAAS
            </span>
          </Link>

          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F] hidden sm:block">
            IN / ₹ INR • CLIENT PORTAL
          </div>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Editorial Visual Panel (Hidden on small mobile, visible on desktop) */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#111111] text-[#FFFFFF] overflow-hidden items-center justify-center p-12">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
              alt="Atelier Luxury Campaign"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Editorial overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/50 to-[#111111]/40" />
          </div>

          {/* Floating Editorial Badge & Quote */}
          <div className="relative z-10 max-w-lg flex flex-col justify-between h-full py-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#FFFFFF]/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#F8F7F4]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MEMBER PRIVILEGE PORTAL</span>
              </div>
              <h2 className="font-serif text-4xl xl:text-5xl font-normal tracking-tight uppercase leading-tight text-[#FFFFFF]">
                Architectural <br />
                <span className="italic font-light text-[#E5E3DF]">Form & Precision.</span>
              </h2>
            </div>

            {/* Member Privileges List */}
            <div className="bg-[#111111]/60 backdrop-blur-md border border-white/10 p-6 space-y-4 my-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] block">
                ATELIER CLIENT PRIVILEGES
              </span>
              <ul className="space-y-2.5 text-xs text-[#E5E3DF] font-sans">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Curated capsule drops from 20+ verified artisan storefronts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Synchronized wishlist and saved bag across all boutique devices</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Priority access to seasonal archives & atelier pre-orders</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
              <span>CURATED DISPATCH</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-10 shadow-lg">
            {/* Top Subtitle & Title */}
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
                CLIENT AUTHENTICATION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight uppercase">
                Sign In
              </h2>
              <p className="text-xs text-[#666666] font-sans mt-2 leading-relaxed">
                Access your personalized atelier account, manage order tracking, and view saved wardrobes.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-sans leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-sans leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ENTER YOUR REGISTERED EMAIL"
                    autoComplete="email"
                    className={`w-full bg-[#FAF9F6] border ${
                      formErrors.email ? 'border-red-500' : 'border-[#E5E3DF]'
                    } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-4 py-3.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
                    Password *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] hover:text-[#111111] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className={`w-full bg-[#FAF9F6] border ${
                      formErrors.password ? 'border-red-500' : 'border-[#E5E3DF]'
                    } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-10 py-3.5 outline-none transition-colors placeholder:text-[#8E877F]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E877F] hover:text-[#111111] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.password}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-[#111111] border-[#E5E3DF] rounded-none focus:ring-0 cursor-pointer accent-[#111111]"
                  />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666]">
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.22em] py-4 px-6 hover:bg-[#2B2B2B] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN TO ATELIER</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-5 border-t border-[#E5E3DF]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>1-CLICK DEMO ACCESS</span>
                </span>
                <span className="text-[9px] font-mono text-[#8E877F]">AUTO-LOGIN</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickFill('vendor@atelier.com', 'vendor123')}
                  className="p-2.5 bg-[#FAF9F6] hover:bg-[#111111] hover:text-white border border-[#E5E3DF] transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[#111111] group-hover:text-white">
                    <Store className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-300" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Vendor</span>
                  </div>
                  <span className="text-[9px] text-[#8E877F] group-hover:text-neutral-300 block truncate">
                    Partner Suite
                  </span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickFill('admin@atelier.com', 'admin123')}
                  className="p-2.5 bg-[#FAF9F6] hover:bg-[#111111] hover:text-white border border-[#E5E3DF] transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[#111111] group-hover:text-white">
                    <Shield className="w-3.5 h-3.5 text-indigo-600 group-hover:text-indigo-300" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Admin</span>
                  </div>
                  <span className="text-[9px] text-[#8E877F] group-hover:text-neutral-300 block truncate">
                    Management
                  </span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickFill('client@atelier.com', 'password123')}
                  className="p-2.5 bg-[#FAF9F6] hover:bg-[#111111] hover:text-white border border-[#E5E3DF] transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[#111111] group-hover:text-white">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Client</span>
                  </div>
                  <span className="text-[9px] text-[#8E877F] group-hover:text-neutral-300 block truncate">
                    Boutique
                  </span>
                </button>
              </div>
            </div>


            {/* Register Switch Link */}
            <div className="mt-8 pt-6 border-t border-[#E5E3DF] text-center space-y-3">
              <p className="text-xs text-[#666666] font-sans">
                Don't have an atelier membership yet?
              </p>
              <Link
                to="/register"
                className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#666666] hover:border-[#666666] transition-colors font-semibold"
              >
                CREATE AN ACCOUNT
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Subtle Footer Note */}
      <footer className="border-t border-[#E5E3DF] py-4 px-4 text-center text-[10px] font-mono uppercase tracking-widest text-[#8E877F] bg-[#FAF9F6]">
        SECURE 256-BIT ENCRYPTION • ATELIER GLOBAL CONCIERGE
      </footer>
    </div>
  );
};

export default Login;
