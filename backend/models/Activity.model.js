// models/Activity.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import User from './User.model.js';

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'action',
        comment: 'Hành động thực hiện (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc)'
    },
    resource: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'resource',
        comment: 'Loại tài nguyên bị tác động (User, Movie, Booking, Theater, Showtime, etc)'
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'resource_id',
        comment: 'ID của tài nguyên bị tác động'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description',
        comment: 'Mô tả chi tiết hoạt động'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'metadata',
        comment: 'Dữ liệu bổ sung (thay đổi, trạng thái, etc)'
    },
    method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'method',
        comment: 'HTTP method (GET, POST, PUT, DELETE, etc)'
    },
    endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'endpoint',
        comment: 'API endpoint được gọi'
    },
    status_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'status_code',
        comment: 'HTTP response status code'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
        comment: 'IPv4 hoặc IPv6 address của user'
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
        comment: 'Thông tin trình duyệt và hệ điều hành'
    },
    browser: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'browser',
        comment: 'Tên trình duyệt (Chrome, Firefox, Safari, etc)'
    },
    os: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'os',
        comment: 'Tên hệ điều hành (Windows, macOS, Linux, etc)'
    },
    response_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'response_time',
        comment: 'Thời gian phản hồi (ms)'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'activities',
    timestamps: false,
    freezeTableName: true
});

// Relationships
Activity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Activity, { foreignKey: 'user_id', as: 'activities' });

export default Activity;
