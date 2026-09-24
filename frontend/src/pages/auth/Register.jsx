import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  Store,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Building2,
  Globe,
  FileText,
  Sparkles
} from 'lucide-react';
import { registerUser, registerVendorUser, clearError } from '../../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'vendor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Store specific details matching Store.js
    storeName: '',
    storeEmail: '',
    storePhone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    storeDescription: '',
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

    // Vendor Specific Validations
    if (accountType === 'vendor') {
      if (!formData.storeName.trim()) {
        errors.storeName = 'Store / Atelier name is required';
      }
      if (formData.storeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.storeEmail.trim())) {
        errors.storeEmail = 'Please enter a valid store email address';
      }
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
      if (accountType === 'customer') {
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
            storeEmail: formData.storeEmail.trim() || formData.email.trim(),
            storePhone: formData.storePhone.trim() || formData.phone.trim() || undefined,
            storeDescription: formData.storeDescription.trim() || undefined,
            storeAddress: {
              street: formData.street.trim(),
              city: formData.city.trim(),
              state: formData.state.trim(),
              postalCode: formData.postalCode.trim(),
              country: formData.country.trim()
            }
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
        <section className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-[#111111] text-[#FFFFFF] overflow-hidden items-center justify-center p-12">
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
                {accountType === 'vendor' ? 'PARTNER STORE PRIVILEGES' : 'WHY CREATE AN ACCOUNT?'}
              </span>
              <ul className="space-y-2.5 text-xs text-[#E5E3DF] font-sans">
                {accountType === 'vendor' ? (
                  <>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                      <span>Dedicated brand storefront with bespoke styling and lookbooks</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                      <span>Direct inventory, variant, and multi-currency order management</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                      <span>Curated global distribution to verified luxury fashion connoisseurs</span>
                    </li>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </ul>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
              <span>AUTHENTICATED NETWORK</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-xl xl:max-w-2xl bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-10 shadow-lg">
            {/* Top Subtitle & Title */}
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
                COLLECTIVE MEMBERSHIP
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight uppercase">
                Create Account
              </h2>
              <p className="text-xs text-[#666666] font-sans mt-2 leading-relaxed">
                {accountType === 'vendor'
                  ? 'Establish your independent fashion atelier storefront and access our luxury client network.'
                  : 'Join our collective as a client to experience bespoke fashion curation and seamless ordering.'}
              </p>
            </div>

            {/* Account Type Tabs - Client & Vendor Only */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF9F6] border border-[#E5E3DF] mb-6">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`py-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 ${
                  accountType === 'customer'
                    ? 'bg-[#111111] text-[#F8F7F4] shadow-xs font-semibold'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client (Customer)</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('vendor')}
                className={`py-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 ${
                  accountType === 'vendor'
                    ? 'bg-[#111111] text-[#F8F7F4] shadow-xs font-semibold'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor (Atelier)</span>
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-sans leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-sans leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: MASTER ACCOUNT CREDENTIALS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E3DF]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                    01 / ACCOUNT CREDENTIALS
                  </span>
                </div>

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
                      Account Email Address *
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
                        } focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-3.5 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                      Contact Phone (Optional)
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
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-3.5 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ATELIER STOREFRONT & STUDIO DETAILS (Vendor Only) */}
              {accountType === 'vendor' && (
                <div className="p-4 sm:p-5 bg-[#FAF9F6] border border-[#E5E3DF] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DF]">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#111111]" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                        02 / ATELIER STOREFRONT DETAILS
                      </span>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8E877F]">
                      STORE SCHEMA
                    </span>
                  </div>

                  {/* Store / Atelier Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                      Store / Brand Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                        <Store className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="E.G. MAISON KHAADI"
                        className={`w-full bg-[#FFFFFF] border ${
                          formErrors.storeName ? 'border-red-500' : 'border-[#E5E3DF]'
                        } focus:border-[#111111] text-xs font-sans text-[#111111] pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                      />
                    </div>
                    {formErrors.storeName && (
                      <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.storeName}</p>
                    )}
                  </div>

                  {/* Store Business Email & Support Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                        Store Business Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="storeEmail"
                          value={formData.storeEmail}
                          onChange={handleChange}
                          placeholder="ORDERS@BRAND.COM"
                          className={`w-full bg-[#FFFFFF] border ${
                            formErrors.storeEmail ? 'border-red-500' : 'border-[#E5E3DF]'
                          } focus:border-[#111111] text-xs font-sans text-[#111111] pl-10 pr-3.5 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase`}
                        />
                      </div>
                      {formErrors.storeEmail && (
                        <p className="mt-1 text-[11px] text-red-600 font-sans">{formErrors.storeEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5">
                        Store Support Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          name="storePhone"
                          value={formData.storePhone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] pl-10 pr-3.5 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Address Section */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8E877F]">
                      <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Studio & Dispatch Address</span>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="E.G. 14 ARCHITECTURAL ROW, SUITE 302"
                        className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                      />
                    </div>

                    {/* City & State Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                          City
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E877F]">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="MUMBAI"
                            className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] pl-9 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                          State / Region
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="MAHARASHTRA"
                          className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                        />
                      </div>
                    </div>

                    {/* Postal Code & Country Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="400001"
                          className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                          Country
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E877F]">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="INDIA"
                            className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] pl-9 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Description / Philosophy */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
                        Brand Philosophy / Description
                      </label>
                      <span className="text-[9px] font-mono text-[#8E877F]">
                        {formData.storeDescription.length}/1000
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        name="storeDescription"
                        rows={2}
                        maxLength={1000}
                        value={formData.storeDescription}
                        onChange={handleChange}
                        placeholder="Brief summary of tailoring heritage, artisanal fabrics, or design aesthetic."
                        className="w-full bg-[#FFFFFF] border border-[#E5E3DF] focus:border-[#111111] text-xs font-sans text-[#111111] p-3 outline-none transition-colors placeholder:text-[#8E877F] leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: SECURITY PASSPHRASE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5E3DF]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                    {accountType === 'vendor' ? '03 / SECURITY PASSPHRASE' : '02 / SECURITY PASSPHRASE'}
                  </span>
                </div>

                {/* Password & Confirm Password Grid */}
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
                        placeholder="MIN 6 CHARACTERS"
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
                className="w-full bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.22em] py-4 px-6 hover:bg-[#2B2B2B] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm mt-4 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {accountType === 'vendor'
                        ? 'ESTABLISH ATELIER STOREFRONT'
                        : 'REGISTER CLIENT MEMBERSHIP'}
                    </span>
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
