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

// ── Cache duration: 3 minutes ──────────────────────────────────────
const CACHE_DURATION = 3 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────────────────────────

export const featchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkApi) => {
    try {
      const res = await getProductsApi(params);
      return {
        data:       res.data.data       ?? [],
        pagination: res.data.pagination ?? { skip: 0, limit: 10, total: 0 },
        params,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
  },
  {
    // ✅ skip if already loading, cache is fresh AND params unchanged
    condition: (params = {}, { getState }) => {
      const { loading, lastFetched, lastParams } = getState().products;
      if (loading) return false;
      const paramsChanged = JSON.stringify(params) !== JSON.stringify(lastParams ?? {});
      if (paramsChanged) return true;
      if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return false;
      return true;
    },
  }
);

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
  },
  {
    // ✅ skip if same product already loaded
    condition: (id, { getState }) => {
      const { single, loading } = getState().products;
      if (loading) return false;
      if (single?._id === id) return false;
      return true;
    },
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
    list:        [],
    loading:     false,
    error:       null,
    pagination:  { skip: 0, limit: 10, total: 0 },
    lastFetched: null, // ✅ cache timestamp
    lastParams:  {},   // ✅ last params for comparison

    categoryPage: {
      list:       [],
      loading:    false,
      error:      null,
      category:   null,
      pagination: { skip: 0, limit: 12, total: 0 },
    },

    single: null,

    admin: {
      total:   0,
      loading: false,
      error:   null,
    },
  },

  reducers: {
    resetCategoryPage(state) {
      state.categoryPage = {
        list:       [],
        loading:    false,
        error:      null,
        category:   null,
        pagination: { skip: 0, limit: 12, total: 0 },
      };
    },
    // ✅ force re-fetch after admin create/delete
    invalidateProductCache(state) {
      state.lastFetched = null;
      state.lastParams  = {};
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(featchProducts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(featchProducts.fulfilled, (state, action) => {
        state.loading     = false;
        state.list        = action.payload.data;
        state.pagination  = action.payload.pagination;
        state.lastFetched = Date.now();
        state.lastParams  = action.payload.params;
      })
      .addCase(featchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload?.message ?? "Failed to fetch products";
      })

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

      .addCase(featchProductById.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.admin.loading = true;
        state.admin.error   = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.admin.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload);
          state.admin.total += 1;
          state.lastFetched = null; // ✅ invalidate
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error   = action.payload?.message ?? "Failed to create";
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.single?._id === action.payload._id) state.single = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list        = state.list.filter((p) => p._id !== action.payload);
        state.admin.total = Math.max(0, state.admin.total - 1);
        if (state.single?._id === action.payload) state.single = null;
        state.lastFetched = null; // ✅ invalidate
      })

      .addCase(productCount.fulfilled, (state, action) => {
        state.admin.total = action.payload;
      });
  },
});

export const { resetCategoryPage, invalidateProductCache } = productSlice.actions;
export default productSlice.reducer;