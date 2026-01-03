// @ts-nocheck
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export const getUserProfile = async () => {
    const response = await axios.get(`${API_URL}/verify`, {
        withCredentials: true, // Gửi cookie session_token tự động
    });
    
    // Trả về object user từ backend { id, email, full_name, cccd_number, ... }
    return response.data.user; 
};