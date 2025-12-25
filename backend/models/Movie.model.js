// models/Movie.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';

const Movie = sequelize.define('Movie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'title'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duration'
    },
    release_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'release_date'
    },
    poster_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'poster_url'
    },
    trailer_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'trailer_url'
    },
    director: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'director'
    },
    actors: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'actors'
    },
    rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0.0,
        field: 'rating'
    },
    age_rating: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'age_rating'
    },
    status: {
        type: DataTypes.ENUM('coming_soon', 'now_showing', 'ended'),
        defaultValue: 'coming_soon',
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
    tableName: 'movies',
    timestamps: false,
    freezeTableName: true
});

export default Movie;
