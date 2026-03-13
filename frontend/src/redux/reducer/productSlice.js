import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getSingleProductApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  countProductApi,
} from "../services/products.services";

// ─────────────────────────────────────────────
// USER-FACING THUNKS (your existing)
// ─────────────────────────────────────────────

export const featchProducts = createAsyncThunk(
  "api/products/fetchAll",
  async (params, thunkApi) => {
    try {
      const res = await getProductsApi(params);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const featchProductById = createAsyncThunk(
  "api/products/fetchSingle",
  async (id, thunkApi) => {
    try {
      const res = await getSingleProductApi(id);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

// ─────────────────────────────────────────────
// ADMIN THUNKS (new)
// ─────────────────────────────────────────────

export const createProduct = createAsyncThunk(
  "api/products/createProduct",
  async (data, thunkApi) => {
    try {
      const res = await createProductApi(data);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "api/products/updateProduct",
  async ({ id, data }, thunkApi) => {
    try {
      const res = await updateProductApi(id, data);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "api/products/deleteProduct",
  async (id, thunkApi) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

export const productCount = createAsyncThunk(
  "api/products/productCount",
  async (_, thunkApi) => {
    try {
      const res = await countProductApi();
      return res.data?.count ?? res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState: {
    // User-facing state (your existing)
    list: [],
    single: null,
    loading: false,
    error: null,
    pagination: {
      skip: 0,
      limit: 10,
      total: 0,
    },

    // Admin state (new)
    admin: {
      total: 0,
      loading: false,
      error: null,
    },
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ── featchProducts ──
      .addCase(featchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(featchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(featchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ── featchProductById ──
      .addCase(featchProductById.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      // ── createProduct ──
      .addCase(createProduct.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.admin.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload); // also prepend to user-facing list
          state.admin.total += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.payload?.message ?? "Failed to create product";
      })

      // ── updateProduct ──
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        // update in list
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
        // update single if it's the same product
        if (state.single?._id === action.payload._id) state.single = action.payload;
      })

      // ── deleteProduct ──
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        state.admin.total = Math.max(0, state.admin.total - 1);
        if (state.single?._id === action.payload) state.single = null;
      })

      // ── productCount ──
      .addCase(productCount.fulfilled, (state, action) => {
        state.admin.total = action.payload;
      });
  },
});

export default productSlice.reducer;