// @ts-nocheck
// services/movie.service.js

import { Movie, Genre, MovieGenre, Showtime, Theater } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Lấy danh sách tất cả phim
 * @param {Object} filters - Bộ lọc (status, genre, search)
 * @returns {Promise<Array>} Danh sách phim
 */
export const getAllMovies = async (filters = {}) => {
    const { status, genre, search, limit = 20, offset = 0 } = filters;
    
    const whereClause = {};
    
    // Lọc theo trạng thái
    if (status) {
        whereClause.status = status;
    }
    
    // Tìm kiếm theo tên phim
    if (search) {
        whereClause.title = { [Op.like]: `%${search}%` };
    }
    
    const includeClause = [
        {
            model: Genre,
            as: 'genres',
            attributes: ['id', 'name'],
            through: { attributes: [] } // Không lấy thông tin bảng trung gian
        }
    ];
    
    // Lọc theo thể loại
    if (genre) {
        includeClause[0].where = { name: genre };
    }
    
    const movies = await Movie.findAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    return movies;
};

/**
 * Lấy chi tiết một phim theo ID
 * @param {number} movieId - ID của phim
 * @returns {Promise<Object>} Chi tiết phim
 */
export const getMovieById = async (movieId) => {
    const movie = await Movie.findByPk(movieId, {
        include: [
            {
                model: Genre,
                as: 'genres',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            },
            {
                model: Showtime,
                as: 'showtimes',
                attributes: ['id', 'showtime_date', 'showtime_time', 'price', 'available_seats', 'status'],
                include: [
                    {
                        model: Theater,
                        as: 'theater',
                        attributes: ['id', 'name', 'theater_type']
                    }
                ],
                where: {
                    status: { [Op.in]: ['scheduled', 'showing'] }
                },
                required: false
            }
        ]
    });
    
    if (!movie) {
        throw new Error('Không tìm thấy phim');
    }
    
    return movie;
};

/**
 * Lấy danh sách phim đang chiếu
 * @returns {Promise<Array>} Danh sách phim đang chiếu
 */
export const getNowShowingMovies = async () => {
    return await getAllMovies({ status: 'now_showing' });
};

/**
 * Lấy danh sách phim sắp chiếu
 * @returns {Promise<Array>} Danh sách phim sắp chiếu
 */
export const getComingSoonMovies = async () => {
    return await getAllMovies({ status: 'coming_soon' });
};
