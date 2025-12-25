// models/Showtime.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import Movie from './Movie.model.js';
import Theater from './Theater.model.js';

const Showtime = sequelize.define('Showtime', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'movie_id',
        references: {
            model: Movie,
            key: 'id'
        }
    },
    theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'theater_id',
        references: {
            model: Theater,
            key: 'id'
        }
    },
    showtime_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'showtime_date'
    },
    showtime_time: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'showtime_time'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price'
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'available_seats'
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'showing', 'finished', 'cancelled'),
        defaultValue: 'scheduled',
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
    tableName: 'showtimes',
    timestamps: false,
    freezeTableName: true
});

// Relationships
Showtime.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });
Showtime.belongsTo(Theater, { foreignKey: 'theater_id', as: 'theater' });

Movie.hasMany(Showtime, { foreignKey: 'movie_id', as: 'showtimes' });
Theater.hasMany(Showtime, { foreignKey: 'theater_id', as: 'showtimes' });

export default Showtime;
