import axios from "axios";

const BASE_URL = "http://localhost:3004/api/orders";

const orderApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});



export const createOrderApi = (shippingAddress) =>
  orderApi.post("/", { shippingAddress });

export const getMyOrdersApi = () => orderApi.get("/me");

export const getOrderByIdApi = (orderId) => orderApi.get(`/${orderId}`);

export const updateOrderAddressApi = (orderId, shippingAddress) =>
  orderApi.patch(`/${orderId}/address`, { shippingAddress });

export const cancelOrderApi = (orderId) => orderApi.post(`/${orderId}/cancel`);

export const getAllOrdersApi = () => orderApi.get("/all_orders");

export const updateOrderStatusApi = (orderId, status) =>
  orderApi.patch(`/${orderId}`, { status });

export const getDashboardApi = () => orderApi.get("/dashbord");
