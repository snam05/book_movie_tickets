import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadPoster, deletePoster } from '../controllers/upload.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/upload/poster
 * @desc Upload poster phim lên Cloudinary
 * @access Admin only
 */
router.post('/poster', verifyToken, upload.single('poster'), uploadPoster);

/**
 * @route POST /api/upload/image
 * @desc Upload ảnh lên Cloudinary (cho tin tức, poster, v.v.)
 * @access Admin only
 */
router.post('/image', verifyToken, upload.single('file'), uploadPoster);

/**
 * @route DELETE /api/upload/poster
 * @desc Xóa poster từ Cloudinary
 * @access Admin only
 */
router.delete('/poster', verifyToken, deletePoster);

/**
 * @route DELETE /api/upload/image
 * @desc Xóa ảnh từ Cloudinary
 * @access Admin only
 */
router.delete('/image', verifyToken, deletePoster);

export default router;
