import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendSignupOtpApi,
  verifySignupOtpApi,
  sendLoginOtpApi,
  verifyLoginOtpApi,
  getMeApi,
  getUsersApi,
  getUserCountApi,
  deleteUserApi,
  blockUserApi,
} from "../services/auth.services";

// ─────────────────────────────────────────────
// AUTH THUNKS
// ─────────────────────────────────────────────

export const sendSignupOtp = createAsyncThunk(
  "api/auth/sendSignupOtp",
  async (data, thunkApi) => {
    try {
      const res = await sendSignupOtpApi(data);
      return { ...data, message: res.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const verifySignupOtp = createAsyncThunk(
  "api/auth/verifySignupOtp",
  async ({ phone, otp, password }, thunkApi) => {
    try {
      const res = await verifySignupOtpApi({ phone, otp, password });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const sendLoginOtp = createAsyncThunk(
  "api/auth/sendLoginOtp",
  async (phone, thunkApi) => {
    try {
      const res = await sendLoginOtpApi(phone);
      return { phone, message: res.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

export const verifyLoginOtp = createAsyncThunk(
  "api/auth/verifyLoginOtp",
  async ({ phone, otp }, thunkApi) => {
    try {
      const res = await verifyLoginOtpApi(phone, otp);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "OTP verification failed",
      );
    }
  },
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkApi) => {
  try {
    const res = await getMeApi();
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue("Not authenticated");
  }
});

// ─────────────────────────────────────────────
// ADMIN USER MANAGEMENT THUNKS
// ─────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkApi) => {
    try {
      const res = await getUsersApi();
      return res.data?.users ?? res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const fetchUserCount = createAsyncThunk(
  "users/fetchCount",
  async (_, thunkApi) => {
    try {
      const res = await getUserCountApi();
      return res.data?.count ?? res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, thunkApi) => {
    try {
      await deleteUserApi(id);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const blockUser = createAsyncThunk(
  "users/block",
  async (id, thunkApi) => {
    try {
      await blockUserApi(id);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Auth state
    step: "idle",
    tempPhone: null,
    tempSignupData: null,
    user: null,
    loading: false,
    error: null,

    // Admin user management state
    users: {
      items: [],
      count: 0,
      loading: false,
      error: null,
    },
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
      // sendSignupOtp
      .addCase(sendSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // verifySignupOtp
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.step = "authenticated";
      })

      // sendLoginOtp
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.step = "loginOtpSent";
        state.tempPhone = action.payload.phone;
      })

      // verifyLoginOtp
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.step = "authenticated";
      })

      // getMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload?.message ?? "Failed to fetch users";
      })

      // fetchUserCount
      .addCase(fetchUserCount.fulfilled, (state, action) => {
        state.users.count = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.items = state.users.items.filter(
          (u) => (u._id ?? u.userId ?? u.id) !== action.payload,
        );
        state.users.count = Math.max(0, state.users.count - 1);
      })

      // blockUser (toggle)
      .addCase(blockUser.fulfilled, (state, action) => {
        const found = state.users.items.find(
          (u) => (u._id ?? u.userId ?? u.id) === action.payload,
        );
        if (found) found.isBlocked = !found.isBlocked;
      });
  },
});

export const { logout, clearError, resetFlow } = authSlice.actions;
export default authSlice.reducer;
