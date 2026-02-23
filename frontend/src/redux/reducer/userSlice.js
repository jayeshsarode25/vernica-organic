import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendSignupOtp = createAsyncThunk(
  "api/auth/sendSignupOtp",
  async (data, thunkApi) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup-phone",
        data,
      );
      return { ...data, message: res.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  },
);

export const verifySignupOtp = createAsyncThunk(
  "api/auth/verifySignupOtp",
  async ({ phone, otp, password }, thunkApi) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-phone-otp",
        {
          phone,
          otp,
          password,
        },
      );
      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  },
);

export const sendLoginOtp = createAsyncThunk(
  "api/auth/sendLoginOtp",
  async (phone, thunkApi) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login-phone",
        { phone } 
      );

      return { phone, message: res.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "api/auth/verifyLoginOtp",
  async ({ phone, otp }, thunkApi) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-login-otp",
        {
          phone,
          otp
        }
      );

      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    step: "idle",
    tempPhone: null,
    tempSignupData: null,
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.step = "idle";
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFlow: (state) => {
      state.step = "idle";
      state.tempPhone = null;
      state.tempSignupData = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(sendSignupOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendSignupOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = "signupOtpSent"; 
        state.tempPhone = action.payload.phone;
        state.tempSignupData = action.payload;
      })
      .addCase(sendSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.step = "authenticated";
      })

      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.step = "loginOtpSent";
        state.tempPhone = action.payload.phone;
      })

      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.step = "authenticated";
      });
  },
});

export const { logout, clearError, resetFlow } = authSlice.actions;
export default authSlice.reducer;
