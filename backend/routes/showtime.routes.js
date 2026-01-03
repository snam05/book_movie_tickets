// routes/showtime.routes.js
import express from 'express';
import { getShowtimes, getShowtime } from '../controllers/showtime.controller.js';

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

export default router;
