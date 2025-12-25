// @ts-nocheck
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export const getUserProfile = async () => {
    // Lấy token từ localStorage (đã lưu khi đăng nhập)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) throw new Error("Chưa đăng nhập");

    const response = await axios.get(`${API_URL}/verify`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    // Trả về object user từ backend { id, email, full_name, cccd_number, ... }
    return response.data.user; 
};