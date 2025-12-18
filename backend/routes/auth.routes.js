// routes/auth.routes.js

import express from 'express';
import { register, login, verifyUser, updateProfile } from '../controllers/auth.controller.js'; 
import { verifyToken } from '../middleware/auth.middleware.js'; // Nhập middleware gác cổng

const router = express.Router();

// 1. Endpoint Đăng ký
router.post('/register', register); 

// 2. Endpoint Đăng nhập
router.post('/login', login);

// 3. Endpoint xác thực Token cho Frontend Middleware
// Khi Next.js gọi đến đây, nó sẽ chạy qua verifyToken trước.
// Nếu token sai, verifyToken sẽ trả về 401 ngay lập tức.
router.get('/verify', verifyToken, verifyUser);

// 4. Endpoint cập nhật thông tin profile
router.put('/update-profile', verifyToken, updateProfile);


export default router;