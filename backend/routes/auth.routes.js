// routes/auth.routes.js

import express from 'express';
import { register, login } from '../controllers/auth.controller.js'; // Nhập các hàm từ Controller

const router = express.Router();

// Định nghĩa Endpoint Đăng ký
// POST /api/v1/auth/register
router.post('/register', register); 

// Định nghĩa Endpoint Đăng nhập (sẽ code sau)
// POST /api/v1/auth/login
router.post('/login', login);

export default router;