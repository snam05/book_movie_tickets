// @ts-nocheck
// routes/movie.routes.js

import express from 'express';
import { 
    getMovies, 
    getMovie, 
    getNowShowing, 
    getComingSoon 
} from '../controllers/movie.controller.js';

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

export default router;
