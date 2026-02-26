import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addItemToCartApi,
  clearCartApi,
  getCartApi,
  removeItemFromCartApi,
  updateItemQuantityApi,
} from "../services/cart.services";

export const getCart = createAsyncThunk(
  "api/cart/getCart",
  async (_, thunkApi) => {
    try {
      const res = await getCartApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const addToCart = createAsyncThunk(
  "api/cart/addToCart",
  async ({ productId, qty }, thunkApi) => {
    try {
      const res = await addItemToCartApi(productId, qty);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "api/cart/updateCartItem",
  async ({ productId, qty }, thunkApi) => {
    try {
      const res = await updateItemQuantityApi(productId, qty);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "api/cart/removeCartItem",
  async (productId, thunkApi) => {
    try {
      const res = await removeItemFromCartApi(productId);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const clearCart = createAsyncThunk(
  "api/cart/clearCart",
  async (_, thunkApi) => {
    try {
      const res = await clearCartApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {items:[]},
    totals: null,
    loading: false,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder

      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.totals = action.payload.totals;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default cartSlice.reducer;