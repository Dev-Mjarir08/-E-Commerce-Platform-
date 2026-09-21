import api from './api';

export const couponApi = {
  // GET /api/coupons - List coupons
  async getCoupons(params = {}) {
    return api.get('/coupons', { params });
  },

  // GET /api/coupons/:id - Get single coupon by ID or Code
  async getCouponById(id) {
    return api.get(`/coupons/${id}`);
  },

  // POST /api/coupons - Create coupon
  async createCoupon(couponData) {
    return api.post('/coupons', couponData);
  },

  // PATCH /api/coupons/:id - Update coupon
  async updateCoupon(id, couponData) {
    return api.patch(`/coupons/${id}`, couponData);
  },

  // DELETE /api/coupons/:id - Delete coupon
  async deleteCoupon(id) {
    return api.delete(`/coupons/${id}`);
  }
};

export default couponApi;
