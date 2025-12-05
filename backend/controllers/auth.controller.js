import { registerUser, loginUser } from '../services/auth.service.js';

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