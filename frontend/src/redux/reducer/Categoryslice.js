import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllCategories,
  fetchCategoryByIdService,
  fetchCategoryBySlugService,
  fetchSubCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/Categoryservice';

// ── Cache duration: 5 minutes ──────────────────────────────────────
const CACHE_DURATION = 5 * 60 * 1000;

// ── fetchCategories — skips if data is fresh ───────────────────────
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    // ✅ condition: skip fetch if cache is still valid
    condition: (_, { getState }) => {
      const { lastFetched, loading } = getState().categories;
      if (loading) return false; // already fetching
      if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return false; // cache hit
      return true; // cache miss — fetch
    },
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchCategoryByIdService(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetchCategoryBySlugService(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  'categories/fetchSubCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubCategoriesService();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createCategoryService(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryService(id, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────

const initialState = {
  categories:       [],
  subCategories:    [
    { name: 'Male', slug: 'male' },
    { name: 'Female', slug: 'female' },
  ],
  selectedCategory: null,
  loading:          false,
  error:            null,
  success:          false,
  successMessage:   '',
  lastFetched:      null, // ✅ cache timestamp
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = '';
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    // ✅ force re-fetch on next dispatch (e.g. after admin creates category)
    invalidateCategoryCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {

    // Fetch All
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading     = false;
        state.categories  = action.payload.data || [];
        state.subCategories = action.payload.subCategories || state.subCategories;
        state.lastFetched = Date.now(); // ✅ stamp the cache
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // Fetch By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading          = false;
        state.selectedCategory = action.payload.data;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // Fetch By Slug
    builder
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading          = false;
        state.selectedCategory = action.payload.data;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    builder
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.subCategories = action.payload.data || state.subCategories;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Create — ✅ invalidate cache so next fetch gets fresh data
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading         = false;
        state.categories.push(action.payload.data);
        state.success         = true;
        state.successMessage  = 'Category created successfully';
        state.lastFetched     = null; // ✅ invalidate cache
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // Update — ✅ invalidate cache
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload.data._id
        );
        if (index !== -1) state.categories[index] = action.payload.data;
        state.success        = true;
        state.successMessage = 'Category updated successfully';
        state.lastFetched    = null; // ✅ invalidate cache
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // Delete — ✅ invalidate cache
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading        = false;
        state.categories     = state.categories.filter((cat) => cat._id !== action.payload);
        state.success        = true;
        state.successMessage = 'Category deleted successfully';
        state.lastFetched    = null; // ✅ invalidate cache
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setSelectedCategory,
  clearSelectedCategory,
  invalidateCategoryCache,
} = categorySlice.actions;

export default categorySlice.reducer;
