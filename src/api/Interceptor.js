import axios from "axios";

const api = axios.create({
  baseURL: "https://younis-backend-production.up.railway.app",
});

const handleUnauthorizedError = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      handleUnauthorizedError();
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("jwt");

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
