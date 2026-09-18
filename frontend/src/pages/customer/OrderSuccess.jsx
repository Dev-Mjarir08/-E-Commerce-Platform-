import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Mail,
  Truck
} from 'lucide-react';

export const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-16 px-4 sm:px-6 lg:px-12 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-12 shadow-sm text-center space-y-8">
        {/* Animated Check Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-[#111111] text-[#F8F7F4] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block">
            CONSIGNMENT RATIFIED • CONFIRMATION COMPLETE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] uppercase tracking-tight">
            Thank You For Your Acquisition
          </h1>
          <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
            Your purchase has been recorded and submitted to the atelier workshop for tailoring preparation and white-glove logistics.
          </p>
        </div>

        {/* Order Identifier Card */}
        <div className="bg-[#F8F7F4] border border-[#E5E3DF] p-6 space-y-2 text-center max-w-md mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F] block">
            CONSIGNMENT REFERENCE NUMBER
          </span>
          <span className="font-mono text-lg font-bold text-[#111111] tracking-wider block">
            {id ? (id.startsWith('ATL-') ? id : id.toUpperCase()) : 'ATL-CONFIRMED'}
          </span>
          <p className="text-[11px] text-[#8E877F] font-sans">
            A confirmation receipt and courier tracking dossier have been transmitted to your client email.
          </p>
        </div>

        {/* Assurances Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E3DF] text-left">
          <div className="flex items-start gap-3 p-3 bg-[#F8F7F4]/60 border border-[#E5E3DF]">
            <Truck className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[11px] font-mono uppercase font-semibold text-[#111111]">
                White-Glove Dispatch
              </h5>
              <p className="text-[10px] text-[#8E877F]">
                Hand-inspected before transit handoff.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#F8F7F4]/60 border border-[#E5E3DF]">
            <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[11px] font-mono uppercase font-semibold text-[#111111]">
                Full Authenticity
              </h5>
              <p className="text-[10px] text-[#8E877F]">
                Archival serial documentation attached.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#F8F7F4]/60 border border-[#E5E3DF]">
            <Mail className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[11px] font-mono uppercase font-semibold text-[#111111]">
                Courier Alerts
              </h5>
              <p className="text-[10px] text-[#8E877F]">
                Milestone pings upon dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {id && (
            <Link
              to={`/orders/${id}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Inspect Consignment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 border border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[#111111] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History Archive</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 border border-[#E5E3DF] hover:border-[#111111] text-[#666666] hover:text-[#111111] text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Return to Gallery</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
