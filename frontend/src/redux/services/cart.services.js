import axios from "axios";
import { API_URLS } from "./apiConfig";

const api = axios.create({
  baseURL: API_URLS.cart,
  withCredentials: true,
});



export const getCartApi = () => api.get("/");

export const addItemToCartApi = (productId, qty) =>
  api.post("/items", { productId, qty });

export const updateItemQuantityApi = (productId, qty) =>
  api.patch(`/items/${productId}`, { qty });

export const removeItemFromCartApi = (productId) =>
  api.delete(`/items/${productId}`);

export const clearCartApi = () => api.delete("/");
