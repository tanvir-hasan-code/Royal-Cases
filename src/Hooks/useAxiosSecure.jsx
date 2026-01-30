import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  axiosInstance.interceptors.request.use((config) => {
    return config;
  });

  return axiosInstance;
};

export default useAxiosSecure;
