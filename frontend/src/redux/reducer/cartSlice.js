import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addItemToCartApi,
  clearCartApi,
  getCartApi,
  removeItemFromCartApi,
  updateItemQuantityApi,
} from "../services/cart.services";

export const getCart = createAsyncThunk("cart/get", async (_, thunkApi) => {
  try {
    const res = await getCartApi();
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data);
  }
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, qty }, thunkApi) => {
    try {
      const res = await addItemToCartApi(productId, qty);
      return { ...res.data, productId };
    } catch (error) {
      return thunkApi.rejectWithValue({ ...error.response?.data, productId });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, thunkApi) => {
    try {
      const res = await updateItemQuantityApi(productId, qty);
      return { ...res.data, productId };
    } catch (error) {
      return thunkApi.rejectWithValue({ ...error.response?.data, productId });
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (productId, thunkApi) => {
    try {
      if (!productId) {
        return thunkApi.rejectWithValue({ message: "productId is required" });
      }
      const res = await removeItemFromCartApi(productId);
      return { ...res.data, productId };
    } catch (error) {
      return thunkApi.rejectWithValue({ ...error.response?.data, productId });
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, thunkApi) => {
  try {
    const res = await clearCartApi();
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items:        [],
    totals:       null,
    loading:      false,
    error:        null,
    addingIds:    [],
    removingIds:  [],
    // ── Coupon / Discount ──────────────────────────────────────────
    discount:     0,      
    couponCode:   "",     
  },
  reducers: {
    // ── Apply a coupon discount ────────────────────────────────────
    applyDiscount(state, action) {
      state.discount   = action.payload.discount;
      state.couponCode = action.payload.couponCode;
    },
    // ── Remove the coupon ──────────────────────────────────────────
    clearDiscount(state) {
      state.discount   = 0;
      state.couponCode = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // ── getCart ──────────────────────────────────────────────────
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = action.payload.cart?.items || [];
      })
      .addCase(getCart.rejected, (state) => {
        state.loading = false;
      })

      // ── addToCart ────────────────────────────────────────────────
      .addCase(addToCart.pending, (state, action) => {
        const id = action.meta.arg.productId;
        if (!state.addingIds.includes(id)) state.addingIds.push(id);
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingIds = state.addingIds.filter((id) => id !== action.payload.productId);
        state.items     = action.payload.cart?.items || [];
        state.totals    = action.payload.totals || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingIds = state.addingIds.filter((id) => id !== action.payload?.productId);
        state.error     = action.payload?.message || "Failed to add to cart";
      })

      // ── updateCartItem ───────────────────────────────────────────
      .addCase(updateCartItem.pending, (state, action) => {
        const id = action.meta.arg.productId;
        if (!state.addingIds.includes(id)) state.addingIds.push(id);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.addingIds = state.addingIds.filter((id) => id !== action.payload.productId);
        state.items     = action.payload.cart?.items || [];
        state.totals    = action.payload.totals || null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.addingIds = state.addingIds.filter((id) => id !== action.payload?.productId);
      })

      // ── removeCartItem ───────────────────────────────────────────
      .addCase(removeCartItem.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.removingIds.includes(id)) state.removingIds.push(id);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removingIds = state.removingIds.filter((id) => id !== action.payload.productId);
        state.items       = action.payload.cart?.items || [];
        state.totals      = action.payload.totals || null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removingIds = state.removingIds.filter((id) => id !== action.payload?.productId);
      })

      // ── clearCart ─────────────────────────────────────────────────
      // ✅ Also reset discount when cart is cleared
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items       = action.payload.cart?.items || [];
        state.totals      = action.payload.totals || null;
        state.addingIds   = [];
        state.removingIds = [];
        state.discount    = 0;   // ✅ reset
        state.couponCode  = "";  // ✅ reset
      });
  },
});

export const { applyDiscount, clearDiscount } = cartSlice.actions;
export default cartSlice.reducer;