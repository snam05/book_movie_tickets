// models/Theater.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';

const Theater = sequelize.define('Theater', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'name'
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_seats'
    },
    seat_map: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'seat_map'
    },
    theater_type: {
        type: DataTypes.ENUM('standard', 'vip', 'imax', '3d'),
        defaultValue: 'standard',
        field: 'theater_type'
    },
    status: {
        type: DataTypes.ENUM('active', 'maintenance'),
        defaultValue: 'active',
        field: 'status'
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
    tableName: 'theaters',
    timestamps: false,
    freezeTableName: true
});

export default Theater;
