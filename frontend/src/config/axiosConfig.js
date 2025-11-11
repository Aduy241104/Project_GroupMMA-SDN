import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOST } from "@env";

console.log("HOST: ", HOST);

// Tạo instance riêng
const api = axios.create({
    // baseURL: "http://192.168.1.248:8080",
    baseURL: HOST,
    timeout: 10000, // 10 giây
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: gắn token từ AsyncStorage
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token"); // key lưu token trong AsyncStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.error("Lấy token từ AsyncStorage lỗi:", err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi
api.interceptors.response.use(
    (response) => response.data, // chỉ trả về data
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("Token hết hạn hoặc không hợp lệ");
                // Có thể logout hoặc refresh token ở đây
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error("Không nhận phản hồi từ server:", error.request);
        } else {
            console.error("Axios error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
