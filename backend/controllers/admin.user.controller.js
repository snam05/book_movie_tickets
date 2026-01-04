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
        const user = await adminUserService.getUserById(parseInt(id));
        
        res.status(200).json({
            message: 'Lấy thông tin người dùng thành công',
            data: user
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            return res.status(404).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
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

        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Role không hợp lệ. Chỉ chấp nhận: customer, admin'
            });
        }
        
        const updatedUser = await adminUserService.updateUserRole(parseInt(id), role, req.user.id);
        
        res.status(200).json({
            message: 'Cập nhật role người dùng thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error in updateUserRole:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            return res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Role không hợp lệ' || error.message === 'Không thể hạ quyền của chính bạn') {
            return res.status(400).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
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
        const result = await adminUserService.deleteUser(parseInt(id), req.user.id);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteUser:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            return res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Không thể xóa admin cuối cùng trong hệ thống' || 
                   error.message === 'Không thể xóa tài khoản của chính bạn') {
            return res.status(400).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
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

/**
 * Tạo user mới (Admin only)
 * POST /api/v1/admin/users
 */
export const createUser = async (req, res) => {
    try {
        const { email, password, full_name, phone_number, cccd_number, date_of_birth, gender, role } = req.body;
        
        // Validate required fields
        if (!email || !password || !full_name || !cccd_number) {
            return res.status(400).json({
                message: 'Thiếu thông tin bắt buộc: email, password, full_name, cccd_number'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Email không hợp lệ'
            });
        }
        
        // Validate password: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                message: 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)'
            });
        }
        
        const newUser = await adminUserService.createUser({
            email,
            password,
            full_name,
            phone_number,
            cccd_number,
            date_of_birth,
            gender,
            role
        });
        
        res.status(201).json({
            message: 'Tạo người dùng mới thành công',
            data: newUser
        });
    } catch (error) {
        console.error('Error in createUser:', error);
        if (error.message === 'Email đã được sử dụng' || error.message === 'Số CCCD đã được sử dụng') {
            return res.status(409).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
                message: 'Lỗi khi tạo người dùng mới',
                error: error.message
            });
        }
    }
};

/**
 * Cập nhật thông tin user (Admin only)
 * PUT /api/v1/admin/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Validate email format if provided
        if (updateData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.email)) {
                return res.status(400).json({
                    message: 'Email không hợp lệ'
                });
            }
        }
        
        const updatedUser = await adminUserService.updateUser(parseInt(id), updateData);
        
        res.status(200).json({
            message: 'Cập nhật thông tin người dùng thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            return res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Email đã được sử dụng' || error.message === 'Số CCCD đã được sử dụng') {
            return res.status(409).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
                message: 'Lỗi khi cập nhật thông tin người dùng',
                error: error.message
            });
        }
    }
};

/**
 * Đặt mật khẩu mới cho user (Admin only)
 * POST /api/v1/admin/users/:id/password
 */
export const setUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                message: 'Thiếu thông tin mật khẩu mới'
            });
        }
        
        // Validate password: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                message: 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)'
            });
        }
        
        const result = await adminUserService.setUserPassword(parseInt(id), password);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in setUserPassword:', error);
        if (error.message === 'Không tìm thấy người dùng') {
            return res.status(404).json({
                message: error.message
            });
        } else {
            return res.status(500).json({
                message: 'Lỗi khi đặt mật khẩu mới',
                error: error.message
            });
        }
    }
};
