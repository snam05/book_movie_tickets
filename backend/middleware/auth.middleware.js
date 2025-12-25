// @ts-nocheck
import jwt from 'jsonwebtoken';
import { verifySession } from '../services/session.service.js';

/**
 * Middleware xác thực Session Token từ Cookie (Ưu tiên)
 */
export const verifyToken = async (req, res, next) => {
    console.log("\x1b[36m%s\x1b[0m", `[Auth Middleware] Checking: ${req.method} ${req.originalUrl}`);

    // 1. Kiểm tra session token trong cookie trước
    const sessionToken = req.cookies?.session_token;
    
    if (sessionToken) {
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
            }
        } catch (error) {
            console.error('[Auth Middleware] Session Error:', error);
        }
    }

    // 2. Fallback: Kiểm tra JWT token từ header (backward compatibility)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("\x1b[31m%s\x1b[0m", `[Auth Middleware] Từ chối: Không tìm thấy Token hoặc Session!`);
        return res.status(403).json({ 
            message: "Quyền truy cập bị từ chối. Bạn cần đăng nhập!" 
        });
    }

    // 3. So khớp Token với JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("\x1b[31m%s\x1b[0m", `[Auth Middleware] Thất bại: Token sai hoặc hết hạn!`);
            return res.status(401).json({ 
                message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!" 
            });
        }

        // 4. Nếu khớp -> Giải mã thông tin và gắn vào req.user
        req.user = decoded;
        
        console.log("\x1b[32m%s\x1b[0m", `[Auth Middleware] JWT Valid: User ID ${decoded.id}`);
        next();
    });
};

/**
 * Middleware phân quyền Admin (Dùng sau verifyToken)
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log("\x1b[33m%s\x1b[0m", `[Auth Middleware] Cảnh báo: User ${req.user.id} cố gắng vào trang Admin!`);
        return res.status(403).json({ 
            message: "Bạn không có quyền quản trị để thực hiện hành động này!" 
        });
    }
};