// @ts-nocheck
import { verifySession } from '../services/session.service.js';

/**
 * Middleware xác thực Session Token từ Cookie
 */
export const verifyToken = async (req, res, next) => {
    console.log("\x1b[36m%s\x1b[0m", `[Auth Middleware] Checking: ${req.method} ${req.originalUrl}`);

    // Kiểm tra session token trong cookie
    const sessionToken = req.cookies?.session_token;
    
    if (!sessionToken) {
        console.log("\x1b[31m%s\x1b[0m", `[Auth Middleware] Từ chối: Không tìm thấy Session Token!`);
        return res.status(403).json({ 
            message: "Quyền truy cập bị từ chối. Bạn cần đăng nhập!" 
        });
    }

    try {
        // Xác thực session token
        const sessionResult = await verifySession(sessionToken);
        
        if (sessionResult.valid) {
            // Lấy thông tin user từ session
            req.user = {
                id: sessionResult.userId,
                sessionId: sessionResult.session.session_id
            };
            console.log("\x1b[32m%s\x1b[0m", `[Auth Middleware] Session Valid: User ID ${sessionResult.userId}`);
            return next();
        } else {
            console.log("\x1b[31m%s\x1b[0m", `[Auth Middleware] Session Invalid: ${sessionResult.message}`);
            // Xóa cookie không hợp lệ
            res.clearCookie('session_token');
            return res.status(401).json({ 
                message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!" 
            });
        }
    } catch (error) {
        console.error('[Auth Middleware] Session Error:', error);
        return res.status(500).json({ 
            message: "Lỗi xác thực phiên đăng nhập" 
        });
    }
};

/**
 * Middleware phân quyền Admin (Dùng sau verifyToken)
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log("\x1b[33m%s\x1b[0m", `[Auth Middleware] Cảnh báo: User ${req.user?.id || 'unknown'} cố gắng vào trang Admin!`);
        return res.status(403).json({ 
            message: "Bạn không có quyền quản trị để thực hiện hành động này!" 
        });
    }
};