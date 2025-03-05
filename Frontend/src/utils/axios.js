import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // No need to manually set Authorization if using cookies
        return config;
    },
    (error) => Promise.reject(error)
);


export default axiosInstance;
