// src/services/blogService.js
import axios from "axios";
import { API_URLS } from "./apiConfig";

const api = axios.create({
  baseURL: API_URLS.blogs,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ====================================
// PUBLIC ENDPOINTS
// ====================================

export const fetchAllBlogs = (page = 1, limit = 10, category = "", tag = "", search = "") =>
  api.get("/", { params: { page, limit, category, tag, search } });

export const fetchBlogBySlug = (slug) => api.get(`/slug/${slug}`);

export const fetchBlogCategories = () => api.get("/categories");

export const fetchBlogTags = () => api.get("/tags");

export const fetchRelatedBlogs = (blogId) => api.get(`/related/${blogId}`);

// ====================================
// ADMIN ENDPOINTS (Protected)
// ====================================

export const fetchAllBlogsAdmin = (page = 1, limit = 10) =>
  api.get("/admin/all", { params: { page, limit } });

export const fetchBlogById = (blogId) => api.get(`/admin/${blogId}`);

export const createBlogService = (blogData) => api.post("/", blogData);

export const updateBlogService = (blogId, blogData) => api.put(`/${blogId}`, blogData);

export const deleteBlogService = (blogId) => api.delete(`/${blogId}`);

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
