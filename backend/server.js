// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Kết nối Database Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra kết nối
pool.getConnection()
    .then(() => console.log('✅ Kết nối MySQL thành công!'))
    .catch(err => {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        console.error('Kiểm tra lại DB_HOST, DB_USER, và mật khẩu trong file .env');
        process.exit(1);
    });

// Truyền pool DB vào req (để các route có thể sử dụng)
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

// 2. Định nghĩa Routes
// Cần đảm bảo các tệp này đã được tạo trong thư mục 'backend/routes/'
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.get('/', (req, res) => res.send('Backend API đang hoạt động ổn định.'));

// 3. Khởi động Server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});