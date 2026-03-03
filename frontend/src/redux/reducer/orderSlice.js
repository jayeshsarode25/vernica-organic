import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelOrderApi,
  createOrderApi,
  getAllOrdersApi,
  getMyOrdersApi,
  getOrderByIdApi,
  updateOrderAddressApi,
  updateOrderStatusApi,
} from "../services/order.services";

export const createOrder = createAsyncThunk(
  "order/create",
  async (shippingAddress, thunkApi) => {
    try {
      const res = await createOrderApi(shippingAddress);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, thunkApi) => {
    try {
      const res = await getMyOrdersApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const getOrderById = createAsyncThunk(
  "order/getById",
  async (orderId, thunkApi) => {
    try {
      const res = await getOrderByIdApi(orderId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const updateOrderAddress = createAsyncThunk(
  "order/updateAddress",
  async ({ orderId, shippingAddress }, thunkApi) => {
    try {
      const res = await updateOrderAddressApi(orderId, shippingAddress);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, thunkApi) => {
    try {
      const res = await cancelOrderApi(orderId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (_, thunkApi) => {
    try {
      const res = await getAllOrdersApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, thunkApi) => {
    try {
      const res = await updateOrderStatusApi(orderId, status);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    myOrders: [],
    allOrders: [],
    loading: false,
    actionLoading: false,
    error: null,
    succcess: false,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.succcess = false;
    },
    resetOrderSuccess: (state) => {
      state.succcess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.succcess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.succcess = true;
        state.currentOrder = action.payload.order ?? action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.order;
        state.myOrders = Array.isArray(data) ? data : data ? [data] : [];
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order ?? action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderAddress.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateOrderAddress.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload.order ?? action.payload;
      })
      .addCase(updateOrderAddress.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.order ?? action.payload;
        state.myOrders = state.myOrders.map((o) =>
          o._id === updated._id ? updated : o,
        );
        if (state.currentOrder?._id === updated._id) {
          state.currentOrder = updated;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllOrders.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload.orders ?? action.payload ?? [];
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order ?? action.payload;
        state.allOrders = state.allOrders.map((o) =>
          o._id === updated._id ? updated : o,
        );
      });
  },
});

export const { clearOrderError, clearCurrentOrder, resetOrderSuccess } =
  orderSlice.actions;
export default orderSlice.reducer;
