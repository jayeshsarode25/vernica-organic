import axios from "axios";
import { API_URLS } from "./apiConfig";

const BASE_URL = API_URLS.categories;

const categoryApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends cookies automatically — no manual token needed
});

// ─── Public Endpoints ────────────────────────────────────────────

export const fetchAllCategories = () =>
  categoryApi.get("/");

export const fetchCategoryByIdService = (id) =>
  categoryApi.get(`/${id}`);

export const fetchCategoryBySlugService = (slug) =>
  categoryApi.get(`/slug/${slug}`);

export const fetchSubCategoriesService = () =>
  categoryApi.get("/sub-categories");

// ─── Protected Endpoints (admin) ─────────────────────────────────

export const createCategoryService = (categoryData) =>
  categoryApi.post("/", categoryData);

export const updateCategoryService = (id, categoryData) =>
  categoryApi.put(`/${id}`, categoryData);

export const deleteCategoryService = (id) =>
  categoryApi.delete(`/${id}`);

export default {
  fetchAllCategories,
  fetchCategoryByIdService,
  fetchCategoryBySlugService,
  fetchSubCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
