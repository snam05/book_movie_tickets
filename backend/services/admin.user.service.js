// backend/services/admin.user.service.js
// Service cho admin quản lý users

import User from '../models/User.model.js';
import { Op } from 'sequelize';

/**
 * Lấy tất cả users (Admin only)
 */
export const getAllUsers = async (filters = {}) => {
    const whereClause = {};
    
    // Filter theo role
    if (filters.role) {
        whereClause.role = filters.role;
    }
    
    // Tìm kiếm theo email hoặc tên
    if (filters.search) {
        whereClause[Op.or] = [
            { email: { [Op.like]: `%${filters.search}%` } },
            { full_name: { [Op.like]: `%${filters.search}%` } },
            { member_code: { [Op.like]: `%${filters.search}%` } }
        ];
    }
    
    const users = await User.findAll({
        where: whereClause,
        attributes: { exclude: ['password_hash'] }, // Không trả về password
        order: [['created_at', 'DESC']]
    });
    
    return users;
};

/**
 * Lấy thông tin chi tiết user (Admin only)
 */
export const getUserById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    
    return user;
};

/**
 * Cập nhật role user (Admin only)
 */
export const updateUserRole = async (userId, role) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    
    if (!['user', 'admin'].includes(role)) {
        throw new Error('Role không hợp lệ');
    }
    
    user.role = role;
    user.updated_at = new Date();
    await user.save();
    
    return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
    };
};

/**
 * Xóa user (Admin only)
 */
export const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    
    // Không cho phép xóa admin cuối cùng
    if (user.role === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
            throw new Error('Không thể xóa admin cuối cùng trong hệ thống');
        }
    }
    
    await user.destroy();
    
    return { message: 'Đã xóa người dùng thành công' };
};

/**
 * Lấy thống kê users
 */
export const getUserStats = async () => {
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { role: 'admin' } });
    const regularUsers = await User.count({ where: { role: 'user' } });
    
    return {
        total: totalUsers,
        admins: adminUsers,
        users: regularUsers
    };
};
