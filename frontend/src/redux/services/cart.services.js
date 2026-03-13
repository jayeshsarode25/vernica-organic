import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003/api/cart",
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
