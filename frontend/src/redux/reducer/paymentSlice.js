import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPaymentApi,
  verifyPaymentApi,
} from "../services/payment.services";

export const createPayment = createAsyncThunk(
  "payment/create",
  async (orderId, thunkApi) => {
    try {
      const res = await createPaymentApi(orderId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to initiate payment",
      );
    }
  },
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async ({ razorpayOrderId, paymentId, signature }, thunkApi) => {
    try {
      const res = await verifyPaymentApi({
        razorpayOrderId,
        paymentId,
        signature,
      });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to initiate payment",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentData: null,
    verifiedPayment: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.paymentData = null;
      state.verifiedPayment = null;
      ((state.status = "idle"), (state.error = null));
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createPayment.pending, (state) => {
        state.status = "initiating";
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = "idle";

        state.paymentData = action.payload.newPayment;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.status = "verifying";
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = "success";
        state.verifiedPayment = action.payload.payment;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetPayment, clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;