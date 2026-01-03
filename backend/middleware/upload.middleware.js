// middleware/upload.middleware.js
import multer from 'multer';

// Cấu hình Multer để lưu file vào memory (Buffer)
const storage = multer.memoryStorage();

// Giới hạn kích thước file và loại file
const fileFilter = (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)'), false);
    }
};

// Khởi tạo Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: fileFilter
});

export default upload;
