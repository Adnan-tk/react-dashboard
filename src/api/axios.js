import axios from "axios";

// When proxy is disabled: use full Odoo URL (e.g. http://127.0.0.1:8076)
// When proxy enabled: use "" so requests go to same origin (Vite proxies /api and /web)
// const baseURL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8076";
// const baseURL = import.meta.env.VITE_API_BASE ?? "http://dash-analytics.febnotech.com";
const baseURL = import.meta.env.VITE_API_BASE ?? "http://13.201.55.28";
const instance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default instance;