// src/redux/slices/blogSlice.js
// Blog state management with Redux Toolkit

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllBlogs,
  fetchBlogBySlug,
  fetchBlogCategories,
  fetchBlogTags,
  fetchRelatedBlogs,
  fetchAllBlogsAdmin,
  fetchBlogById,
  createBlogService,
  updateBlogService,
  deleteBlogService,
} from '../services/Blogservice';

// ====================================
// ASYNC THUNKS
// ====================================

export const getAllBlogs = createAsyncThunk(
  'blogs/getAllBlogs',
  async ({ page = 1, limit = 10, category = '', tag = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await fetchAllBlogs(page, limit, category, tag, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogBySlug = createAsyncThunk(
  'blogs/getBlogBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetchBlogBySlug(slug);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogCategories = createAsyncThunk(
  'blogs/getBlogCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBlogCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogTags = createAsyncThunk(
  'blogs/getBlogTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBlogTags();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRelatedBlogs = createAsyncThunk(
  'blogs/getRelatedBlogs',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await fetchRelatedBlogs(blogId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin thunks
export const getAllBlogsAdmin = createAsyncThunk(
  'blogs/getAllBlogsAdmin',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetchAllBlogsAdmin(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogByIdAdmin = createAsyncThunk(
  'blogs/getBlogByIdAdmin',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await fetchBlogById(blogId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await createBlogService(blogData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      const response = await updateBlogService(blogId, blogData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      await deleteBlogService(blogId);
      return blogId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ====================================
// INITIAL STATE
// ====================================

const initialState = {
  blogs: [],
  selectedBlog: null,
  relatedBlogs: [],
  categories: [],
  tags: [],
  
  loading: false,
  error: null,
  success: false,
  successMessage: '',
  
  pagination: {
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10,
  },
};

// ====================================
// SLICE
// ====================================

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = '';
    },
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Blogs
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Blog By Slug
    builder
      .addCase(getBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload.data;
      })
      .addCase(getBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Blog Categories
    builder
      .addCase(getBlogCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(getBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Blog Tags
    builder
      .addCase(getBlogTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data || [];
      })
      .addCase(getBlogTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Related Blogs
    builder
      .addCase(getRelatedBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRelatedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedBlogs = action.payload.data || [];
      })
      .addCase(getRelatedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Blogs Admin
    builder
      .addCase(getAllBlogsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(getAllBlogsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Blog By ID Admin
    builder
      .addCase(getBlogByIdAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogByIdAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload.data;
      })
      .addCase(getBlogByIdAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload.data);
        state.success = true;
        state.successMessage = 'Blog created successfully';
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(
          (blog) => blog._id === action.payload.data._id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload.data;
        }
        state.selectedBlog = action.payload.data;
        state.success = true;
        state.successMessage = 'Blog updated successfully';
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        state.success = true;
        state.successMessage = 'Blog deleted successfully';
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setSelectedBlog,
  clearSelectedBlog,
} = blogSlice.actions;

export default blogSlice.reducer;