// models/User.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import bcrypt from 'bcryptjs';

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
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        field: 'is_active'
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'phone_number'
    }
}, {
    // 2. Cấu hình Model
    tableName: 'users', // Tên bảng chính xác là 'users' (chữ thường)
    timestamps: false, // Bỏ qua cột createdAt và updatedAt
    freezeTableName: true, // Ngăn Sequelize tự động thêm 's' vào tên bảng
    hooks: {
        // Hook: Tự động hash password trước khi tạo user mới
        beforeCreate: async (user) => {
            if (user.password_hash) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        },
        // Hook: Tự động hash password trước khi cập nhật nếu password_hash thay đổi
        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        }
    }
});

export default User;