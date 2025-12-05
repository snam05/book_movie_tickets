// db.config.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // Cần nhập dotenv ở đây để đảm bảo biến được tải

// Tải biến môi trường ngay
dotenv.config();

// Lấy thông số từ biến môi trường
const { 
    DB_NAME, 
    DB_USER, 
    DB_PASS, 
    DB_HOST, 
    DB_DIALECT 
} = process.env;

// Báo lỗi nếu thiếu thông số cần thiết
if (!DB_NAME || !DB_USER || !DB_HOST || !DB_DIALECT) {
    console.error("❌ Lỗi cấu hình DB: Thiếu một hoặc nhiều biến môi trường (DB_NAME, DB_USER, DB_HOST, DB_DIALECT).");
    process.exit(1);
}

// Tạo một instance mới của Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT, 
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Kết nối MySQL (Sequelize) thành công! Host: ${DB_HOST}, Database: ${DB_NAME}`);
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error.message);
        // Thoát ứng dụng nếu kết nối DB thất bại
        process.exit(1);
    }
};

// Export instance Sequelize để dùng cho việc định nghĩa Models
export { sequelize }; 
// Export hàm kết nối để gọi trong index.js
export default connectDB;