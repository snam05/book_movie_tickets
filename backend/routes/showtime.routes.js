// routes/showtime.routes.js
import express from 'express';
import { getShowtimes, getShowtime, createShowtimeHandler, updateShowtimeHandler, deleteShowtimeHandler } from '../controllers/showtime.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/showtimes
 * @desc    Lấy danh sách tất cả suất chiếu
 * @access  Public
 */
router.get('/', getShowtimes);

/**
 * @route   GET /api/v1/showtimes/:id
 * @desc    Lấy thông tin chi tiết suất chiếu
 * @access  Public
 */
router.get('/:id', getShowtime);

/**
 * @route   POST /api/v1/admin/showtimes
 * @desc    Tạo lịch chiếu mới
 * @access  Admin only
 */
router.post('/', verifyToken, isAdmin, createShowtimeHandler);

/**
 * @route   PUT /api/v1/admin/showtimes/:id
 * @desc    Cập nhật lịch chiếu
 * @access  Admin only
 */
router.put('/:id', verifyToken, isAdmin, updateShowtimeHandler);

/**
 * @route   DELETE /api/v1/admin/showtimes/:id
 * @desc    Xóa lịch chiếu
 * @access  Admin only
 */
router.delete('/:id', verifyToken, isAdmin, deleteShowtimeHandler);

export default router;
