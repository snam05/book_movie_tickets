// models/Session.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js'; 
import User from './User.model.js';

// Định nghĩa Model Session (Ánh xạ với bảng 'sessions' trong MySQL)
const Session = sequelize.define('Session', {
    session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'session_id'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    session_token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'session_token'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address'
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },
    last_activity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'last_activity'
    }
}, {
    tableName: 'sessions',
    timestamps: false,
    freezeTableName: true
});

// Thiết lập quan hệ giữa Session và User
Session.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Session, { foreignKey: 'user_id', as: 'sessions' });

export default Session;
