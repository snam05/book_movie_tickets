// models/Booking.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import User from './User.model.js';
import Showtime from './Showtime.model.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
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
    showtime_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'showtime_id',
        references: {
            model: Showtime,
            key: 'id'
        }
    },
    booking_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'booking_code'
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_seats'
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price'
    },
    booking_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending',
        field: 'booking_status'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid',
        field: 'payment_status'
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'momo', 'zalopay', 'vnpay'),
        allowNull: true,
        field: 'payment_method'
    },
    booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'booking_date'
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'payment_date'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'bookings',
    timestamps: false,
    freezeTableName: true
});

// Relationships
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Showtime, { foreignKey: 'showtime_id', as: 'showtime' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Showtime.hasMany(Booking, { foreignKey: 'showtime_id', as: 'bookings' });

export default Booking;
