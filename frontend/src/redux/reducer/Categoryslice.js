

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllCategories,
  fetchCategoryByIdService,
  fetchCategoryBySlugService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/Categoryservice';



export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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


const initialState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  success: false,
  successMessage: '',
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
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Category By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload.data;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Category By Slug
    builder
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload.data;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.data);
        state.success = true;
        state.successMessage = 'Category created successfully';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload.data._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
        state.success = true;
        state.successMessage = 'Category updated successfully';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
        state.success = true;
        state.successMessage = 'Category deleted successfully';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setSelectedCategory,
  clearSelectedCategory,
} = categorySlice.actions;

export default categorySlice.reducer;