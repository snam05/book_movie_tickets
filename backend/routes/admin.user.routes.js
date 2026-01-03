// backend/routes/admin.user.routes.js

import express from 'express';
import * as adminUserController from '../controllers/admin.user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(verifyToken, isAdmin);

// GET /api/v1/admin/users/stats - Thống kê users
router.get('/stats', adminUserController.getUserStats);

// GET /api/v1/admin/users - Lấy tất cả users
router.get('/', adminUserController.getAllUsers);

// GET /api/v1/admin/users/:id - Lấy chi tiết user
router.get('/:id', adminUserController.getUserById);

// PATCH /api/v1/admin/users/:id/role - Cập nhật role
router.patch('/:id/role', adminUserController.updateUserRole);

// DELETE /api/v1/admin/users/:id - Xóa user
router.delete('/:id', adminUserController.deleteUser);

export default router;
