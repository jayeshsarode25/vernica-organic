import axios from "axios";

export const authAPI = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const sendSignupOtpApi = (data) => authAPI.post("/signup-phone", data);
export const verifySignupOtpApi = (data) =>
  authAPI.post("/verify-phone-otp", data);
export const sendLoginOtpApi = (phone) =>
  authAPI.post("/login-phone", { phone });
export const verifyLoginOtpApi = (phone, otp) =>
  authAPI.post("/verify-login-otp", { phone, otp });
export const getMeApi = () => authAPI.get("/me");


export const getUsersApi = () => authAPI.get("/users");
export const getUserCountApi = () => authAPI.get("/count");
export const deleteUserApi = (id) => authAPI.delete(`/users/${id}`);
export const blockUserApi = (id) => authAPI.patch(`/users/${id}/block`);
