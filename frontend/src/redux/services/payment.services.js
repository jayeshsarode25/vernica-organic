import axios from "axios";

const BASE_URL = "http://localhost:3006/api/payments";

const paymentApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createPaymentApi = (orderId) =>
  paymentApi.post(`/create/${orderId}`);

export const verifyPaymentApi = ({ razorpayOrderId, paymentId, signature }) =>
  paymentApi.post("/verify", { razorpayOrderId, paymentId, signature });
