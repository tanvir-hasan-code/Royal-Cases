import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://royalcases-server.vercel.app",
});

const useAxiosSecure = () => {
  axiosInstance.interceptors.request.use((config) => {
    return config;
  });

  return axiosInstance;
};

export default useAxiosSecure;
