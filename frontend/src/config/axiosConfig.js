import axios from "axios";
import { HOST } from "@env";

console.log("HOSST: ", HOST);

// Tạo instance riêng
const api = axios.create({
    baseURL: HOST,
    timeout: 10000, // 10 giây
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor (gắn token trước khi gửi request)
api.interceptors.request.use(
    async (config) => {
        // Ví dụ token lưu trong AsyncStorage (React Native)
        // hoặc localStorage (ReactJS)
        const token = null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (xử lý lỗi)
api.interceptors.response.use(
    (response) => response.data, // chỉ trả về data
    (error) => {
        if (error.response) {
            // Lỗi từ server trả về
            if (error.response.status === 401) {
                console.warn("Token hết hạn hoặc không hợp lệ");
                // Có thể logout hoặc refresh token ở đây
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Không nhận được phản hồi từ server
            console.error("Không nhận phản hồi từ server:", error.request);
        } else {
            // Lỗi khác
            console.error("Axios error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
