// models/BookedSeat.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import Booking from './Booking.model.js';

const BookedSeat = sequelize.define('BookedSeat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'booking_id',
        references: {
            model: Booking,
            key: 'id'
        }
    },
    seat_row: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'seat_row'
    },
    seat_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'seat_number'
    },
    seat_type: {
        type: DataTypes.ENUM('standard', 'vip', 'couple'),
        defaultValue: 'standard',
        field: 'seat_type'
    },
    seat_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'seat_price'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'booked_seats',
    timestamps: false,
    freezeTableName: true
});

// Relationships
BookedSeat.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Booking.hasMany(BookedSeat, { foreignKey: 'booking_id', as: 'seats' });

export default BookedSeat;
