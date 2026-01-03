// @ts-nocheck
// controllers/genre.controller.js

import { Genre } from '../models/index.js';

/**
 * Lấy danh sách tất cả thể loại
 */
export const getGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll({
            order: [['name', 'ASC']]
        });

        return res.status(200).json({
            message: 'Lấy danh sách thể loại thành công',
            data: genres
        });
    } catch (error) {
        console.error('ERROR getting genres:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách thể loại',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết một thể loại theo ID
 */
export const getGenre = async (req, res) => {
    try {
        const genreId = req.params.id;

        if (!genreId) {
            return res.status(400).json({
                message: 'Thiếu ID thể loại'
            });
        }

        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).json({
                message: 'Không tìm thấy thể loại'
            });
        }

        return res.status(200).json({
            message: 'Lấy chi tiết thể loại thành công',
            data: genre
        });
    } catch (error) {
        console.error('ERROR getting genre:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy chi tiết thể loại',
            error: error.message
        });
    }
};

/**
 * Tạo thể loại mới (Admin only)
 */
export const createNewGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Thiếu tên thể loại'
            });
        }

        const genre = await Genre.create({
            name,
            description
        });

        return res.status(201).json({
            message: 'Tạo thể loại mới thành công',
            data: genre
        });
    } catch (error) {
        console.error('ERROR creating genre:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Thể loại này đã tồn tại'
            });
        }
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi tạo thể loại',
            error: error.message
        });
    }
};

/**
 * Cập nhật thể loại (Admin only)
 */
export const updateExistingGenre = async (req, res) => {
    try {
        const genreId = req.params.id;
        const { name, description } = req.body;

        if (!genreId) {
            return res.status(400).json({
                message: 'Thiếu ID thể loại'
            });
        }

        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).json({
                message: 'Không tìm thấy thể loại'
            });
        }

        await genre.update({
            name: name || genre.name,
            description: description !== undefined ? description : genre.description
        });

        return res.status(200).json({
            message: 'Cập nhật thể loại thành công',
            data: genre
        });
    } catch (error) {
        console.error('ERROR updating genre:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Thể loại này đã tồn tại'
            });
        }
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi cập nhật thể loại',
            error: error.message
        });
    }
};

/**
 * Xóa thể loại (Admin only)
 */
export const deleteExistingGenre = async (req, res) => {
    try {
        const genreId = req.params.id;

        if (!genreId) {
            return res.status(400).json({
                message: 'Thiếu ID thể loại'
            });
        }

        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).json({
                message: 'Không tìm thấy thể loại'
            });
        }

        await genre.destroy();

        return res.status(200).json({
            message: 'Xóa thể loại thành công'
        });
    } catch (error) {
        console.error('ERROR deleting genre:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi xóa thể loại',
            error: error.message
        });
    }
};
