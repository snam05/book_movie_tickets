// @ts-nocheck
// services/movie.service.js

import { Movie, Genre, MovieGenre, Showtime, Theater } from '../models/index.js';
import { Op } from 'sequelize';
import { uploadImage, deleteImage, extractPublicId } from './cloudinary.service.js';

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

/**
 * Tạo phim mới
 * @param {Object} movieData - Dữ liệu phim
 * @param {Buffer} posterBuffer - Buffer của file poster (optional)
 * @returns {Promise<Object>} Phim đã được tạo
 */
export const createMovie = async (movieData, posterBuffer = null) => {
    try {
        // Upload poster lên Cloudinary nếu có
        if (posterBuffer) {
            const uploadResult = await uploadImage(posterBuffer, 'movie_posters');
            movieData.poster_url = uploadResult.url;
        }

        // Tạo phim mới
        const movie = await Movie.create(movieData);

        // Nếu có genres, tạo quan hệ many-to-many
        if (movieData.genres && movieData.genres.length > 0) {
            const movieGenres = movieData.genres.map(genreId => ({
                movie_id: movie.id,
                genre_id: genreId
            }));
            await MovieGenre.bulkCreate(movieGenres);
        }

        // Lấy lại phim với thông tin genres
        return await getMovieById(movie.id);
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
};

/**
 * Cập nhật phim
 * @param {number} movieId - ID của phim
 * @param {Object} movieData - Dữ liệu cập nhật
 * @param {Buffer} posterBuffer - Buffer của file poster mới (optional)
 * @returns {Promise<Object>} Phim đã được cập nhật
 */
export const updateMovie = async (movieId, movieData, posterBuffer = null) => {
    try {
        const movie = await Movie.findByPk(movieId);
        
        if (!movie) {
            throw new Error('Không tìm thấy phim');
        }

        // Nếu có poster mới, xóa poster cũ và upload poster mới
        if (posterBuffer) {
            // Xóa poster cũ từ Cloudinary nếu có
            if (movie.poster_url) {
                const oldPublicId = extractPublicId(movie.poster_url);
                if (oldPublicId) {
                    await deleteImage(oldPublicId).catch(err => 
                        console.error('Error deleting old poster:', err)
                    );
                }
            }

            // Upload poster mới
            const uploadResult = await uploadImage(posterBuffer, 'movie_posters');
            movieData.poster_url = uploadResult.url;
        }

        // Cập nhật thông tin phim
        await movie.update(movieData);

        // Cập nhật genres nếu có
        if (movieData.genres) {
            // Xóa tất cả quan hệ cũ
            await MovieGenre.destroy({ where: { movie_id: movieId } });
            
            // Tạo quan hệ mới
            if (movieData.genres.length > 0) {
                const movieGenres = movieData.genres.map(genreId => ({
                    movie_id: movieId,
                    genre_id: genreId
                }));
                await MovieGenre.bulkCreate(movieGenres);
            }
        }

        // Lấy lại phim với thông tin đầy đủ
        return await getMovieById(movieId);
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
};

/**
 * Xóa phim
 * @param {number} movieId - ID của phim
 * @returns {Promise<boolean>}
 */
export const deleteMovie = async (movieId) => {
    try {
        const movie = await Movie.findByPk(movieId);
        
        if (!movie) {
            throw new Error('Không tìm thấy phim');
        }

        // Xóa poster từ Cloudinary nếu có
        if (movie.poster_url) {
            const publicId = extractPublicId(movie.poster_url);
            if (publicId) {
                await deleteImage(publicId).catch(err => 
                    console.error('Error deleting poster:', err)
                );
            }
        }

        // Xóa các quan hệ trong bảng trung gian
        await MovieGenre.destroy({ where: { movie_id: movieId } });

        // Xóa phim
        await movie.destroy();

        return true;
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
};
