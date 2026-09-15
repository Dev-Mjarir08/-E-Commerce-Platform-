import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Lock, Mail, User, Phone, Store, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser, registerVendorUser, registerAdminUser, clearError } from '../../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'vendor' | 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    secretKey: '',
    agreeTerms: true
  });


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
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
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (accountType === 'vendor' && !formData.storeName.trim()) {
      errors.storeName = 'Store/Atelier name is required';
    }
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (accountType === 'admin') {
        await dispatch(
          registerAdminUser({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim() || undefined,
            secretKey: formData.secretKey?.trim() || undefined
          })
        ).unwrap();

        setSuccessMessage('Administrator account created! Directing to Admin Suite...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
        return;
      } else if (accountType === 'customer') {
        await dispatch(
          registerUser({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim() || undefined
          })
        ).unwrap();
      } else {
        await dispatch(
          registerVendorUser({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim() || undefined,
            storeName: formData.storeName.trim(),
            storeDescription: formData.storeDescription.trim() || undefined
          })
        ).unwrap();
      }

      setSuccessMessage('Registration successful! Directing to boutique...');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      console.warn('Registration failed:', err);
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
            IN / ₹ INR • MEMBERSHIP REGISTER
          </div>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Visual Editorial Panel */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#111111] text-[#FFFFFF] overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
              alt="Atelier Membership Collective"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/50 to-[#111111]/40" />
          </div>

          <div className="relative z-10 max-w-lg flex flex-col justify-between h-full py-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#FFFFFF]/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#F8F7F4]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ATELIER MEMBERSHIP COLLECTIVE</span>
              </div>
              <h2 className="font-serif text-4xl xl:text-5xl font-normal tracking-tight uppercase leading-tight text-[#FFFFFF]">
                Join the <br />
                <span className="italic font-light text-[#E5E3DF]">Design Vanguard.</span>
              </h2>
            </div>

            <div className="bg-[#111111]/60 backdrop-blur-md border border-white/10 p-6 space-y-4 my-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] block">
                WHY CREATE AN ACCOUNT?
              </span>
              <ul className="space-y-2.5 text-xs text-[#E5E3DF] font-sans">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Personalized client wardrobe and bespoke styling consultations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Unified checkouts across multiple independent storefronts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                  <span>Early access notifications for private sales and limited runs</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
              <span>AUTHENTICATED NETWORK</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-10 shadow-lg">
            {/* Top Subtitle & Title */}
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
                COLLECTIVE MEMBERSHIP
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight uppercase">
                Create Account
              </h2>
              <p className="text-xs text-[#666666] font-sans mt-2 leading-relaxed">
                Join our collective as an atelier client or register your independent fashion brand storefront.
              </p>
            </div>

            {/* Account Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAF9F6] border border-[#E5E3DF] mb-6">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'customer'
                    ? 'bg-[#111111] text-[#F8F7F4] shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('vendor')}
                className={`py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'vendor'
                    ? 'bg-[#111111] text-[#F8F7F4] shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('admin')}
                className={`py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'admin'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.G. JULIAN DELACROIX"
                    autoComplete="name"
                    className={`w-full bg-[#FAF9F6] border ${
                      formErrors.name ? 'border-red-500' : 'border-[#E5E3DF]'
                    } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.name}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
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
                      placeholder="NAME@DOMAIN.COM"
                      autoComplete="email"
                      className={`w-full bg-[#FAF9F6] border ${
                        formErrors.email ? 'border-red-500' : 'border-[#E5E3DF]'
                      } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-3 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-3 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider"
                    />
                  </div>
                </div>
              </div>

              {/* Vendor Specific Store Fields */}
              {accountType === 'vendor' && (
                <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DF] space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Store className="w-3.5 h-3.5 text-[#111111]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111]">
                      ATELIER STOREFRONT DETAILS
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                      Store / Brand Name *
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="E.G. MAISON KHAADI"
                      className={`w-full bg-[#FFFFFF] border ${
                        formErrors.storeName ? 'border-red-500' : 'border-[#E5E3DF]'
                      } focus:border-[#111111] text-xs font-sans text-[#111111] px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                    />
                    {formErrors.storeName && (
                      <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.storeName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                      Brand Philosophy / Description
                    </label>
                    <textarea
                      name="storeDescription"
                      rows={2}
                      value={formData.storeDescription}
                      onChange={handleChange}
                      placeholder="Brief summary of tailoring heritage, fabrics, or aesthetic."
                      className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] px-3.5 py-2 outline-none transition-colors placeholder:text-[#8E877F] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Admin Specific Notice & Optional Key */}
              {accountType === 'admin' && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-950 font-bold">
                      Platform Administrator Role
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-900 leading-relaxed font-sans">
                    Creating an Administrator account grants full access to marketplace analytics, vendor approvals, product management, and platform configurations.
                  </p>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-900 mb-1">
                      Admin Passkey / Secret Key (Optional)
                    </label>
                    <input
                      type="password"
                      name="secretKey"
                      value={formData.secretKey || ''}
                      onChange={handleChange}
                      placeholder="OPTIONAL ADMIN SECRET KEY"
                      className="w-full bg-[#FFFFFF] border border-indigo-200 focus:border-indigo-600 text-xs font-sans text-[#111111] px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400 placeholder:font-mono placeholder:text-[10px]"
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="MIN 6 CHARS"
                      autoComplete="new-password"
                      className={`w-full bg-[#FAF9F6] border ${
                        formErrors.password ? 'border-red-500' : 'border-[#E5E3DF]'
                      } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-9 py-3 outline-none transition-colors placeholder:text-[#8E877F]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E877F] hover:text-[#111111] transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="RE-ENTER PASSWORD"
                      autoComplete="new-password"
                      className={`w-full bg-[#FAF9F6] border ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-[#E5E3DF]'
                      } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-9 py-3 outline-none transition-colors placeholder:text-[#8E877F]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E877F] hover:text-[#111111] transition-colors"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-[#111111] border-[#E5E3DF] rounded-none focus:ring-0 cursor-pointer accent-[#111111] mt-0.5"
                  />
                  <span className="text-[11px] text-[#666666] font-sans leading-relaxed">
                    I agree to the Atelier{' '}
                    <span className="text-[#111111] underline">Terms of Privilege</span> &{' '}
                    <span className="text-[#111111] underline">Privacy Policy</span>.
                  </span>
                </label>
                {formErrors.agreeTerms && (
                  <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.22em] py-4 px-6 hover:bg-[#2B2B2B] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm mt-4"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>REGISTER MEMBERSHIP</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Login Switch Link */}
            <div className="mt-8 pt-6 border-t border-[#E5E3DF] text-center space-y-3">
              <p className="text-xs text-[#666666] font-sans">
                Already registered with Atelier?
              </p>
              <Link
                to="/login"
                className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#666666] hover:border-[#666666] transition-colors font-semibold"
              >
                SIGN IN TO YOUR ACCOUNT
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E3DF] py-4 px-4 text-center text-[10px] font-mono uppercase tracking-widest text-[#8E877F] bg-[#FAF9F6]">
        SECURE 256-BIT ENCRYPTION • ATELIER GLOBAL CONCIERGE
      </footer>
    </div>
  );
};

export default Register;
