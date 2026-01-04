// backend/routes/admin.booking.routes.js
// Routes cho admin quản lý bookings

import express from 'express';
import * as adminBookingController from '../controllers/admin.booking.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication và admin role
router.use(verifyToken);
router.use(isAdmin);

// GET /api/v1/admin/bookings/stats - Lấy thống kê bookings
router.get('/stats', adminBookingController.getBookingStats);

// GET /api/v1/admin/bookings - Lấy tất cả bookings
router.get('/', adminBookingController.getAllBookings);

// GET /api/v1/admin/bookings/:id - Lấy chi tiết booking
router.get('/:id', adminBookingController.getBookingById);

// PATCH /api/v1/admin/bookings/:id/payment - Cập nhật payment status
router.patch('/:id/payment', adminBookingController.updatePaymentStatus);

// PATCH /api/v1/admin/bookings/:id/status - Cập nhật booking status
router.patch('/:id/status', adminBookingController.updateBookingStatus);

// DELETE /api/v1/admin/bookings/:id - Xóa booking
router.delete('/:id', adminBookingController.deleteBooking);

export default router;
