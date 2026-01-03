// backend/controllers/admin.user.controller.js

import * as adminUserService from '../services/admin.user.service.js';

/**
 * Lấy danh sách tất cả users (Admin only)
 * GET /api/v1/admin/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        
        const filters = {};
        if (role) filters.role = role;
        if (search) filters.search = search;
        
        const users = await adminUserService.getAllUsers(filters);
        
        res.status(200).json({
            message: 'Lấy danh sách người dùng thành công',
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết một user (Admin only)
 * GET /api/v1/admin/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await adminUserService.getUserById(id);
        
        res.status(200).json({
            message: 'Lấy thông tin người dùng thành công',
            data: user
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            res.status(404).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi lấy thông tin người dùng',
                error: error.message
            });
        }
    }
};

/**
 * Cập nhật role user (Admin only)
 * PATCH /api/v1/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (!role) {
            return res.status(400).json({
                message: 'Thiếu thông tin role'
            });
        }
        
        const updatedUser = await adminUserService.updateUserRole(id, role);
        
        res.status(200).json({
            message: 'Cập nhật role người dùng thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error in updateUserRole:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Role không hợp lệ') {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi cập nhật role người dùng',
                error: error.message
            });
        }
    }
};

/**
 * Xóa user (Admin only)
 * DELETE /api/v1/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminUserService.deleteUser(id);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteUser:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            res.status(404).json({
                message: error.message
            });
        } else if (error.message.includes('admin cuối cùng')) {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi xóa người dùng',
                error: error.message
            });
        }
    }
};

/**
 * Lấy thống kê users (Admin only)
 * GET /api/v1/admin/users/stats
 */
export const getUserStats = async (req, res) => {
    try {
        const stats = await adminUserService.getUserStats();
        
        res.status(200).json({
            message: 'Lấy thống kê người dùng thành công',
            data: stats
        });
    } catch (error) {
        console.error('Error in getUserStats:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy thống kê người dùng',
            error: error.message
        });
    }
};
