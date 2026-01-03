// routes/upload.routes.js
import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadPoster, deletePoster } from '../controllers/upload.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/upload/poster
 * @desc Upload poster phim lên Cloudinary
 * @access Admin only (cần thêm middleware kiểm tra role)
 */
router.post('/poster', verifyToken, upload.single('poster'), uploadPoster);

/**
 * @route DELETE /api/upload/poster
 * @desc Xóa poster từ Cloudinary
 * @access Admin only (cần thêm middleware kiểm tra role)
 */
router.delete('/poster', verifyToken, deletePoster);

export default router;
