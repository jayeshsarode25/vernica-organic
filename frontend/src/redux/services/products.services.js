import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3002/api/products",
    withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const getProductsApi = (params) => api.get("/", {params});
export const getSingleProductApi = (id) => api.get(`${id}`);
export const createProductApi = (data) => api.post("/", data);
export const updateProductApi = (id, data) => api.patch(`${id}`, data);
export const deleteProductApi = (id) => api.delete(`${id}`);
export const countProductApi = () => api.get("/count");