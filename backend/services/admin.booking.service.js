// backend/services/admin.booking.service.js
// Service cho admin quản lý bookings

import Booking from '../models/Booking.model.js';
import BookedSeat from '../models/BookedSeat.model.js';
import User from '../models/User.model.js';
import Showtime from '../models/Showtime.model.js';
import Movie from '../models/Movie.model.js';
import Theater from '../models/Theater.model.js';
import { Op } from 'sequelize';

/**
 * Lấy tất cả bookings (Admin only)
 */
export const getAllBookings = async (filters = {}) => {
    const whereClause = {};
    
    // Filter theo status
    if (filters.booking_status) {
        whereClause.booking_status = filters.booking_status;
    }
    
    // Filter theo payment_status
    if (filters.payment_status) {
        whereClause.payment_status = filters.payment_status;
    }
    
    // Tìm kiếm theo booking_code hoặc email
    if (filters.search) {
        whereClause[Op.or] = [
            { booking_code: { [Op.like]: `%${filters.search}%` } }
        ];
    }
    
    const bookings = await Booking.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'full_name', 'member_code']
            },
            {
                model: Showtime,
                as: 'showtime',
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title', 'poster_url']
                    },
                    {
                        model: Theater,
                        as: 'theater',
                        attributes: ['id', 'name', 'theater_type']
                    }
                ]
            },
            {
                model: BookedSeat,
                as: 'seats'
            }
        ],
        order: [['created_at', 'DESC']]
    });
    
    return bookings;
};

/**
 * Lấy chi tiết booking (Admin only)
 */
export const getBookingById = async (bookingId) => {
    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'full_name', 'member_code', 'phone_number']
            },
            {
                model: Showtime,
                as: 'showtime',
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title', 'poster_url', 'duration']
                    },
                    {
                        model: Theater,
                        as: 'theater',
                        attributes: ['id', 'name', 'theater_type']
                    }
                ]
            },
            {
                model: BookedSeat,
                as: 'seats'
            }
        ]
    });
    
    if (!booking) {
        throw new Error('Không tìm thấy booking');
    }
    
    return booking;
};

/**
 * Cập nhật payment status (Admin only)
 */
export const updatePaymentStatus = async (bookingId, paymentStatus, paymentMethod) => {
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
        throw new Error('Không tìm thấy booking');
    }
    
    if (!['paid', 'unpaid', 'refunded'].includes(paymentStatus)) {
        throw new Error('Payment status không hợp lệ');
    }
    
    booking.payment_status = paymentStatus;
    if (paymentMethod) {
        booking.payment_method = paymentMethod;
    }
    if (paymentStatus === 'paid' && !booking.payment_date) {
        booking.payment_date = new Date();
    }
    booking.updated_at = new Date();
    
    await booking.save();
    
    return booking;
};

/**
 * Cập nhật booking status (Admin only)
 */
export const updateBookingStatus = async (bookingId, bookingStatus) => {
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
        throw new Error('Không tìm thấy booking');
    }
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
        throw new Error('Booking status không hợp lệ');
    }
    
    booking.booking_status = bookingStatus;
    booking.updated_at = new Date();
    
    await booking.save();
    
    return booking;
};

/**
 * Xóa booking (Admin only) - Chỉ xóa được nếu chưa thanh toán
 */
export const deleteBooking = async (bookingId) => {
    const booking = await Booking.findByPk(bookingId, {
        include: [BookedSeat]
    });
    
    if (!booking) {
        throw new Error('Không tìm thấy booking');
    }
    
    if (booking.payment_status === 'paid') {
        throw new Error('Không thể xóa booking đã thanh toán. Vui lòng hủy booking thay vì xóa.');
    }
    
    // Xóa các ghế đã đặt
    await BookedSeat.destroy({
        where: { booking_id: bookingId }
    });
    
    // Xóa booking
    await booking.destroy();
    
    return { message: 'Đã xóa booking thành công' };
};

/**
 * Lấy thống kê bookings
 */
export const getBookingStats = async () => {
    const totalBookings = await Booking.count();
    const confirmedBookings = await Booking.count({ where: { booking_status: 'confirmed' } });
    const pendingBookings = await Booking.count({ where: { booking_status: 'pending' } });
    const cancelledBookings = await Booking.count({ where: { booking_status: 'cancelled' } });
    
    const paidBookings = await Booking.count({ where: { payment_status: 'paid' } });
    const unpaidBookings = await Booking.count({ where: { payment_status: 'unpaid' } });
    
    // Tổng doanh thu
    const paidBookingsData = await Booking.findAll({
        where: { payment_status: 'paid' },
        attributes: ['total_price']
    });
    
    const totalRevenue = paidBookingsData.reduce((sum, booking) => {
        return sum + parseFloat(booking.total_price || 0);
    }, 0);
    
    return {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
        paid: paidBookings,
        unpaid: unpaidBookings,
        totalRevenue: totalRevenue
    };
};
