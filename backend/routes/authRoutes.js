const express = require('express');
const router = express.Router();

// Định nghĩa các endpoints cơ bản để tránh lỗi require
router.post('/register', (req, res) => {
    res.json({ message: 'Đăng ký endpoint đang hoạt động.' });
});

router.post('/login', (req, res) => {
    res.json({ message: 'Đăng nhập endpoint đang hoạt động.' });
});

module.exports = router;