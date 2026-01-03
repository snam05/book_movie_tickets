// @ts-nocheck
// routes/genre.routes.js

import express from 'express';
import {
    getGenres,
    getGenre,
    createNewGenre,
    updateExistingGenre,
    deleteExistingGenre
} from '../controllers/genre.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/genres
 * @desc    Lấy danh sách tất cả thể loại
 * @access  Public
 */
router.get('/', getGenres);

/**
 * @route   GET /api/v1/genres/:id
 * @desc    Lấy chi tiết một thể loại theo ID
 * @access  Public
 */
router.get('/:id', getGenre);

/**
 * @route   POST /api/v1/genres
 * @desc    Tạo thể loại mới
 * @access  Admin
 */
router.post('/', verifyToken, createNewGenre);

/**
 * @route   PUT /api/v1/genres/:id
 * @desc    Cập nhật thể loại
 * @access  Admin
 */
router.put('/:id', verifyToken, updateExistingGenre);

/**
 * @route   DELETE /api/v1/genres/:id
 * @desc    Xóa thể loại
 * @access  Admin
 */
router.delete('/:id', verifyToken, deleteExistingGenre);

export default router;
