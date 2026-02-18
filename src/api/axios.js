import axios from "axios";
import store from "../redux/store";
import { setError } from "../redux/errorSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response || error.response.status >= 500) {
      store.dispatch(
        setError({
          title: "Server Error",
          message: "Something went wrong. Please try again later.",
          code: error.response?.status || 500,
        })
      );

      window.location.href = "/error";
    }

    return Promise.reject(error);
  }
);

export default api;
