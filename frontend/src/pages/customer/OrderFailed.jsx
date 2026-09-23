import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  CreditCard,
  HelpCircle,
  Mail,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

// Default clean sample error data if no live context or location state exists
const DEFAULT_SAMPLE_FAILURE = {
  orderId: "ATL-ERR-98421",
  attemptedAt: new Date().toISOString(),
  paymentMethod: "Credit / Debit Card",
  attemptedAmount: 11250,
  failureReason: "Transaction declined by payment gateway or issuing bank.",
  errorCode: "PAYMENT_DECLINED_BANK",
};

export const OrderFailed = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [copiedCode, setCopiedCode] = useState(false);

  const failureData = useMemo(() => {
    // 1. Try to load from location state passed during checkout failure
    if (location.state?.failure || location.state?.error) {
      const stateObj = location.state.failure || location.state.error;
      return {
        orderId:
          stateObj.orderId ||
          stateObj.orderNumber ||
          DEFAULT_SAMPLE_FAILURE.orderId,
        attemptedAt: stateObj.timestamp || new Date().toISOString(),
        paymentMethod:
          stateObj.paymentMethod || DEFAULT_SAMPLE_FAILURE.paymentMethod,
        attemptedAmount:
          stateObj.totalPrice ||
          stateObj.amount ||
          DEFAULT_SAMPLE_FAILURE.attemptedAmount,
        failureReason:
          stateObj.message ||
          stateObj.reason ||
          DEFAULT_SAMPLE_FAILURE.failureReason,
        errorCode: stateObj.errorCode || "PAYMENT_FAILED",
      };
    }

    // 2. Try to load from URL search parameters (e.g. ?orderId=...&reason=...)
    const paramOrderId = searchParams.get("orderId") || searchParams.get("id");
    const paramReason = searchParams.get("reason") || searchParams.get("error");
    const paramAmount = searchParams.get("amount");

    if (paramOrderId || paramReason) {
      return {
        orderId: paramOrderId || DEFAULT_SAMPLE_FAILURE.orderId,
        attemptedAt: new Date().toISOString(),
        paymentMethod: DEFAULT_SAMPLE_FAILURE.paymentMethod,
        attemptedAmount: paramAmount
          ? parseFloat(paramAmount)
          : DEFAULT_SAMPLE_FAILURE.attemptedAmount,
        failureReason: paramReason || DEFAULT_SAMPLE_FAILURE.failureReason,
        errorCode: "GATEWAY_ERROR",
      };
    }

    // 3. Fallback to sample failure structure
    return DEFAULT_SAMPLE_FAILURE;
  }, [location.state, searchParams]);

  // Copy error code helper
  const handleCopyErrorCode = () => {
    if (!failureData?.orderId) return;
    navigator.clipboard.writeText(failureData.orderId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#111111] selection:text-m4m-bg">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Stepper Progress Bar showing Unsuccessful Status */}
        <div className="border-b border-m4m-border pb-6">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 border border-m4m-border bg-m4m-card text-[#111111] flex items-center justify-center gap-1.5">
              <span className="truncate">1. BAG</span>
            </div>
            <div className="p-2 border border-m4m-border bg-m4m-card text-[#111111] flex items-center justify-center gap-1.5">
              <span className="truncate">2. CHECKOUT</span>
            </div>
            <div className="p-2 border border-rose-300 bg-rose-50/60 text-rose-900 flex items-center justify-center gap-1.5 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span className="truncate">3. PAYMENT</span>
            </div>
            <div className="p-2 border border-rose-300 bg-rose-500 text-white flex items-center justify-center gap-1.5 font-bold">
              <span>UNSUCCESSFUL</span>
            </div>
          </div>
        </div>

        {/* 1. FAILURE STATE HERO HEADER */}
        <div className="bg-m4m-card border border-m4m-border p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
          {/* Subtle rose top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600" />

          {/* Error / Failure Icon Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-xs">
              <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600 stroke-[1.75]" />
            </div>
          </div>

          {/* Heading & Explanation */}
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-800 font-semibold block">
              TRANSACTION ATTEMPT UNFULFILLED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Order Could Not Be Placed
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
              We were unable to complete your transaction or authorize payment
              with your financial provider. No funds have been permanently
              debited from your account.
            </p>
          </div>

          {/* Error Reference Code Badge */}
          <div className="mt-6 pt-6 border-t border-m4m-border flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="bg-rose-50/70 border border-rose-200 px-4 py-2 flex items-center gap-2 text-rose-900">
              <span className="text-rose-800 uppercase tracking-wider text-[10px]">
                Attempt Ref:
              </span>
              <strong className="font-semibold">{failureData.orderId}</strong>
              <button
                type="button"
                onClick={handleCopyErrorCode}
                title="Copy Attempt Reference"
                className="ml-1 text-rose-700 hover:text-rose-950 transition-colors p-0.5"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="bg-m4m-bg border border-m4m-border px-4 py-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-m4m-accent" />
              <span className="text-m4m-accent uppercase tracking-wider text-[10px]">
                Time:
              </span>
              <span className="text-[#111111]">
                {formatDate(failureData.attemptedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. PAYMENT / TRANSACTION DETAILS BREAKDOWN */}
        <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
            <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
              Transaction Details & Reason
            </h2>
            <span className="text-[10px] font-mono text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 uppercase tracking-widest font-semibold">
              FAILED ATTEMPT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 bg-m4m-bg border border-m4m-border space-y-1">
              <span className="text-[10px] text-m4m-accent uppercase tracking-wider block">
                Payment Method
              </span>
              <p className="font-semibold text-[#111111] uppercase flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#111111]" />
                <span>{failureData.paymentMethod}</span>
              </p>
            </div>

            <div className="p-4 bg-m4m-bg border border-m4m-border space-y-1">
              <span className="text-[10px] text-m4m-accent uppercase tracking-wider block">
                Attempted Amount
              </span>
              <p className="font-semibold text-[#111111] text-sm">
                ₹{failureData.attemptedAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="p-4 bg-m4m-bg border border-m4m-border space-y-1">
              <span className="text-[10px] text-m4m-accent uppercase tracking-wider block">
                Status Code
              </span>
              <p className="font-semibold text-rose-800 uppercase">
                {failureData.errorCode}
              </p>
            </div>
          </div>

          {/* Specific Failure Reason Message */}
          <div className="p-4 bg-rose-50/60 border border-rose-200 flex items-start gap-3 text-xs font-sans text-rose-950">
            <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-mono text-[11px] uppercase text-rose-900 block">
                Primary Cause:
              </strong>
              <p className="leading-relaxed">{failureData.failureReason}</p>
            </div>
          </div>
        </div>

        {/* 3. RECOVERY ACTIONS */}
        <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
              Recommended Next Steps
            </h3>
            <p className="text-xs text-m4m-secondary">
              Your selected items remain safely preserved in your active
              shopping bag. You can try checkout again with a different payment
              option.
            </p>
          </div>

          {/* Action Buttons: Try Again, Back to Cart, Continue Shopping */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Try Again */}
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] text-m4m-bg py-3.5 px-5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors shadow-xs group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Try Again</span>
            </Link>

            {/* Action 2: Back to Cart */}
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 border border-[#111111] text-[#111111] bg-white py-3.5 px-5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-m4m-bg transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>

            {/* Action 3: Continue Shopping */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-m4m-border text-m4m-secondary bg-m4m-bg py-3.5 px-5 text-xs font-mono uppercase tracking-[0.2em] hover:text-[#111111] hover:border-[#111111] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* 4. CONCIERGE HELP & SUPPORT SECTION */}
        <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-m4m-border">
            <HelpCircle className="w-5 h-5 text-[#111111] shrink-0" />
            <div>
              <h3 className="font-serif text-base uppercase tracking-wider text-[#111111]">
                Having Trouble Completing Your Order?
              </h3>
              <p className="text-xs text-m4m-secondary">
                Our concierge client advisors are available to assist with
                payment resolutions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#444444] pt-1">
            <div className="p-3 bg-m4m-bg border border-m4m-border space-y-1">
              <span className="font-mono text-[10px] text-[#111111] font-semibold uppercase block">
                Common Fixes:
              </span>
              <ul className="list-disc list-inside space-y-1 text-m4m-secondary">
                <li>Verify card number, CVV, and expiry date.</li>
                <li>Ensure international/online limits are enabled.</li>
                <li>Check for bank OTP SMS/authenticator delays.</li>
              </ul>
            </div>

            <div className="p-3 bg-m4m-bg border border-m4m-border space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#111111] font-semibold uppercase block">
                  Concierge Support:
                </span>
                <p className="text-m4m-secondary">
                  Reference Order Attempt ID{" "}
                  <strong className="text-[#111111] font-mono">
                    {failureData.orderId}
                  </strong>{" "}
                  when contacting support.
                </p>
              </div>

              <div className="pt-2 border-t border-m4m-border flex items-center justify-between text-[11px] font-mono">
                <a
                  href="mailto:support@atelier-luxury.com"
                  className="text-[#111111] underline hover:text-m4m-accent flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Support</span>
                </a>
                <Link
                  to="/orders"
                  className="text-m4m-secondary hover:text-[#111111] underline"
                >
                  Account Orders →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
