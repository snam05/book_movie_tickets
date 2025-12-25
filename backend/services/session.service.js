// @ts-nocheck
// services/session.service.js

import crypto from 'crypto';
import Session from '../models/Session.model.js';
import { Op } from 'sequelize';

// Hàm tạo session token ngẫu nhiên
const generateSessionToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Tạo session mới cho user
export const createSession = async (userId, ipAddress, userAgent, expiresInDays = 7) => {
    try {
        // Xóa tất cả session cũ của user (đảm bảo chỉ đăng nhập 1 nơi)
        await Session.destroy({ where: { user_id: userId } });

        // Tạo session token mới
        const sessionToken = generateSessionToken();
        
        // Tính thời gian hết hạn
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        // Tạo session mới trong database
        const session = await Session.create({
            user_id: userId,
            session_token: sessionToken,
            ip_address: ipAddress,
            user_agent: userAgent,
            expires_at: expiresAt
        });

        return {
            sessionToken,
            expiresAt
        };
    } catch (error) {
        console.error('Create Session Error:', error);
        throw new Error('Không thể tạo phiên đăng nhập');
    }
};

// Xác thực session token
export const verifySession = async (sessionToken) => {
    try {
        const session = await Session.findOne({
            where: { session_token: sessionToken }
        });

        if (!session) {
            return { valid: false, message: 'Session không tồn tại' };
        }

        // Kiểm tra session có hết hạn chưa
        const now = new Date();
        if (now > new Date(session.expires_at)) {
            // Xóa session hết hạn
            await Session.destroy({ where: { session_id: session.session_id } });
            return { valid: false, message: 'Session đã hết hạn' };
        }

        // Cập nhật thời gian hoạt động cuối cùng
        await Session.update(
            { last_activity: new Date() },
            { where: { session_id: session.session_id } }
        );

        return {
            valid: true,
            userId: session.user_id,
            session
        };
    } catch (error) {
        console.error('Verify Session Error:', error);
        throw new Error('Không thể xác thực session');
    }
};

// Xóa session (đăng xuất)
export const destroySession = async (sessionToken) => {
    try {
        const result = await Session.destroy({
            where: { session_token: sessionToken }
        });
        return result > 0;
    } catch (error) {
        console.error('Destroy Session Error:', error);
        throw new Error('Không thể xóa session');
    }
};

// Xóa tất cả session của user
export const destroyAllUserSessions = async (userId) => {
    try {
        const result = await Session.destroy({
            where: { user_id: userId }
        });
        return result;
    } catch (error) {
        console.error('Destroy All Sessions Error:', error);
        throw new Error('Không thể xóa tất cả session');
    }
};

// Dọn dẹp session hết hạn
export const cleanupExpiredSessions = async () => {
    try {
        const result = await Session.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                }
            }
        });
        return result;
    } catch (error) {
        console.error('Cleanup Sessions Error:', error);
        throw new Error('Không thể dọn dẹp session');
    }
};
