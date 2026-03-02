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
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, thunkApi) => {
    try {
      const res = await updateItemQuantityApi(productId, qty);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (productId, thunkApi) => {
    try {
      // ✅ Fix: guard against undefined productId
      if (!productId) {
        return thunkApi.rejectWithValue({ message: "productId is required" });
      }
      const res = await removeItemFromCartApi(productId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
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
    items: [],
    totals: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
        console.log("Cart API Response:", action.payload);
      })
      .addCase(getCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totals = action.payload.totals || null;
        console.log("Cart API Response:", action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totals = action.payload.totals || null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totals = action.payload.totals || null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totals = action.payload.totals || null;
      });
  },
});

export default cartSlice.reducer;