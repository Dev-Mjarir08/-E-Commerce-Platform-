import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderApi from '../../services/orderApi';

const formatOrderStatus = (status) => {
  if (!status) return 'Placed';

  return status
    .toString()
    .charAt(0)
    .toUpperCase() + status.toString().slice(1);
};

const mapOrder = (order) => {
  if (!order) return null;

  const user = order.user || {};

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const firstStore = items.find((item) => item.store)?.store;

  const customerName =
    user.name ||
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ') ||
    order.shippingAddress?.recipientName ||
    'Customer';

  return {
    id: order._id || order.id,
    orderNumber:
      order.orderNumber ||
      order._id ||
      order.id,

    customer: customerName,

    email:
      user.email ||
      order.shippingAddress?.email ||
      '',

    vendor:
      firstStore?.name ||
      'Marketplace',

    itemsCount: items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ),

    items,

    total: Number(order.totalPrice || 0),

    status: formatOrderStatus(
      order.orderStatus
    ),

    rawStatus:
      order.orderStatus || 'placed',

    paymentMethod:
      order.paymentMethod || '',

    paymentStatus:
      order.paymentStatus || 'pending',

    shippingAddress:
      order.shippingAddress || null,

    billingAddress:
      order.billingAddress || null,

    trackingNumber:
      order.trackingNumber || null,

    notes:
      order.notes || '',

    date:
      order.createdAt || null,

    createdAt:
      order.createdAt || null,

    deliveredAt:
      order.deliveredAt || null,

    cancelledAt:
      order.cancelledAt || null,

    cancellationReason:
      order.cancellationReason || null,

    subtotal:
      Number(order.subtotal || 0),

    taxPrice:
      Number(order.taxPrice || 0),

    shippingPrice:
      Number(order.shippingPrice || 0),

    discountAmount:
      Number(order.discountAmount || 0),

    user:
      order.user || null,

    store:
      firstStore || null
  };
};

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await orderApi.getAdminOrders(params);

      const orders =
        response?.data?.orders ||
        response?.orders ||
        [];

      return {
        orders: orders
          .map(mapOrder)
          .filter((order) => order?.id),

        pagination:
          response?.data?.pagination ||
          response?.pagination ||
          null
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await orderApi.getOrderById(id);

      const order =
        response?.data ||
        response?.order ||
        response;

      return mapOrder(order);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch order details'
      );
    }
  }
);

export const updateAdminOrderStatusThunk = createAsyncThunk(
  'orders/updateAdminOrderStatus',
  async ({ orderId, status, trackingNumber, carrier, reason }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, {
        status,
        trackingNumber,
        carrier,
        reason
      });
      const updatedOrder = response?.data?.order || response?.data || response;
      return { orderId, status, updatedOrder: mapOrder(updatedOrder) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to update order status'
      );
    }
  }
);

const initialState = {
  items: [],
  selectedOrder: null,

  loading: false,
  detailsLoading: false,

  error: null,
  detailsError: null,

  pagination: null
};

const orderSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearOrderDetailsError: (state) => {
      state.detailsError = null;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },

  extraReducers: (builder) => {
    builder

      // Admin orders
      .addCase(
        fetchAdminOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAdminOrders.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload.orders;

          state.pagination =
            action.payload.pagination;
        }
      )

      .addCase(
        fetchAdminOrders.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Failed to fetch orders';
        }
      )

      // Order details
      .addCase(
        fetchOrderById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
          state.selectedOrder = null;
        }
      )

      .addCase(
        fetchOrderById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedOrder =
            action.payload;
        }
      )

      .addCase(
        fetchOrderById.rejected,
        (state, action) => {
          state.detailsLoading = false;

          state.detailsError =
            action.payload ||
            'Failed to fetch order details';
        }
      )

      // Update Order Status
      .addCase(
        updateAdminOrderStatusThunk.fulfilled,
        (state, action) => {
          const { orderId, status, updatedOrder } = action.payload;
          const formatted = formatOrderStatus(status);

          const index = state.items.findIndex(
            (o) => o.id === orderId || o.orderNumber === orderId
          );
          if (index !== -1) {
            state.items[index].status = formatted;
            state.items[index].rawStatus = status.toLowerCase();
            if (updatedOrder) {
              state.items[index] = { ...state.items[index], ...updatedOrder };
            }
          }

          if (
            state.selectedOrder &&
            (state.selectedOrder.id === orderId ||
              state.selectedOrder.orderNumber === orderId)
          ) {
            state.selectedOrder.status = formatted;
            state.selectedOrder.rawStatus = status.toLowerCase();
            if (updatedOrder) {
              state.selectedOrder = {
                ...state.selectedOrder,
                ...updatedOrder
              };
            }
          }
        }
      );
  }
});

export const {
  clearOrderError,
  clearOrderDetailsError,
  clearSelectedOrder
} = orderSlice.actions;

export default orderSlice.reducer;