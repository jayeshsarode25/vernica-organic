import axios from "axios";
import { API_URLS } from "./apiConfig";

const BASE_URL = API_URLS.orders;

const orderApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});



export const createOrderApi = (data) =>
  orderApi.post("/", data);
 
export const getMyOrdersApi = () => orderApi.get("/me");
 
export const getOrderByIdApi = (orderId) => orderApi.get(`/${orderId}`);
 
export const updateOrderAddressApi = (orderId, shippingAddress) =>
  orderApi.patch(`/${orderId}/address`, { shippingAddress });
 
export const cancelOrderApi = (orderId) => 
  orderApi.post(`/${orderId}/cancel`);
 
export const getAllOrdersApi = (params = {}) => {
  // Build query string from params
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/all_orders?${queryString}` : "/all_orders";
  return orderApi.get(url);
};
 
export const updateOrderStatusApi = (orderId, status) =>
  orderApi.patch(`/${orderId}`, { status });
 
export const getDashboardApi = () => 
  orderApi.get("/dashbord"); // Note: Keep the typo to match backend
 
