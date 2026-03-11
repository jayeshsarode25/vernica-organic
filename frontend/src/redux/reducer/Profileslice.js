import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3000/api/auth";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchAddresses = createAsyncThunk(
  "profile/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me/addresses`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "profile/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me/addresses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      if (!res.ok) throw new Error("Failed to add address");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "profile/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete address");
      return addressId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "profile/logout",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${BASE_URL}/logout`, { credentials: "include" });
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    addresses: [],
    addressesLoading: false,
    addressesError: null,
    addingAddress: false,
    deletingAddressId: null,
    loggingOut: false,
    // ── Checkout: which address is selected ──
    selectedAddress: null,
    toast: null,
  },
  reducers: {
    setSelectedAddress(state, action) {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress(state) {
      state.selectedAddress = null;
    },
    setToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAddresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.addressesLoading = true;
        state.addressesError = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressesLoading = false;
        const data = action.payload;
        const list = Array.isArray(data) ? data : data.addresses ?? [];
        state.addresses = list;
        // Auto-select default address if nothing is selected yet
        if (!state.selectedAddress) {
          const def = list.find((a) => a.isDefault) ?? list[0] ?? null;
          state.selectedAddress = def;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.addressesLoading = false;
        state.addressesError = action.payload;
        state.toast = { msg: "Could not load addresses", type: "error" };
      });

    // addAddress
    builder
      .addCase(addAddress.pending, (state) => {
        state.addingAddress = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addingAddress = false;
        const newAddr = action.payload.address ?? action.payload;
        state.addresses.push(newAddr);
        // Auto-select the newly added address
        state.selectedAddress = newAddr;
        state.toast = { msg: "Address added!", type: "success" };
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.addingAddress = false;
        state.toast = { msg: action.payload || "Failed to add address", type: "error" };
      });

    // deleteAddress
    builder
      .addCase(deleteAddress.pending, (state, action) => {
        state.deletingAddressId = action.meta.arg;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deletingAddressId = null;
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
        // If deleted address was selected, fall back to first available
        if (state.selectedAddress?._id === action.payload) {
          state.selectedAddress = state.addresses[0] ?? null;
        }
        state.toast = { msg: "Address removed", type: "success" };
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deletingAddressId = null;
        state.toast = { msg: action.payload || "Could not delete address", type: "error" };
      });

    // logoutUser
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loggingOut = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loggingOut = false;
        state.selectedAddress = null;
        state.addresses = [];
        state.toast = { msg: "Logging out…", type: "info" };
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loggingOut = false;
        state.toast = { msg: "Logging out…", type: "info" };
      });
  },
});

export const {
  setSelectedAddress,
  clearSelectedAddress,
  setToast,
  clearToast,
} = profileSlice.actions;

export default profileSlice.reducer;