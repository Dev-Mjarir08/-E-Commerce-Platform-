import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TicketPercent,
  Plus,
  CheckCircle2,
  Percent,
  Clock,
  X,
  Search,
  Edit2,
  Trash2
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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

  // Filtered Coupon List
  const filteredCoupons = useMemo(() => {
    return couponList.filter((c) => {
      const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || c.discountType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [couponList, searchQuery, typeFilter]);

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
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      usageLimit: coupon.usageLimit || '',
      expiryDate: coupon.expiryDate || '',
      isActive: coupon.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      alert('Please provide coupon code and discount value.');
      return;
    }

    if (editingCoupon) {
      dispatch(
        updateCoupon({
          ...editingCoupon,
          code: formData.code.toUpperCase().trim(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
          maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
          expiryDate: formData.expiryDate || null,
          isActive: formData.isActive
        })
      );
    } else {
      const newCoupon = {
        id: `CPN-${Date.now().toString().slice(-4)}`,
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 100,
        usedCount: 0,
        expiryDate: formData.expiryDate || null,
        isActive: formData.isActive,
        createdAt: new Date().toISOString()
      };
      dispatch(addCoupon(newCoupon));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Promotions & Coupons</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create promotional voucher codes, percentage discounts, and order thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Vouchers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <TicketPercent size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalCoupons}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Registered
            </span>
          </div>
        </div>

        {/* Active Promos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Deals</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activeCouponsCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Redeemable
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 font-medium">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage Off</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <TicketPercent size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No coupons found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try a different search query or create a new voucher.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiryDate && coupon.expiryDate < todayStr;
                  const isActive = Boolean(coupon.isActive) && !isExpired;

                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                            {coupon.code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} FLAT`}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : 'No Min'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={isExpired ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                            {coupon.expiryDate || 'No Expiry'}
                          </span>
                          {isExpired && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => dispatch(toggleCouponStatus(coupon.id))}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCoupon ? 'Edit Promotion Voucher' : 'Create Promotion Voucher'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure discount code, rules, redemption allowances, and expiration date
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
                    Voucher Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-indigo-600 focus:bg-white uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Structure *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  >
                    <option value="percentage">Percentage Discount (% Off)</option>
                    <option value="fixed">Fixed Currency Discount (₹ Flat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {formData.discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Flat Value (₹) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Cart Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="e.g. 1999 (0 for none)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Redemption Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="e.g. 100 (Blank for unlimited)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActiveCoupon"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isActiveCoupon" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Publish Coupon as Immediately Redeemable
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  {editingCoupon ? 'Save Coupon Updates' : 'Publish Voucher'}
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
