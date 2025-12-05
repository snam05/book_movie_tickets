// models/User.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js'; 

// Định nghĩa Model User (Ánh xạ với bảng 'users' trong MySQL)
const User = sequelize.define('User', {
    // 1. Định nghĩa các Thuộc tính (Cột)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id' // Tên cột trong DB
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, 
        field: 'email'
    },
    password_hash: {
        type: DataTypes.STRING(255), // Lưu mật khẩu đã hash
        allowNull: false,
        field: 'password_hash'
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: true, // Có thể cho phép NULL nếu chưa cập nhật
        field: 'full_name'
    },
    cccd_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'cccd_number'
    },
    date_of_birth: {
        type: DataTypes.DATEONLY, // Kiểu dữ liệu DATE trong MySQL
        allowNull: true,
        field: 'date_of_birth'
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'), // Ánh xạ kiểu ENUM
        allowNull: true,
        field: 'gender'
    },
    member_code: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: true,
        field: 'member_code'
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer',
        allowNull: false,
        field: 'role'
    }
}, {
    // 2. Cấu hình Model
    tableName: 'users', // Tên bảng chính xác là 'users' (chữ thường)
    timestamps: false, // Bỏ qua cột createdAt và updatedAt
    freezeTableName: true // Ngăn Sequelize tự động thêm 's' vào tên bảng
});

export default User;