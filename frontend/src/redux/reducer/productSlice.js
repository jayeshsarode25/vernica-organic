import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getSingleProductApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  countProductApi,
  getProductsByCategorySlugApi,
} from "../services/products.services";

// ─────────────────────────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────────────────────────

// Main product fetch — supports q, categoryId, categorySlug, minPrice, maxPrice, skip, limit
export const featchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkApi) => {
    try {
      const res = await getProductsApi(params);
      return {
        data:       res.data.data       ?? [],
        pagination: res.data.pagination ?? { skip: 0, limit: 10, total: 0 },
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

// Fetch products by category slug — uses dedicated backend endpoint
// params: { skip, limit, sort }
export const fetchProductsBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async ({ slug, params = {} }, thunkApi) => {
    try {
      const res = await getProductsByCategorySlugApi(slug, params);
      return {
        data:       res.data.data       ?? [],
        pagination: res.data.pagination ?? { skip: 0, limit: 12, total: 0 },
        category:   res.data.category   ?? null,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const featchProductById = createAsyncThunk(
  "products/fetchSingle",
  async (id, thunkApi) => {
    try {
      const res = await getSingleProductApi(id);
      return res.data.data ?? res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (data, thunkApi) => {
    try {
      const res = await createProductApi(data);
      return res.data.data ?? res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkApi) => {
    try {
      const res = await updateProductApi(id, data);
      return res.data.data ?? res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkApi) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const productCount = createAsyncThunk(
  "products/count",
  async (_, thunkApi) => {
    try {
      const res = await countProductApi();
      return res.data.totalProducts;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState: {
    // General list (all products / search / price filter)
    list:    [],
    loading: false,
    error:   null,
    pagination: { skip: 0, limit: 10, total: 0 },

    // Category page (slug-based)
    categoryPage: {
      list:       [],
      loading:    false,
      error:      null,
      category:   null, // { id, name, slug, description }
      pagination: { skip: 0, limit: 12, total: 0 },
    },

    // Single product
    single: null,

    // Admin
    admin: {
      total:   0,
      loading: false,
      error:   null,
    },
  },

  reducers: {
    // ✅ reset category page when navigating away
    resetCategoryPage(state) {
      state.categoryPage = {
        list:       [],
        loading:    false,
        error:      null,
        category:   null,
        pagination: { skip: 0, limit: 12, total: 0 },
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // ── featchProducts ──────────────────────────────────────────
      .addCase(featchProducts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(featchProducts.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(featchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload?.message ?? "Failed to fetch products";
      })

      // ── fetchProductsBySlug ─────────────────────────────────────
      .addCase(fetchProductsBySlug.pending, (state) => {
        state.categoryPage.loading = true;
        state.categoryPage.error   = null;
      })
      .addCase(fetchProductsBySlug.fulfilled, (state, action) => {
        state.categoryPage.loading    = false;
        state.categoryPage.list       = action.payload.data;
        state.categoryPage.pagination = action.payload.pagination;
        state.categoryPage.category   = action.payload.category;
      })
      .addCase(fetchProductsBySlug.rejected, (state, action) => {
        state.categoryPage.loading = false;
        state.categoryPage.error   = action.payload?.message ?? "Failed to fetch";
      })

      // ── featchProductById ───────────────────────────────────────
      .addCase(featchProductById.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      // ── createProduct ───────────────────────────────────────────
      .addCase(createProduct.pending, (state) => {
        state.admin.loading = true;
        state.admin.error   = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.admin.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload);
          state.admin.total += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error   = action.payload?.message ?? "Failed to create";
      })

      // ── updateProduct ───────────────────────────────────────────
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.single?._id === action.payload._id) state.single = action.payload;
      })

      // ── deleteProduct ───────────────────────────────────────────
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list        = state.list.filter((p) => p._id !== action.payload);
        state.admin.total = Math.max(0, state.admin.total - 1);
        if (state.single?._id === action.payload) state.single = null;
      })

      // ── productCount ────────────────────────────────────────────
      .addCase(productCount.fulfilled, (state, action) => {
        state.admin.total = action.payload;
      });
  },
});

export const { resetCategoryPage } = productSlice.actions;
export default productSlice.reducer;