// models/MovieGenre.model.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';
import Movie from './Movie.model.js';
import Genre from './Genre.model.js';

const MovieGenre = sequelize.define('MovieGenre', {
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
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'genre_id',
        references: {
            model: Genre,
            key: 'id'
        }
    }
}, {
    tableName: 'movie_genres',
    timestamps: false,
    freezeTableName: true
});

// Many-to-Many Relationships
Movie.belongsToMany(Genre, { 
    through: MovieGenre, 
    foreignKey: 'movie_id', 
    otherKey: 'genre_id',
    as: 'genres'
});

Genre.belongsToMany(Movie, { 
    through: MovieGenre, 
    foreignKey: 'genre_id', 
    otherKey: 'movie_id',
    as: 'movies'
});

export default MovieGenre;
