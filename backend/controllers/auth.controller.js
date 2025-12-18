import { registerUser, loginUser } from '../services/auth.service.js';
import User from '../models/User.model.js'; // Đảm bảo bạn đã import Model User

// --- HÀM XỬ LÝ LỖI CHUNG ---
// Dùng để xử lý các lỗi ném ra từ Service và trả về phản hồi chuẩn 400 hoặc 500
const handleErrorResponse = (res, error) => {
    // Nếu lỗi là do Validation hoặc Duplication (do Service ném ra), trả về 400 Bad Request
    if (error.message.includes('Thiếu trường bắt buộc') || 
        error.message.includes('tồn tại') ||
        error.message.includes('không đúng')) {
        return res.status(400).json({
            message: error.message
        });
    }
    
    // Nếu là các lỗi khác (lỗi DB, lỗi server nội bộ), trả về 500 Internal Server Error
    console.error('SERVER ERROR:', error.message);
    return res.status(500).json({ 
        message: 'Đã xảy ra lỗi bên trong máy chủ',
        error: error.message
    });
};

// 1. Logic Controller Đăng ký
export const register = async (req, res) => {
    try {
        const userData = req.body;
        
        // Gọi hàm service xử lý đăng ký
        const result = await registerUser(userData);

        // Trả về 201 Created kèm theo thông tin user và token
        return res.status(201).json({
            message: 'Đăng ký thành công!',
            data: result.user,
            token: result.token
        });

    } catch (error) {
        // Xử lý và trả về phản hồi lỗi
        handleErrorResponse(res, error);
    }
};

// 2. Logic Controller Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        // Kiểm tra đầu vào tối thiểu (có thể dùng validation middleware chuyên dụng)
        if (!email || !matKhau) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp đầy đủ Email và Mật khẩu.'
            });
        }
        
        // Gọi hàm service xử lý đăng nhập
        const result = await loginUser(email, matKhau);

        // Trả về 200 OK kèm theo thông tin user và token
        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            data: result.user,
            token: result.token
        });

    } catch (error) {
        // Xử lý và trả về phản hồi lỗi
        handleErrorResponse(res, error);
    }
};

// controllers/auth.controller.js

export const verifyUser = async (req, res) => {
    try {
        // 1. Lấy ID từ req.user (do middleware verifyToken cung cấp)
        const userId = req.user.id;

        // 2. Truy vấn trực tiếp vào DB để lấy dữ liệu mới nhất
        const user = await User.findByPk(userId, {
            // Loại bỏ mật khẩu để bảo mật
            attributes: { exclude: ['matKhau'] } 
        });

        if (!user) {
            return res.status(404).json({ 
                valid: false, 
                message: "Người dùng không tồn tại" 
            });
        }

        // 3. Trả về dữ liệu "tươi" từ Database
        return res.status(200).json({
            valid: true,
            message: "Xác thực thành công",
            user: user 
        });
    } catch (error) {
        console.error("Verify Error:", error);
        return res.status(500).json({ 
            valid: false, 
            message: "Lỗi xác thực hệ thống" 
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { full_name, cccd_number } = req.body;
        const userId = req.user.id; // Lấy từ verifyToken middleware

        // 1. Tìm user trong DB
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

        // 2. Cập nhật thông tin mới
        user.full_name = full_name || user.full_name;
        user.cccd_number = cccd_number || user.cccd_number;
        
        await user.save();

        // 3. Trả về data mới để Frontend cập nhật UI mà không cần F5
        return res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            data: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                cccd_number: user.cccd_number,
                member_code: user.member_code,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

