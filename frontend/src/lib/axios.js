import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // by add this  browser send cookies to serve with every req
});

export default axiosInstance;