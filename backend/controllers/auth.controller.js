// @ts-nocheck
import { registerUser, loginUser } from '../services/auth.service.js';
import User from '../models/User.model.js';
import { destroySession } from '../services/session.service.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// --- HÀM XỬ LÝ LỖI CHUNG ---
// Dùng để xử lý các lỗi ném ra từ Service và trả về phản hồi chuẩn 400 hoặc 500
const handleErrorResponse = (res, error) => {
    // Nếu lỗi là do Validation hoặc Duplication (do Service ném ra), trả về 400 Bad Request
    if (error.message.includes('Thiếu trường bắt buộc') || 
        error.message.includes('tồn tại') ||
        error.message.includes('không đúng') ||
        error.message.includes('vô hiệu hóa')) {
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
        
        // Lấy thông tin IP và User Agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        
        // Gọi hàm service xử lý đăng ký
        const result = await registerUser(userData, ipAddress, userAgent);

        // Set cookie với session token (giống login)
        res.cookie('session_token', result.sessionToken, {
            httpOnly: true, // Không thể truy cập từ JavaScript (bảo mật)
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong production
            sameSite: 'lax', // Bảo vệ CSRF
            expires: new Date(result.expiresAt),
            path: '/'
        });

        // Trả về 201 Created - CHỈ thông tin user, KHÔNG trả token
        return res.status(201).json({
            message: 'Đăng ký thành công!',
            data: result.user
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
        
        // Lấy thông tin IP và User Agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        
        // Gọi hàm service xử lý đăng nhập
        const result = await loginUser(email, matKhau, ipAddress, userAgent);

        // Set cookie với session token
        res.cookie('session_token', result.sessionToken, {
            httpOnly: true, // Không thể truy cập từ JavaScript (bảo mật)
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong production
            sameSite: 'lax', // Bảo vệ CSRF
            expires: new Date(result.expiresAt),
            path: '/'
        });

        // Trả về 200 OK - CHỈ thông tin user, KHÔNG trả token
        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            data: result.user
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
        const { full_name, cccd_number, phone_number } = req.body;
        const userId = req.user.id; // Lấy từ verifyToken middleware

        // 1. Tìm user trong DB
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

        // 2. Kiểm tra CCCD trùng lặp (nếu có thay đổi)
        if (cccd_number && cccd_number !== user.cccd_number) {
            const existingCccd = await User.findOne({ 
                where: { 
                    cccd_number,
                    id: { [Op.ne]: userId }
                } 
            });
            if (existingCccd) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Số CCCD đã được sử dụng bởi người dùng khác" 
                });
            }
        }

        // 3. Kiểm tra số điện thoại trùng lặp (nếu có thay đổi)
        if (phone_number && phone_number !== user.phone_number) {
            const existingPhone = await User.findOne({ 
                where: { 
                    phone_number,
                    id: { [Op.ne]: userId }
                } 
            });
            if (existingPhone) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Số điện thoại đã được sử dụng bởi người dùng khác" 
                });
            }
        }

        // 4. Cập nhật thông tin mới
        user.full_name = full_name || user.full_name;
        user.cccd_number = cccd_number || user.cccd_number;
        if (phone_number !== undefined) user.phone_number = phone_number;
        
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
                phone_number: user.phone_number,
                date_of_birth: user.date_of_birth,
                member_code: user.member_code,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi cập nhật thông tin" 
        });
    }
};

// 4. Logout - Xóa session
export const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;
        const userId = req.user?.id;
        
        if (!sessionToken) {
            return res.status(400).json({
                message: 'Không tìm thấy session'
            });
        }

        // Xóa session trong database
        await destroySession(sessionToken);

        // Xóa cookie
        res.clearCookie('session_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json({
            message: 'Đăng xuất thành công!',
            data: {
                id: userId
            }
        });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            message: 'Lỗi khi đăng xuất',
            error: error.message
        });
    }
};

// 5. Change Password - Đổi mật khẩu
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới'
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
            });
        }

        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
            });
        }

        // Get user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Update password (model's beforeUpdate hook will hash it automatically)
        await user.update({ password_hash: newPassword });

        return res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({
            message: 'Lỗi khi đổi mật khẩu',
            error: error.message
        });
    }
};

