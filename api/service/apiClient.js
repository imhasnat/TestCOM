// apiClient.js
import axios from "axios";

let loadingCallback = null;

export const initializeApiClient = (setLoadingFn) => {
  loadingCallback = setLoadingFn;
};

const apiClient = axios.create({
  baseURL: "http://api.byteheart.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  // Show loading spinner
  if (loadingCallback) {
    loadingCallback(true);
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // Hide loading spinner
    if (loadingCallback) {
      loadingCallback(false);
    }

    if (response.status === 204) {
      return {
        success: true,
        message: "No content",
        data: null,
      };
    }

    if (response.data?.success !== undefined) {
      return response.data;
    }

    return {
      success: true,
      data: response.data,
    };
  },
  (error) => {
    // Hide loading spinner
    if (loadingCallback) {
      loadingCallback(false);
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        success: false,
        message: "Request timed out. Please try again later.",
        data: null,
      });
    }

    const status = error.response?.status || null;

    if (error.response?.data?.type && error.response?.data?.title) {
      return Promise.reject({
        success: false,
        code: status,
        message: error.response.data.title,
        data: error.response.data,
      });
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred. Please try again.";

    return Promise.reject({
      success: false,
      code: status,
      message,
      data: error.response?.data || null,
    });
  }
);

export default apiClient;
