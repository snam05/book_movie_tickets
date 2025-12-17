import jwt from 'jsonwebtoken';

/**
 * Middleware xác thực Token (Người gác cổng chính)
 */
export const verifyToken = (req, res, next) => {
    // 1. Lấy token từ Header (Bearer Token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("\x1b[36m%s\x1b[0m", `[Auth Middleware] Checking: ${req.method} ${req.originalUrl}`);

    // 2. Nếu không có token -> Chặn ngay lập tức
    if (!token) {
        console.log("\x1b[31m%s\x1b[0m", `[Auth Middleware] Từ chối: Không tìm thấy Token!`);
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
        // decoded lúc này sẽ chứa { id, role, email } từ lúc bạn ký token khi login
        req.user = decoded;
        
        console.log("\x1b[32m%s\x1b[0m", `[Auth Middleware] Thành công: User ID ${decoded.id} đang truy cập.`);
        next(); // Cho phép đi tiếp vào Controller
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