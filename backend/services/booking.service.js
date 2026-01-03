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
                    include: [
                        {
                            model: Movie,
                            as: 'movie',
                            attributes: ['id', 'title', 'poster_url', 'duration', 'genre']
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
