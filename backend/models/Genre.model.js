// models/Genre.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';

const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'genres',
    timestamps: false,
    freezeTableName: true
});

export default Genre;
