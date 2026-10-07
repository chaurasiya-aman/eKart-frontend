import axios from "axios";
import store from "../redux/store";
import { setError } from "../redux/errorSlice";
import { requestFinished, requestStarted } from "../redux/loadingSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.__globalLoadingTracked = true;
  store.dispatch(requestStarted());
  return config;
});

const finishGlobalLoading = (config) => {
  if (!config?.__globalLoadingTracked) return;
  config.__globalLoadingTracked = false;
  store.dispatch(requestFinished());
};

api.interceptors.response.use(
  (response) => {
    finishGlobalLoading(response.config);
    return response;
  },

  (error) => {
    finishGlobalLoading(error.config);
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const isNetworkError = !error.response;
    const isServerError = status >= 500;
    const isRateLimited = status === 429;

    if (isNetworkError || isServerError || isRateLimited) {
      const title = isNetworkError
        ? "Connection problem"
        : isRateLimited
          ? "Please slow down"
          : "Service temporarily unavailable";
      const message = isNetworkError
        ? "We couldn't reach the server. Check your connection and try again."
        : isRateLimited
          ? "Too many requests were made. Please wait a moment and try again."
          : "We're having trouble completing your request. Please try again shortly.";

      error.globalHandled = true;
      store.dispatch(
        setError({
          title,
          message,
          code: status || null,
        }),
      );
    }

    return Promise.reject(error);
  }
);

export default api;
