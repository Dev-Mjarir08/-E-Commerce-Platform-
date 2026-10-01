import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import authApi from '../../services/authApi';
import { useToast } from '../../context/ToastContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const validate = () => {
    if (!email.trim()) {
      setFormError('Email address is required.');
      showToast('Please enter your account email address.', 'warning');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFormError('');
    setSuccessData(null);

    try {
      const res = await authApi.forgotPassword(email.trim());
      const payload = res.data || res;
      const msg = payload.message || 'If an account exists with this email, a verification code has been dispatched.';
      setSuccessData({
        message: msg,
        devOtp: payload.devOtp || null,
        devToken: payload.devResetToken || null
      });
      showToast(msg, 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unable to process request. Please try again.';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToOtp = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email.trim())}${successData?.devOtp ? `&devOtp=${successData.devOtp}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      {/* Top Header Bar */}
      <header className="border-b border-[#E5E3DF] bg-[#F8F7F4]/90 backdrop-blur-md sticky top-0 z-30 py-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Sign In</span>
          </Link>

          <Link to="/" className="text-center group">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#111111] font-normal leading-none">
              OMNIKART
            </h1>
            <span className="block text-[8px] font-mono tracking-[0.35em] text-[#8E877F] uppercase mt-1">
              MULTI-VENDOR MARKETPLACE
            </span>
          </Link>

          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F] hidden sm:block">
            AUTHENTICATION • RECOVERY
          </div>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Editorial Visual Panel */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#111111] text-[#FFFFFF] overflow-hidden items-center justify-center p-12">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
              alt="Atelier Recovery Campaign"
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
                <span>OMNIKART SECURITY RECOVERY</span>
              </div>
              <h2 className="font-serif text-4xl xl:text-5xl font-normal tracking-tight uppercase leading-tight text-[#FFFFFF]">
                Protected & <br />
                <span className="italic font-light text-[#E5E3DF]">Enduring Heritage.</span>
              </h2>
            </div>

            {/* Privileges Note */}
            <div className="bg-[#111111]/60 backdrop-blur-md border border-white/10 p-6 space-y-4 my-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] block">
                OMNIKART SECURITY PROTOCOL
              </span>
              <p className="text-xs text-[#E5E3DF] leading-relaxed font-sans font-light">
                Your credentials and personalized curation preferences are encrypted using SHA-256 luxury standard cipher security.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#8E877F]">
                <span>2-STEP CODE AUTHENTICATION</span>
                <span>• 15 MIN VALIDITY</span>
              </div>
            </div>

            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F]">
              PARIS • MILAN • TOKYO • NEW YORK
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md">
            {/* Header / Intro */}
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-[#111111]/5 border border-[#111111]/10 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-3">
                <KeyRound className="w-3 h-3 text-[#111111]" />
                <span>ACCOUNT RECOVERY</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-[#111111] font-normal">
                Forgot Password
              </h2>
              <p className="mt-2 text-xs text-[#666666] font-sans leading-relaxed">
                Enter the email address registered with your Atelier account. We will send you a 6-digit verification OTP code to regain access.
              </p>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-sans leading-relaxed">{formError}</span>
              </div>
            )}

            {/* Success Notification */}
            {successData ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 text-xs space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div className="space-y-1">
                      <p className="font-medium text-[11px] font-mono uppercase tracking-wider text-emerald-800">
                        VERIFICATION CODE DISPATCHED
                      </p>
                      <p className="font-sans leading-relaxed text-emerald-700">
                        {successData.message}
                      </p>
                    </div>
                  </div>

                  {/* Dev Mode Code Helper */}
                  {successData.devOtp && (
                    <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between bg-emerald-100/50 p-2.5 rounded-sm">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-900">
                        DEV OTP: <span className="font-bold text-sm tracking-[0.2em] text-[#111111] ml-1">{successData.devOtp}</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-700 uppercase tracking-widest">
                        (Testing Helper)
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Proceed Action */}
                <button
                  type="button"
                  onClick={handleProceedToOtp}
                  className="w-full bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.22em] py-4 px-6 hover:bg-[#2B2B2B] transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm"
                >
                  <span>ENTER 6-DIGIT OTP & RESET</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSuccessData(null)}
                    className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F] hover:text-[#111111] transition-colors border-b border-transparent hover:border-[#111111] pb-0.5"
                  >
                    Didn't receive email? Re-enter address
                  </button>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-2">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="ENTER YOUR REGISTERED EMAIL"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-4 py-3.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                    />
                  </div>
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
                      <span>SEND VERIFICATION CODE</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Footer Switch */}
            <div className="mt-8 pt-6 border-t border-[#E5E3DF] text-center space-y-3">
              <p className="text-xs text-[#666666] font-sans">
                Remember your password?
              </p>
              <Link
                to="/login"
                className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#666666] hover:border-[#666666] transition-colors font-semibold"
              >
                SIGN IN TO ATELIER
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Subtle Footer Note */}
      <footer className="border-t border-[#E5E3DF] py-4 px-4 text-center text-[10px] font-mono uppercase tracking-widest text-[#8E877F] bg-[#FAF9F6]">
        SECURE 256-BIT ENCRYPTION • OMNIKART GLOBAL SUPPORT
      </footer>
    </div>
  );
};

export default ForgotPassword;
