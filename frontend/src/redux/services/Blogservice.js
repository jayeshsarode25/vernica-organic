// src/services/blogService.js
// All blog API calls

const API_BASE = 'http://localhost:3002';

// Helper function to get token
const getToken = () => localStorage.getItem('token');

// Helper function to get headers with auth
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// ====================================
// PUBLIC ENDPOINTS
// ====================================

// Fetch all published blogs (with pagination, filtering, search)
export const fetchAllBlogs = async (page = 1, limit = 10, category = '', tag = '', search = '') => {
  try {
    let url = `${API_BASE}/api/blogs?page=${page}&limit=${limit}`;
    
    if (category) url += `&category=${category}`;
    if (tag) url += `&tag=${tag}`;
    if (search) url += `&search=${search}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch single blog by slug
export const fetchBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/slug/${slug}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Blog not found');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch all blog categories
export const fetchBlogCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/categories`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch all blog tags
export const fetchBlogTags = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/tags`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch related blogs
export const fetchRelatedBlogs = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/related/${blogId}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch related blogs');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ====================================
// ADMIN ENDPOINTS (Protected)
// ====================================

// Fetch all blogs (including drafts)
export const fetchAllBlogsAdmin = async (page = 1, limit = 10) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_BASE}/api/blogs/admin/all?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch single blog by ID (for editing)
export const fetchBlogById = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/admin/${blogId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    
    if (!response.ok) {
      throw new Error('Blog not found');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Create new blog
export const createBlogService = async (blogData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(blogData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create blog');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Update blog
export const updateBlogService = async (blogId, blogData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(blogData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update blog');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Delete blog
export const deleteBlogService = async (blogId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/api/blogs/${blogId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete blog');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ====================================
// EXPORT ALL SERVICES
// ====================================
export default {
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
};