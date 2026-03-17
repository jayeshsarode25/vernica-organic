import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelOrderApi,
  createOrderApi,
  getAllOrdersApi,
  getMyOrdersApi,
  getOrderByIdApi,
  updateOrderAddressApi,
  updateOrderStatusApi,
  getDashboardApi,
} from "../services/order.services";

// ========== ASYNC THUNKS ==========

export const createOrder = createAsyncThunk(
  "order/create",
  async (shippingAddress, thunkApi) => {
    try {
      const res = await createOrderApi(shippingAddress);
      return res.data;
    } catch (error) {
      console.log("ORDER ERROR RESPONSE:", error.response?.data);
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, thunkApi) => {
    try {
      const res = await getMyOrdersApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch your orders"
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getById",
  async (orderId, thunkApi) => {
    try {
      const res = await getOrderByIdApi(orderId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const updateOrderAddress = createAsyncThunk(
  "order/updateAddress",
  async ({ orderId, shippingAddress }, thunkApi) => {
    try {
      const res = await updateOrderAddressApi(orderId, shippingAddress);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, thunkApi) => {
    try {
      const res = await cancelOrderApi(orderId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (params = {}, thunkApi) => {
    try {
      const res = await getAllOrdersApi(params);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, thunkApi) => {
    try {
      const res = await updateOrderStatusApi(orderId, status);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const getDashboard = createAsyncThunk(
  "order/getDashboard",
  async (_, thunkApi) => {
    try {
      const res = await getDashboardApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

// ========== SLICE ==========

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    myOrders: [],
    allOrders: [],
    dashboardData: null,
    loading: false,
    actionLoading: false,
    error: null,
    success: false,
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalOrders: 0,
    },
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.success = false;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // CREATE ORDER
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Handle both nested and flat response structures
        const orderData = action.payload.order || action.payload;
        state.currentOrder = orderData;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // GET MY ORDERS
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.order || action.payload.orders || action.payload;
        state.myOrders = Array.isArray(data) ? data : data ? [data] : [];
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET ORDER BY ID
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const orderData = action.payload.order || action.payload;
        state.currentOrder = orderData;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE ORDER ADDRESS
    builder
      .addCase(updateOrderAddress.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateOrderAddress.fulfilled, (state, action) => {
        state.actionLoading = false;
        const orderData = action.payload.order || action.payload;
        state.currentOrder = orderData;
        // Update in myOrders list if exists
        state.myOrders = state.myOrders.map((o) =>
          o._id === orderData._id ? orderData : o
        );
      })
      .addCase(updateOrderAddress.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // CANCEL ORDER
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.order || action.payload;
        // Update in myOrders
        state.myOrders = state.myOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
        // Update in allOrders
        state.allOrders = state.allOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
        // Update current order if it's the one being cancelled
        if (state.currentOrder?._id === updated._id) {
          state.currentOrder = updated;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // GET ALL ORDERS (Admin)
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        // Handle paginated response
        if (payload.data) {
          state.allOrders = payload.data;
          state.pagination = {
            page: payload.page || 1,
            limit: payload.limit || 10,
            totalPages: payload.totalPages || 1,
            totalOrders: payload.totalOrders || payload.data.length,
          };
        } else {
          // Handle non-paginated response
          state.allOrders = Array.isArray(payload) ? payload : payload.orders || [];
        }
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allOrders = [];
      });

    // UPDATE ORDER STATUS
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.order || action.payload;
        
        // Update in allOrders
        state.allOrders = state.allOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
        
        // Update in myOrders
        state.myOrders = state.myOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
        
        // Update current order
        if (state.currentOrder?._id === updated._id) {
          state.currentOrder = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // GET DASHBOARD
    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrderError,
  clearCurrentOrder,
  resetOrderSuccess,
  setPagination,
} = orderSlice.actions;

export default orderSlice.reducer;