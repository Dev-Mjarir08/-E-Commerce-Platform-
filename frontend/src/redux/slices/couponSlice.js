import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../services/couponApi';

const formatDateForInput = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().split('T')[0];
};

export const mapBackendCouponToItem = (coupon) => {
  if (!coupon) return null;

  return {
    id: coupon._id || coupon.id,
    code: coupon.code || '',
    discountType: coupon.discountType || 'percentage',
    discountValue: Number(coupon.discountValue ?? 0),
    minOrderAmount: Number(coupon.minOrderAmount ?? 0),
    maxDiscountAmount:
      coupon.maxDiscountAmount != null
        ? Number(coupon.maxDiscountAmount)
        : null,
    startDate: formatDateForInput(coupon.startDate),
    expiryDate: formatDateForInput(coupon.expiryDate),
    usageLimit:
      coupon.usageLimit != null
        ? Number(coupon.usageLimit)
        : null,
    usedCount: Number(coupon.usedCount ?? 0),
    store: coupon.store || null,
    isActive: Boolean(coupon.isActive),
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt
  };
};

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await couponApi.getCoupons(params);

      const rawCoupons = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.coupons)
        ? response.coupons
        : Array.isArray(response)
        ? response
        : [];

      return rawCoupons
        .map(mapBackendCouponToItem)
        .filter((coupon) => coupon?.id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch coupons.'
      );
    }
  }
);

export const addCoupon = createAsyncThunk(
  'coupons/addCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await couponApi.createCoupon(couponData);

      const createdCoupon = response?.data || response;

      return mapBackendCouponToItem(createdCoupon);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to create coupon.'
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ id, ...couponData }, { rejectWithValue }) => {
    try {
      const response = await couponApi.updateCoupon(
        id,
        couponData
      );

      const updatedCoupon = response?.data || response;

      return mapBackendCouponToItem(updatedCoupon);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to update coupon.'
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await couponApi.deleteCoupon(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete coupon.'
      );
    }
  }
);

export const toggleCouponStatus = createAsyncThunk(
  'coupons/toggleCouponStatus',
  async (id, { getState, rejectWithValue }) => {
    try {
      const coupon = getState().coupons.items.find(
        (item) => item.id === id
      );

      if (!coupon) {
        return rejectWithValue('Coupon not found.');
      }

      const nextIsActive = !Boolean(coupon.isActive);

      const response = await couponApi.updateCoupon(id, {
        isActive: nextIsActive
      });

      const updatedCoupon = response?.data || response;

      return {
        id: updatedCoupon?._id || updatedCoupon?.id || id,
        isActive: Boolean(
          updatedCoupon?.isActive ?? nextIsActive
        )
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to update coupon status.'
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,

  reducers: {
    clearCouponError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      // ==============================
      // FETCH
      // ==============================

      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================
      // CREATE
      // ==============================

      .addCase(addCoupon.pending, (state) => {
        state.error = null;
      })

      .addCase(addCoupon.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(addCoupon.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==============================
      // UPDATE
      // ==============================

      .addCase(updateCoupon.pending, (state) => {
        state.error = null;
      })

      .addCase(updateCoupon.fulfilled, (state, action) => {
        if (!action.payload) return;

        const index = state.items.findIndex(
          (coupon) => coupon.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })

      .addCase(updateCoupon.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==============================
      // DELETE
      // ==============================

      .addCase(deleteCoupon.pending, (state) => {
        state.error = null;
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (coupon) => coupon.id !== action.payload
        );
      })

      .addCase(deleteCoupon.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==============================
      // STATUS
      // ==============================

      .addCase(toggleCouponStatus.pending, (state) => {
        state.error = null;
      })

      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        if (!action.payload) return;

        const index = state.items.findIndex(
          (coupon) => coupon.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })

      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  clearCouponError
} = couponSlice.actions;

export default couponSlice.reducer;