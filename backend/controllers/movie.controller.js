// @ts-nocheck
// controllers/movie.controller.js

import { 
    getAllMovies, 
    getMovieById, 
    getNowShowingMovies, 
    getComingSoonMovies,
    createMovie,
    updateMovie,
    deleteMovie
} from '../services/movie.service.js';

/**
 * Lấy danh sách tất cả phim
 */
export const getMovies = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            genre: req.query.genre,
            search: req.query.search,
            limit: req.query.limit || 20,
            offset: req.query.offset || 0
        };
        
        const movies = await getAllMovies(filters);
        
        return res.status(200).json({
            message: 'Lấy danh sách phim thành công',
            data: movies,
            count: movies.length
        });
    } catch (error) {
        console.error('ERROR getting movies:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách phim',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết một phim
 */
export const getMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        
        if (!movieId) {
            return res.status(400).json({
                message: 'Thiếu ID phim'
            });
        }
        
        const movie = await getMovieById(movieId);
        
        return res.status(200).json({
            message: 'Lấy chi tiết phim thành công',
            data: movie
        });
    } catch (error) {
        if (error.message === 'Không tìm thấy phim') {
            return res.status(404).json({
                message: error.message
            });
        }
        
        console.error('ERROR getting movie:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy chi tiết phim',
            error: error.message
        });
    }
};

/**
 * Lấy danh sách phim đang chiếu
 */
export const getNowShowing = async (req, res) => {
    try {
        const movies = await getNowShowingMovies();
        
        return res.status(200).json({
            message: 'Lấy danh sách phim đang chiếu thành công',
            data: movies,
            count: movies.length
        });
    } catch (error) {
        console.error('ERROR getting now showing movies:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách phim đang chiếu',
            error: error.message
        });
    }
};

/**
 * Lấy danh sách phim sắp chiếu
 */
export const getComingSoon = async (req, res) => {
    try {
        const movies = await getComingSoonMovies();
        
        return res.status(200).json({
            message: 'Lấy danh sách phim sắp chiếu thành công',
            data: movies,
            count: movies.length
        });
    } catch (error) {
        console.error('ERROR getting coming soon movies:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách phim sắp chiếu',
            error: error.message
        });
    }
};

/**
 * Tạo phim mới (Admin only)
 */
export const createNewMovie = async (req, res) => {
    try {
        let movieData = req.body;
        const posterBuffer = req.file ? req.file.buffer : null;

        // Validate dữ liệu cơ bản
        if (!movieData.title || !movieData.duration) {
            return res.status(400).json({
                message: 'Thiếu thông tin bắt buộc (title, duration)'
            });
        }

        // Parse genres nếu là string JSON
        if (movieData.genres && typeof movieData.genres === 'string') {
            movieData.genres = JSON.parse(movieData.genres);
        }

        const movie = await createMovie(movieData, posterBuffer);

        return res.status(201).json({
            message: 'Tạo phim mới thành công',
            data: movie
        });
    } catch (error) {
        console.error('ERROR creating movie:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi tạo phim',
            error: error.message
        });
    }
};

/**
 * Cập nhật phim (Admin only)
 */
export const updateExistingMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        let movieData = req.body;
        const posterBuffer = req.file ? req.file.buffer : null;

        if (!movieId) {
            return res.status(400).json({
                message: 'Thiếu ID phim'
            });
        }

        // Parse genres nếu là string JSON
        if (movieData.genres && typeof movieData.genres === 'string') {
            movieData.genres = JSON.parse(movieData.genres);
        }

        const movie = await updateMovie(movieId, movieData, posterBuffer);

        return res.status(200).json({
            message: 'Cập nhật phim thành công',
            data: movie
        });
    } catch (error) {
        if (error.message === 'Không tìm thấy phim') {
            return res.status(404).json({
                message: error.message
            });
        }

        console.error('ERROR updating movie:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi cập nhật phim',
            error: error.message
        });
    }
};

/**
 * Xóa phim (Admin only)
 */
export const deleteExistingMovie = async (req, res) => {
    try {
        const movieId = req.params.id;

        if (!movieId) {
            return res.status(400).json({
                message: 'Thiếu ID phim'
            });
        }

        await deleteMovie(movieId);

        return res.status(200).json({
            message: 'Xóa phim thành công'
        });
    } catch (error) {
        if (error.message === 'Không tìm thấy phim') {
            return res.status(404).json({
                message: error.message
            });
        }

        // Kiểm tra lỗi constraint violation
        if (error.message.includes('Không thể xóa phim')) {
            return res.status(409).json({
                message: error.message,
                code: 'CONSTRAINT_VIOLATION'
            });
        }

        console.error('ERROR deleting movie:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi xóa phim',
            error: error.message
        });
    }
};
