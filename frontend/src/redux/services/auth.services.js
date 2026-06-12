import axios from "axios";

export const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/auth";

export const authAPI = axios.create({
  baseURL: AUTH_API_BASE_URL,
  withCredentials: true,
});

export const sendSignupOtpApi = (data) => authAPI.post("/signup-phone", data);
export const verifySignupOtpApi = (data) =>
  authAPI.post("/verify-phone-otp", data);
export const sendLoginOtpApi = (phone) =>
  authAPI.post("/login-phone", { phone });
export const verifyLoginOtpApi = (phone, otp) =>
  authAPI.post("/verify-login-otp", { phone, otp });
export const resendOtpApi = (data) => authAPI.post("/resend-otp", data);
export const getMeApi = () => authAPI.get("/me");
export const getGoogleOAuthUrl = () => `${AUTH_API_BASE_URL}/google`;


export const getUsersApi = () => authAPI.get("/users");
export const getUserCountApi = () => authAPI.get("/count");
export const deleteUserApi = (id) => authAPI.delete(`/users/${id}`);
export const blockUserApi = (id) => authAPI.patch(`/users/${id}/block`);
