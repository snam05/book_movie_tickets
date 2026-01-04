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
    
    if (!['customer', 'admin'].includes(role)) {
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
    const regularUsers = await User.count({ where: { role: 'customer' } });
    
    return {
        total: totalUsers,
        admins: adminUsers,
        users: regularUsers
    };
};

/**
 * Tạo user mới (Admin only)
 */
export const createUser = async (userData) => {
    const { email, password, full_name, phone_number, cccd_number, date_of_birth, gender, role = 'customer' } = userData;
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }
    
    // Kiểm tra CCCD đã tồn tại
    if (cccd_number) {
        const existingCCCD = await User.findOne({ where: { cccd_number } });
        if (existingCCCD) {
            throw new Error('Số CCCD đã được sử dụng');
        }
    }
    
    // Tạo member_code tự động
    const userCount = await User.count();
    const member_code = `MEM${String(userCount + 1).padStart(6, '0')}`;
    
    // Tạo user mới
    const newUser = await User.create({
        email,
        password_hash: password, // Model sẽ tự động hash
        full_name,
        phone_number,
        cccd_number,
        date_of_birth,
        gender,
        member_code,
        role,
        created_at: new Date(),
        updated_at: new Date()
    });
    
    return {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        cccd_number: newUser.cccd_number,
        date_of_birth: newUser.date_of_birth,
        gender: newUser.gender,
        member_code: newUser.member_code,
        role: newUser.role,
        created_at: newUser.created_at
    };
};

/**
 * Cập nhật thông tin user (Admin only)
 */
export const updateUser = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    
    // Kiểm tra email nếu có thay đổi
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ 
            where: { 
                email: updateData.email,
                id: { [Op.ne]: userId }
            } 
        });
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }
        user.email = updateData.email;
    }
    
    // Kiểm tra CCCD nếu có thay đổi
    if (updateData.cccd_number && updateData.cccd_number !== user.cccd_number) {
        const existingCCCD = await User.findOne({ 
            where: { 
                cccd_number: updateData.cccd_number,
                id: { [Op.ne]: userId }
            } 
        });
        if (existingCCCD) {
            throw new Error('Số CCCD đã được sử dụng');
        }
        user.cccd_number = updateData.cccd_number;
    }
    
    // Cập nhật các trường khác
    if (updateData.full_name) user.full_name = updateData.full_name;
    if (updateData.phone_number !== undefined) user.phone_number = updateData.phone_number;
    if (updateData.date_of_birth !== undefined) user.date_of_birth = updateData.date_of_birth;
    if (updateData.gender !== undefined) user.gender = updateData.gender;
    
    user.updated_at = new Date();
    await user.save();
    
    return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        cccd_number: user.cccd_number,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        member_code: user.member_code,
        role: user.role,
        updated_at: user.updated_at
    };
};

/**
 * Đặt mật khẩu mới cho user (Admin only)
 */
export const setUserPassword = async (userId, newPassword) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    
    user.password_hash = newPassword; // Model sẽ tự động hash
    user.updated_at = new Date();
    await user.save();
    
    return { message: 'Đã cập nhật mật khẩu thành công' };
};
