// backend/controllers/theater.controller.js

import * as theaterService from '../services/theater.service.js';

/**
 * Lấy danh sách tất cả rạp chiếu
 * GET /api/v1/theaters
 */
export const getAllTheaters = async (req, res) => {
    try {
        const { status, theater_type, search } = req.query;
        
        const filters = {};
        if (status) filters.status = status;
        if (theater_type) filters.theater_type = theater_type;
        if (search) filters.search = search;
        
        const theaters = await theaterService.getAllTheaters(filters);
        
        res.status(200).json({
            message: 'Lấy danh sách rạp chiếu thành công',
            data: theaters,
            count: theaters.length
        });
    } catch (error) {
        console.error('Error in getAllTheaters:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách rạp chiếu',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết một rạp chiếu
 * GET /api/v1/theaters/:id
 */
export const getTheaterById = async (req, res) => {
    try {
        const { id } = req.params;
        const theater = await theaterService.getTheaterById(id);
        
        res.status(200).json({
            message: 'Lấy thông tin rạp chiếu thành công',
            data: theater
        });
    } catch (error) {
        console.error('Error in getTheaterById:', error);
        if (error.message === 'Không tìm thấy rạp chiếu') {
            res.status(404).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi lấy thông tin rạp chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Tạo rạp chiếu mới (Admin only)
 * POST /api/v1/admin/theaters
 */
export const createTheater = async (req, res) => {
    try {
        const theaterData = req.body;
        const newTheater = await theaterService.createTheater(theaterData);
        
        res.status(201).json({
            message: 'Tạo rạp chiếu mới thành công',
            data: newTheater
        });
    } catch (error) {
        console.error('Error in createTheater:', error);
        if (error.message === 'Tên rạp đã tồn tại' || error.message.includes('Thiếu thông tin')) {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi tạo rạp chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Cập nhật thông tin rạp chiếu (Admin only)
 * PUT /api/v1/admin/theaters/:id
 */
export const updateTheater = async (req, res) => {
    try {
        const { id } = req.params;
        const theaterData = req.body;
        
        const updatedTheater = await theaterService.updateTheater(id, theaterData);
        
        res.status(200).json({
            message: 'Cập nhật rạp chiếu thành công',
            data: updatedTheater
        });
    } catch (error) {
        console.error('Error in updateTheater:', error);
        if (error.message === 'Không tìm thấy rạp chiếu') {
            res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Tên rạp đã tồn tại') {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi cập nhật rạp chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Xóa rạp chiếu (Admin only)
 * DELETE /api/v1/admin/theaters/:id
 */
export const deleteTheater = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await theaterService.deleteTheater(id);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteTheater:', error);
        if (error.message === 'Không tìm thấy rạp chiếu') {
            res.status(404).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi xóa rạp chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Cập nhật trạng thái rạp chiếu (Admin only)
 * PATCH /api/v1/admin/theaters/:id/status
 */
export const updateTheaterStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                message: 'Thiếu thông tin trạng thái'
            });
        }
        
        const updatedTheater = await theaterService.updateTheaterStatus(id, status);
        
        res.status(200).json({
            message: 'Cập nhật trạng thái rạp chiếu thành công',
            data: updatedTheater
        });
    } catch (error) {
        console.error('Error in updateTheaterStatus:', error);
        if (error.message === 'Không tìm thấy rạp chiếu') {
            res.status(404).json({
                message: error.message
            });
        } else if (error.message === 'Trạng thái không hợp lệ') {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi cập nhật trạng thái rạp chiếu',
                error: error.message
            });
        }
    }
};
