import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors if we were previously logged in
    // This prevents redirecting during login failures
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // Only redirect if there was a token/user (meaning user was logged in)
      if (token || user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      // If no token/user, it's a login failure - let the login page handle it
    }
    return Promise.reject(error);
  }
);

export default api;
