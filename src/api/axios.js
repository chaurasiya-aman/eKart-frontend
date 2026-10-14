import axios from "axios";
import store from "../redux/store";
import { setError } from "../redux/errorSlice";
import { requestFinished, requestStarted } from "../redux/loadingSlice";
import { getErrorMessage } from "../utils/getErrorMessage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (!config.showGlobalLoading) return config;

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
    const isServerError = status >= 500;
    const isRateLimited = status === 429;

    if (!error.response || isServerError || isRateLimited) {
      const title = !error.response
        ? "Connection problem"
        : isRateLimited
          ? "Please slow down"
          : "We couldn't complete that request";
      const message = getErrorMessage(error, "The service could not complete your request. Please try again shortly.");

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
