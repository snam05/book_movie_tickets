// @ts-nocheck
// routes/movie.routes.js

import express from 'express';
import { 
    getMovies, 
    getMovie, 
    getNowShowing, 
    getComingSoon,
    createNewMovie,
    updateExistingMovie,
    deleteExistingMovie
} from '../controllers/movie.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/movies
 * @desc    Lấy danh sách tất cả phim (có thể filter)
 * @access  Public
 * @query   status, genre, search, limit, offset
 */
router.get('/', getMovies);

/**
 * @route   GET /api/v1/movies/now-showing
 * @desc    Lấy danh sách phim đang chiếu
 * @access  Public
 */
router.get('/now-showing', getNowShowing);

/**
 * @route   GET /api/v1/movies/coming-soon
 * @desc    Lấy danh sách phim sắp chiếu
 * @access  Public
 */
router.get('/coming-soon', getComingSoon);

/**
 * @route   GET /api/v1/movies/:id
 * @desc    Lấy chi tiết một phim theo ID
 * @access  Public
 */
router.get('/:id', getMovie);

/**
 * @route   POST /api/v1/movies
 * @desc    Tạo phim mới
 * @access  Admin only
 * @body    title, description, duration, release_date, director, actors, rating, age_rating, status, genres[]
 * @file    poster (optional)
 */
router.post('/', verifyToken, upload.single('poster'), createNewMovie);

/**
 * @route   PUT /api/v1/movies/:id
 * @desc    Cập nhật phim
 * @access  Admin only
 * @body    Các trường muốn cập nhật
 * @file    poster (optional)
 */
router.put('/:id', verifyToken, upload.single('poster'), updateExistingMovie);

/**
 * @route   DELETE /api/v1/movies/:id
 * @desc    Xóa phim
 * @access  Admin only
 */
router.delete('/:id', verifyToken, deleteExistingMovie);

export default router;