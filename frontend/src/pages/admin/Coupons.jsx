import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TicketPercent,
  Plus,
  CheckCircle2,
  Percent,
  Clock,
  X
} from 'lucide-react';
import {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus
} from '../../redux/slices/couponSlice';

const Coupons = () => {
  const dispatch = useDispatch();
  const couponList = useSelector((state) => state.coupons.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true
  });

  // Real Dynamic Metrics (strictly computed from real store items)
  const totalCoupons = couponList.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const activeCouponsCount = couponList.filter(
    (c) => c.isActive && (!c.expiryDate || c.expiryDate >= todayStr)
  ).length;
  const expiredCouponsCount = couponList.filter(
    (c) => c.expiryDate && c.expiryDate < todayStr
  ).length;
  const percentageCouponsCount = couponList.filter(
    (c) => c.discountType === 'percentage'
  ).length;

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    // Set default expiry date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const expiryStr = defaultDate.toISOString().split('T')[0];

    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscountAmount: '',
      usageLimit: '',
      expiryDate: expiryStr,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount ?? '0',
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      usageLimit: coupon.usageLimit || '',
      expiryDate: coupon.expiryDate || '',
      isActive: coupon.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = (id, code) => {
    if (window.confirm(`Are you sure you want to delete the promo code "${code}"?`)) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      alert('Please fill the coupon code and discount value.');
      return;
    }

    const cleanedCode = formData.code.trim().toUpperCase().replace(/\s+/g, '');

    if (editingCoupon) {
      dispatch(
        updateCoupon({
          ...editingCoupon,
          ...formData,
          code: cleanedCode,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
        })
      );
    } else {
      const newCoupon = {
        id: `CPN-${Date.now().toString(36).toUpperCase()}`,
        ...formData,
        code: cleanedCode,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usedCount: 0,
        createdAt: new Date().toISOString()
      };
      dispatch(addCoupon(newCoupon));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Coupons & Promotions</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Discount Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and track promotional discount vouchers, cart thresholds, and marketing campaign codes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Dynamic KPI Analytics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Codes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Coupons</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <TicketPercent size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalCoupons}</span>
            <span className="text-xs font-medium text-slate-500">
              {totalCoupons === 1 ? '1 Campaign' : `${totalCoupons} Campaigns`}
            </span>
          </div>
        </div>

        {/* Active Codes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Promotions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activeCouponsCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Valid Now
            </span>
          </div>
        </div>

        {/* Expired / Inactive */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expired Deals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-700">{expiredCouponsCount}</span>
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              Past Expiry
            </span>
          </div>
        </div>

        {/* Percentage vs Fixed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Percentage Deals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <Percent size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{percentageCouponsCount}</span>
            <span className="text-xs font-medium text-slate-500">
              {totalCoupons > 0 ? `${totalCoupons - percentageCouponsCount} Flat Off` : '0 Flat Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Coupons Management Overview Card */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
          <TicketPercent size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Promotions & Coupons Management</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Coupon table and search view are currently hidden. You can create and configure promotional vouchers using the "Create Coupon" action.
        </p>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCoupon ? 'Edit Promotion Voucher' : 'Create Promotional Coupon'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure discount code, spend minimums, and active lifecycle
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coupon Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LUXURY25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Structure *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Price Reduction (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Value * ({formData.discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discountType === 'percentage' ? '100' : '999999'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 1500'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Order Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="e.g. 4999 (0 for no limit)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="e.g. 5000 (Optional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="e.g. 100 uses (Leave empty for infinite)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campaign Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Publish & Activate Immediately</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  {editingCoupon ? 'Update Promotion' : 'Create Voucher Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
