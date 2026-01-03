// controllers/showtime.controller.js
import { getAllShowtimes, getShowtimeById } from '../services/showtime.service.js';

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
