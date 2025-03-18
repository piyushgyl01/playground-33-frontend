import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.code === "TOKEN_EXPIRED"
    ) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication service functions
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await API.post("/auth/refresh-token");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

// OAuth helpers
export const getGoogleAuthUrl = () => {
  return `${API.defaults.baseURL}/auth/google`;
};

export const getGithubAuthUrl = () => {
  return `${API.defaults.baseURL}/auth/github`;
};

// Email verification functions
export const verifyEmail = async (token) => {
  const response = await API.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await API.post("/auth/resend-verification");
  return response.data;
};

// Password reset functions
export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await API.post("/auth/reset-password", { token, password });
  return response.data;
};

// MFA functions
export const setupMfa = async () => {
  const response = await API.post("/auth/mfa/setup");
  return response.data;
};

export const verifyMfa = async (token) => {
  const response = await API.post("/auth/mfa/verify", { token });
  return response.data;
};

export const disableMfa = async ({ password, mfaToken }) => {
  const response = await API.post("/auth/mfa/disable", { password, mfaToken });
  return response.data;
};

export default API;