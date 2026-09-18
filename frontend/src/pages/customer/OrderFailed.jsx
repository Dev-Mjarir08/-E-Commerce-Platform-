import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  ArrowLeft,
  LifeBuoy
} from 'lucide-react';

export const OrderFailed = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-16 px-4 sm:px-6 lg:px-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block">
            AUTHORIZATION DECLINED
          </span>
          <h1 className="font-serif text-3xl text-[#111111] uppercase tracking-tight">
            Settlement Was Not Completed
          </h1>
          <p className="text-xs text-[#666666] leading-relaxed">
            Your financial institution was unable to ratify the transaction, or the checkout session timed out. No funds have been captured from your account.
          </p>
        </div>

        <div className="bg-[#F8F7F4] border border-[#E5E3DF] p-4 text-xs font-mono text-[#8E877F] text-left space-y-1">
          <p>• Verify card billing address matches bank records.</p>
          <p>• Ensure sufficient balance or try another settlement method.</p>
          <p>• Cash on Delivery remains available for immediate checkout.</p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/checkout"
            className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Checkout</span>
          </Link>

          <Link
            to="/cart"
            className="w-full sm:w-auto px-6 py-3 border border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[#111111] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Review Bag</span>
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto px-6 py-3 border border-[#E5E3DF] hover:border-[#111111] text-[#666666] hover:text-[#111111] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Concierge Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
