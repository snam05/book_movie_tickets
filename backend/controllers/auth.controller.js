// controllers/auth.controller.js

import * as authService from '../services/auth.service.js'; // Import tất cả hàm từ service

// Hàm xử lý logic Đăng ký (Register)
export const register = async (req, res) => {
    try {
        const userData = req.body;

        // 1. Kiểm tra dữ liệu đầu vào cơ bản
        if (!userData.email || !userData.matKhau || !userData.cccd_number) {
            return res.status(400).json({ 
                message: 'Vui lòng cung cấp đầy đủ Email, Mật khẩu và Số CCCD.' 
            });
        }
        
        // 2. Gọi logic nghiệp vụ (Service Layer)
        const newUserInfo = await authService.registerUser(userData);

        // 3. Trả về phản hồi thành công
        return res.status(201).json({
            message: 'Đăng ký thành công! Vui lòng đăng nhập.',
            user: newUserInfo // Thông tin người dùng đã được lọc
        });

    } catch (error) {
        // Xử lý lỗi từ Service (ví dụ: Email đã tồn tại)
        if (error.message.includes('Email đã tồn tại') || error.message.includes('Số CCCD đã được đăng ký')) {
            return res.status(409).json({ // Mã 409 Conflict
                message: error.message 
            });
        }

        console.error('Lỗi khi đăng ký:', error);
        return res.status(500).json({ 
            message: 'Đã xảy ra lỗi hệ thống trong quá trình đăng ký.' 
        });
    }
};

// Hàm xử lý logic Đăng nhập (Login) - Sẽ được thêm code sau
export const login = async (req, res) => {
    return res.status(501).json({ message: 'Tính năng đăng nhập chưa được triển khai.' });
};