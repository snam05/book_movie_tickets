import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true // Tự động gửi cookie với mọi request
});

// Interceptor để xử lý lỗi tài khoản bị vô hiệu hóa
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Kiểm tra nếu là lỗi 403 và message chứa "vô hiệu hóa"
        if (error.response?.status === 403 && 
            error.response?.data?.message?.includes('vô hiệu hóa')) {
            
            // Hiển thị alert cho người dùng
            alert('⚠️ ' + error.response.data.message);
            
            // Xóa cookie session (nếu có)
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Chuyển hướng về trang đăng nhập
            window.location.href = '/auth/signin';
        }
        
        return Promise.reject(error);
    }
);

export default api;