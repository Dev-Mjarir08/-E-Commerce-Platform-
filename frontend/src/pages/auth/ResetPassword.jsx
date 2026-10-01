import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import authApi from '../../services/authApi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';
  const tokenParam = queryParams.get('token') || '';
  const devOtpParam = queryParams.get('devOtp') || '';

  // Form State
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(() => (devOtpParam && devOtpParam.length === 6 ? devOtpParam.split('') : ['', '', '', '', '', '']));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devOtpHint, setDevOtpHint] = useState(devOtpParam);

  // Input references for 6 OTP boxes
  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Focus appropriate OTP input box
  useEffect(() => {
    if (devOtpParam && devOtpParam.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [devOtpParam]);

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character typed
    newOtp[index] = value ? value.slice(-1) : '';
    setOtp(newOtp);
    if (formError) setFormError('');

    // Auto-focus next input box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting 6-digit OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      if (formError) setFormError('');
    }
  };

  // Quick fill dev OTP
  const handleUseDevOtp = () => {
    if (devOtpHint && devOtpHint.length === 6) {
      setOtp(devOtpHint.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0 || !email.trim()) return;

    setResending(true);
    setFormError('');
    try {
      const res = await authApi.forgotPassword(email.trim());
      const payload = res.data || res;
      setResendTimer(60);
      if (payload.devOtp) {
        setDevOtpHint(payload.devOtp);
      }
      setSuccessMessage('A fresh verification code has been dispatched to your email.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: 'None', color: 'bg-neutral-300' };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 8) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[A-Z]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength();

  // Validate form
  const validateForm = () => {
    if (!tokenParam) {
      if (!email.trim()) {
        setFormError('Email address is required.');
        return false;
      }
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        setFormError('Please enter the complete 6-digit verification code.');
        return false;
      }
    }

    if (!newPassword) {
      setFormError('New password is required.');
      return false;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return false;
    }

    setFormError('');
    return true;
  };

  // Submit Password Reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFormError('');

    try {
      const otpCode = otp.join('');
      await authApi.resetPassword({
        email: email.trim(),
        otp: otpCode,
        token: tokenParam,
        newPassword
      });

      setIsOtpVerified(true);
      setSuccessMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Password reset failed. Please verify your OTP code.';
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      {/* Top Header Bar */}
      <header className="border-b border-[#E5E3DF] bg-[#F8F7F4]/90 backdrop-blur-md sticky top-0 z-30 py-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Change Email</span>
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
            AUTHENTICATION • OTP VERIFY
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
                <span>2-STEP CODE CIPHER</span>
              </div>
              <h2 className="font-serif text-4xl xl:text-5xl font-normal tracking-tight uppercase leading-tight text-[#FFFFFF]">
                Precision & <br />
                <span className="italic font-light text-[#E5E3DF]">Security Redefined.</span>
              </h2>
            </div>

            {/* Privileges Note */}
            <div className="bg-[#111111]/60 backdrop-blur-md border border-white/10 p-6 space-y-4 my-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] block">
                ONE-TIME VERIFICATION CODE
              </span>
              <p className="text-xs text-[#E5E3DF] leading-relaxed font-sans font-light">
                Please enter the 6-digit code delivered to your registered inbox to securely unlock and update your member passphrase.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#8E877F]">
                <span>HIGH PRIVACY PROTOCOL</span>
                <span>• NO DISCLOSURE</span>
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
            {/* Header */}
            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-[#111111]/5 border border-[#111111]/10 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-3">
                <KeyRound className="w-3 h-3 text-[#111111]" />
                <span>SECURE RESET</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-[#111111] font-normal">
                Verify & Reset
              </h2>
              <p className="mt-2 text-xs text-[#666666] font-sans leading-relaxed">
                {email ? (
                  <>
                    Verification code sent to{' '}
                    <span className="font-mono text-[#111111] font-semibold">{email}</span>.
                  </>
                ) : (
                  'Enter your 6-digit verification code and set your new password.'
                )}
              </p>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-sans leading-relaxed">{formError}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-sans leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Dev Mode Simulation Assistant */}
            {devOtpHint && !isOtpVerified && (
              <div className="mb-6 bg-amber-50 border border-amber-200/80 p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-900">
                    DEV OTP: <strong className="font-mono tracking-[0.2em] text-sm text-[#111111]">{devOtpHint}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUseDevOtp}
                  className="text-[10px] font-mono uppercase tracking-wider bg-amber-200/60 hover:bg-amber-200 text-amber-950 px-2.5 py-1 transition-colors border border-amber-300"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {isOtpVerified ? (
              /* Success Celebration View */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
                    Passphrase Updated
                  </h3>
                  <p className="text-xs text-[#666666] font-sans">
                    Your Atelier account has been authenticated and secured with your new password.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.22em] py-4 px-6 hover:bg-[#2B2B2B] transition-colors"
                >
                  <span>PROCEED TO SIGN IN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              /* Reset Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email address field if not prefilled */}
                {!emailParam && !tokenParam && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-2">
                      Account Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER REGISTERED EMAIL"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] px-4 py-3 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                    />
                  </div>
                )}

                {/* 6-Digit OTP Boxes (Only if not using URL token) */}
                {!tokenParam && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
                        6-Digit Verification Code *
                      </label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || resending}
                        className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors ${
                          resendTimer > 0
                            ? 'text-[#8E877F] cursor-not-allowed'
                            : 'text-[#111111] hover:underline cursor-pointer'
                        }`}
                      >
                        <RotateCcw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                        <span>
                          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-semibold text-[#111111] bg-[#FAF9F6] border ${
                            digit ? 'border-[#111111] bg-[#FFFFFF]' : 'border-[#E5E3DF]'
                          } focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* New Password Field */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-2">
                    New Passphrase *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="ENTER NEW PASSWORD"
                      autoComplete="new-password"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-10 py-3.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
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

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#8E877F]">
                        <span>SECURITY STRENGTH: {strength.label}</span>
                        <span>{newPassword.length} CHARACTERS</span>
                      </div>
                      <div className="h-1 w-full bg-[#E5E3DF] overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${strength.score >= 4 ? strength.color : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-2">
                    Confirm New Passphrase *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E877F]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="REPEAT NEW PASSWORD"
                      autoComplete="new-password"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DF] focus:border-[#111111] focus:bg-[#FFFFFF] text-xs font-sans text-[#111111] pl-10 pr-10 py-3.5 outline-none transition-colors placeholder:text-[#8E877F] placeholder:font-mono placeholder:text-[10px] placeholder:tracking-wider placeholder:uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E877F] hover:text-[#111111] transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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
                      <span>RESET & SECURE ACCOUNT</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="mt-8 pt-6 border-t border-[#E5E3DF] text-center space-y-3">
              <p className="text-xs text-[#666666] font-sans">
                Never mind, I remember my passphrase.
              </p>
              <Link
                to="/login"
                className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#666666] hover:border-[#666666] transition-colors font-semibold"
              >
                RETURN TO SIGN IN
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

export default ResetPassword;
