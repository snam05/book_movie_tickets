// routes/booking.routes.js

import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(verifyToken);

// GET /api/v1/bookings - Lấy tất cả bookings của user
router.get('/', bookingController.getMyBookings);

// GET /api/v1/bookings/:id - Lấy chi tiết booking
router.get('/:id', bookingController.getBookingDetail);

// PUT /api/v1/bookings/:id/cancel - Hủy booking
router.put('/:id/cancel', bookingController.cancelBookingById);

export default router;
