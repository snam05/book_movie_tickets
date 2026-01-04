// services/booking.service.js

import Booking from '../models/Booking.model.js';
import BookedSeat from '../models/BookedSeat.model.js';
import Showtime from '../models/Showtime.model.js';
import Movie from '../models/Movie.model.js';
import Theater from '../models/Theater.model.js';

/**
 * Lấy tất cả bookings của user
 */
export const getUserBookings = async (userId) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Showtime,
                    as: 'showtime',
                    attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status'],
                    include: [
                        {
                            model: Movie,
                            as: 'movie',
                            attributes: ['id', 'title', 'poster_url', 'duration']
                        },
                        {
                            model: Theater,
                            as: 'theater',
                            attributes: ['id', 'name', 'theater_type', 'total_seats', 'status']
                        }
                    ]
                },
                {
                    model: BookedSeat,
                    as: 'seats',
                    attributes: ['seat_row', 'seat_number', 'seat_type', 'seat_price']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return bookings;
    } catch (error) {
        console.error('Error in getUserBookings:', error);
        throw error;
    }
};

/**
 * Lấy chi tiết một booking
 */
export const getBookingById = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({
            where: { 
                id: bookingId,
                user_id: userId // Đảm bảo booking thuộc về user này
            },
            include: [
                {
                    model: Showtime,
                    as: 'showtime',
                    attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status'],
                    include: [
                        {
                            model: Movie,
                            as: 'movie',
                            attributes: ['id', 'title', 'poster_url', 'duration']
                        },
                        {
                            model: Theater,
                            as: 'theater',
                            attributes: ['id', 'name', 'theater_type', 'total_seats']
                        }
                    ]
                },
                {
                    model: BookedSeat,
                    as: 'seats',
                    attributes: ['seat_row', 'seat_number', 'seat_type', 'seat_price']
                }
            ]
        });

        return booking;
    } catch (error) {
        console.error('Error in getBookingById:', error);
        throw error;
    }
};

/**
 * Tạo booking mới
 */
export const createBooking = async (userId, showtimeId, seats, paymentMethod = 'cash') => {
    try {
        // 1. Kiểm tra showtime có tồn tại không
        const showtime = await Showtime.findByPk(showtimeId, {
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status']
        });
        if (!showtime) {
            throw new Error('Showtime not found');
        }

        // 2. Tính tổng tiền
        const totalPrice = seats.reduce((sum, seat) => sum + (seat.price || 0), 0);

        // 4. Tạo booking code (format: BK + timestamp + random)
        const bookingCode = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // 5. Tạo booking
        const booking = await Booking.create({
            user_id: userId,
            showtime_id: showtimeId,
            booking_code: bookingCode,
            total_seats: seats.length,
            total_price: totalPrice,
            booking_status: 'confirmed',
            payment_status: 'paid',
            payment_method: paymentMethod,
            payment_date: new Date()
        });

        // 6. Tạo các booked seats
        const bookedSeatsData = seats.map(seat => ({
            booking_id: booking.id,
            seat_row: seat.row,
            seat_number: seat.number,
            seat_type: seat.type,
            seat_price: seat.price || 0
        }));

        await BookedSeat.bulkCreate(bookedSeatsData);

        // 7. Lấy lại booking với đầy đủ thông tin
        const fullBooking = await getBookingById(booking.id, userId);

        return fullBooking;
    } catch (error) {
        console.error('Error in createBooking:', error);
        throw error;
    }
};

/**
 * Hủy booking (chỉ được phép hủy nếu status là 'pending' hoặc 'confirmed')
 */
export const cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({
            where: { 
                id: bookingId,
                user_id: userId
            }
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Only allow cancellation when booking is still pending
        if (booking.booking_status !== 'pending') {
            throw new Error('Only pending bookings can be cancelled');
        }

        booking.booking_status = 'cancelled';
        await booking.save();

        return booking;
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        throw error;
    }
};
