// @ts-nocheck
// index.js (Đảm bảo file package.json có "type": "module" để dùng cú pháp import/export)

import express from 'express';
import dotenv from 'dotenv'; // Dùng để quản lý biến môi trường
import cors from 'cors'; // Cho phép các yêu cầu từ các domain khác
import cookieParser from 'cookie-parser'; // Xử lý cookie
import connectDB from './db.config.js'; 

// 🎯 IMPORT ROUTES
import authRoutes from './routes/auth.routes.js'; 
import movieRoutes from './routes/movie.routes.js';
import genreRoutes from './routes/genre.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import showtimeRoutes from './routes/showtime.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import theaterRoutes from './routes/theater.routes.js';
import adminUserRoutes from './routes/admin.user.routes.js';
import adminBookingRoutes from './routes/admin.booking.routes.js'; 

// --- CẤU HÌNH BAN ĐẦU ---
dotenv.config(); // Load biến môi trường từ .env
const app = express();
const PORT = process.env.PORT || 8080;

// 1. Middleware cơ bản
// Cấu hình CORS (cho phép tất cả hoặc tùy chỉnh)
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL, cần cụ thể để cookie hoạt động
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Cho phép gửi cookie
}));

// Middleware xử lý cookie
app.use(cookieParser());

// Middleware cho phép Express xử lý JSON trong body request
app.use(express.json());

// 2. GẮN CÁC ROUTES CỦA ỨNG DỤNG VÀO SERVER
const API_PREFIX = '/api/v1'; // Định nghĩa tiền tố API chung

app.use(`${API_PREFIX}/auth`, authRoutes); // Gắn Auth Routes
app.use(`${API_PREFIX}/movies`, movieRoutes); // Gắn Movie Routes
app.use(`${API_PREFIX}/genres`, genreRoutes); // Gắn Genre Routes
app.use(`${API_PREFIX}/upload`, uploadRoutes); // Gắn Upload Routes
app.use(`${API_PREFIX}/showtimes`, showtimeRoutes); // Gắn Showtime Routes
app.use(`${API_PREFIX}/bookings`, bookingRoutes); // Gắn Booking Routes
app.use(`${API_PREFIX}/theaters`, theaterRoutes); // Gắn Theater Routes
app.use(`${API_PREFIX}/admin/users`, adminUserRoutes); // Gắn Admin User Routes
app.use(`${API_PREFIX}/admin/bookings`, adminBookingRoutes); // Gắn Admin Booking Routes

// 3. Định nghĩa Route đầu tiên (kiểm tra server)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Chào mừng đến với API V1!',
        status: 'Server đang chạy ổn định'
    });
});

// 4. Định nghĩa Middleware Xử lý Lỗi (Optional, nên có)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Đã xảy ra lỗi bên trong máy chủ',
        error: err.message
    });
});


// 5. Khởi động Server
const startServer = async () => {
    try {
        // Kết nối đến cơ sở dữ liệu (giả định hàm này là bất đồng bộ)
        await connectDB(); 
        console.log('✅ Kết nối CSDL thành công!');

        // Bắt đầu lắng nghe tại PORT đã định nghĩa
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
            console.log(`🌐 Truy cập: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động Server:', error.message);
        // Thoát ứng dụng nếu có lỗi nghiêm trọng khi kết nối DB
        process.exit(1);
    }
};

startServer();