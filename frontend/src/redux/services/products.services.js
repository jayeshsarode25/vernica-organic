import axios from "axios";
import { API_URLS } from "./apiConfig";

const api = axios.create({
  baseURL: API_URLS.products,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const getProductsApi       = (params) => api.get("/", { params });
export const getSingleProductApi  = (id)     => api.get(`/${id}`);


export const getProductsByCategoryIdApi   = (categoryId, params) =>
  api.get(`/category/${categoryId}`, { params });

export const getProductsByCategorySlugApi = (slug, params) =>
  api.get(`/category-slug/${slug}`, { params });


export const createProductApi  = (data)      => api.post("/", data);
export const updateProductApi  = (id, data)  => api.patch(`/${id}`, data);
export const deleteProductApi  = (id)        => api.delete(`/${id}`);
export const countProductApi   = ()          => api.get("/count");
