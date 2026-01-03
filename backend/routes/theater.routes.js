// backend/routes/theater.routes.js

import express from 'express';
import * as theaterController from '../controllers/theater.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - Xem danh sách và chi tiết rạp
router.get('/', theaterController.getAllTheaters);
router.get('/:id', theaterController.getTheaterById);

// Admin routes - Quản lý rạp chiếu (yêu cầu đăng nhập và là admin)
router.post('/', verifyToken, isAdmin, theaterController.createTheater);
router.put('/:id', verifyToken, isAdmin, theaterController.updateTheater);
router.delete('/:id', verifyToken, isAdmin, theaterController.deleteTheater);
router.patch('/:id/status', verifyToken, isAdmin, theaterController.updateTheaterStatus);

export default router;
