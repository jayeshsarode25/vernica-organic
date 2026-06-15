import axios from "axios";
import { API_URLS } from "./apiConfig";

const BASE_URL = API_URLS.payments;

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
