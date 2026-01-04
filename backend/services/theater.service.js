// backend/services/theater.service.js

import Theater from '../models/Theater.model.js';
import Showtime from '../models/Showtime.model.js';
import Booking from '../models/Booking.model.js';
import { Op } from 'sequelize';

/**
 * Lấy tất cả rạp chiếu
 */
export const getAllTheaters = async (filters = {}) => {
    const whereClause = {};
    
    // Filter theo status
    if (filters.status) {
        whereClause.status = filters.status;
    }
    
    // Filter theo theater_type
    if (filters.theater_type) {
        whereClause.theater_type = filters.theater_type;
    }
    
    // Tìm kiếm theo tên
    if (filters.search) {
        whereClause.name = {
            [Op.like]: `%${filters.search}%`
        };
    }
    
    const theaters = await Theater.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']]
    });
    
    return theaters;
};

/**
 * Lấy chi tiết một rạp theo ID
 */
export const getTheaterById = async (theaterId) => {
    const theater = await Theater.findByPk(theaterId);
    
    if (!theater) {
        throw new Error('Không tìm thấy rạp chiếu');
    }
    
    return theater;
};

/**
 * Tạo rạp chiếu mới
 */
export const createTheater = async (theaterData) => {
    const { name, total_seats, seat_map, theater_type, status } = theaterData;
    
    // Validate dữ liệu
    if (!name || !total_seats) {
        throw new Error('Thiếu thông tin bắt buộc: tên rạp và số ghế');
    }
    
    // Kiểm tra tên rạp đã tồn tại
    const existingTheater = await Theater.findOne({ where: { name } });
    if (existingTheater) {
        throw new Error('Tên rạp đã tồn tại');
    }
    
    // Tạo rạp mới
    const newTheater = await Theater.create({
        name,
        total_seats,
        seat_map: seat_map || null,
        theater_type: theater_type || 'standard',
        status: status || 'active'
    });
    
    return newTheater;
};

/**
 * Cập nhật thông tin rạp chiếu
 */
export const updateTheater = async (theaterId, theaterData) => {
    const theater = await Theater.findByPk(theaterId);
    
    if (!theater) {
        throw new Error('Không tìm thấy rạp chiếu');
    }
    
    const { name, total_seats, seat_map, theater_type, status } = theaterData;
    
    // Kiểm tra tên rạp trùng (nếu đổi tên)
    if (name && name !== theater.name) {
        const existingTheater = await Theater.findOne({ 
            where: { 
                name,
                id: { [Op.ne]: theaterId } // Loại trừ chính nó
            } 
        });
        if (existingTheater) {
            throw new Error('Tên rạp đã tồn tại');
        }
    }
    
    // Cập nhật các trường
    if (name) theater.name = name;
    if (total_seats) theater.total_seats = total_seats;
    if (seat_map !== undefined) theater.seat_map = seat_map;
    if (theater_type) theater.theater_type = theater_type;
    if (status) theater.status = status;
    
    theater.updated_at = new Date();
    await theater.save();
    
    return theater;
};

/**
 * Xóa rạp chiếu
 */
export const deleteTheater = async (theaterId) => {
    const theater = await Theater.findByPk(theaterId);
    
    if (!theater) {
        throw new Error('Không tìm thấy rạp chiếu');
    }
    
    // Kiểm tra có showtimes gắn với rạp này không
    const showtimeCount = await Showtime.count({
        where: { theater_id: theaterId }
    });
    
    if (showtimeCount > 0) {
        throw new Error(`Không thể xóa rạp này vì có ${showtimeCount} lịch chiếu đang gắn kèm`);
    }
    
    // Kiểm tra có bookings gắn với showtimes của rạp này không
    const bookingCount = await Booking.count({
        include: [
            {
                model: Showtime,
                as: 'showtime',
                required: true,
                where: { theater_id: theaterId }
            }
        ]
    });
    
    if (bookingCount > 0) {
        throw new Error(`Không thể xóa rạp này vì có ${bookingCount} đơn đặt vé gắn kèm`);
    }
    
    await theater.destroy();
    
    return { message: 'Đã xóa rạp chiếu thành công' };
};

/**
 * Cập nhật trạng thái rạp chiếu
 */
export const updateTheaterStatus = async (theaterId, status) => {
    const theater = await Theater.findByPk(theaterId);
    
    if (!theater) {
        throw new Error('Không tìm thấy rạp chiếu');
    }
    
    if (!['active', 'maintenance'].includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
    }
    
    theater.status = status;
    theater.updated_at = new Date();
    await theater.save();
    
    return theater;
};
