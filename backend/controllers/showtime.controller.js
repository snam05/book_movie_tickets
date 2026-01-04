// controllers/showtime.controller.js
import { getAllShowtimes, getShowtimeById, createShowtime, updateShowtime, deleteShowtime } from '../services/showtime.service.js';

/**
 * Lấy danh sách tất cả suất chiếu
 * GET /api/v1/showtimes
 */
export const getShowtimes = async (req, res) => {
    try {
        const showtimes = await getAllShowtimes();

        return res.status(200).json({
            message: 'Lấy danh sách suất chiếu thành công',
            data: showtimes
        });
    } catch (error) {
        console.error('ERROR getting showtimes:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách suất chiếu',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết suất chiếu
 * GET /api/v1/showtimes/:id
 */
export const getShowtime = async (req, res) => {
    try {
        const showtimeId = req.params.id;

        if (!showtimeId) {
            return res.status(400).json({
                message: 'Thiếu ID suất chiếu'
            });
        }

        const showtime = await getShowtimeById(showtimeId);

        return res.status(200).json({
            message: 'Lấy thông tin suất chiếu thành công',
            data: showtime
        });
    } catch (error) {
        if (error.message === 'Không tìm thấy suất chiếu') {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === 'Rạp chiếu đang trong quá trình bảo trì') {
            return res.status(403).json({
                message: error.message
            });
        }

        console.error('ERROR getting showtime:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy thông tin suất chiếu',
            error: error.message
        });
    }
};

/**
 * Tạo lịch chiếu mới
 * POST /api/v1/admin/showtimes
 */
export const createShowtimeHandler = async (req, res) => {
    try {
        const showtimeData = req.body;
        const newShowtime = await createShowtime(showtimeData);

        res.status(201).json({
            message: 'Tạo lịch chiếu mới thành công',
            data: newShowtime
        });
    } catch (error) {
        console.error('Error in createShowtime:', error);
        if (error.message === 'Thiếu thông tin bắt buộc' || 
            error.message.includes('Không tìm thấy') ||
            error.message.includes('Xung đột lịch chiếu')) {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi tạo lịch chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Cập nhật lịch chiếu
 * PUT /api/v1/admin/showtimes/:id
 */
export const updateShowtimeHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const showtimeData = req.body;

        const updatedShowtime = await updateShowtime(id, showtimeData);

        res.status(200).json({
            message: 'Cập nhật lịch chiếu thành công',
            data: updatedShowtime
        });
    } catch (error) {
        console.error('Error in updateShowtime:', error);
        if (error.message === 'Không tìm thấy lịch chiếu' || 
            error.message.includes('Không tìm thấy') ||
            error.message.includes('Xung đột lịch chiếu')) {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi cập nhật lịch chiếu',
                error: error.message
            });
        }
    }
};

/**
 * Xóa lịch chiếu
 * DELETE /api/v1/admin/showtimes/:id
 */
export const deleteShowtimeHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteShowtime(id);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteShowtime:', error);
        if (error.message === 'Không tìm thấy lịch chiếu') {
            res.status(404).json({
                message: error.message
            });
        } else if (error.message.includes('Không thể xóa')) {
            res.status(400).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'Lỗi khi xóa lịch chiếu',
                error: error.message
            });
        }
    }
};
