// controllers/booking.controller.js

import * as bookingService from '../services/booking.service.js';

/**
 * GET /api/v1/bookings
 * Lấy tất cả bookings của user hiện tại
 */
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await bookingService.getUserBookings(userId);

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Error in getMyBookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/bookings/:id
 * Lấy chi tiết một booking
 */
export const getBookingDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.getBookingById(id, userId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error in getBookingDetail:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking detail',
            error: error.message
        });
    }
};

/**
 * POST /api/v1/bookings
 * Tạo booking mới
 */
export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { showtimeId, seats, paymentMethod } = req.body;

        // Validate input
        if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking data'
            });
        }

        const booking = await bookingService.createBooking(userId, showtimeId, seats, paymentMethod);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error in createBooking:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create booking'
        });
    }
};

/**
 * PUT /api/v1/bookings/:id/cancel
 * Hủy booking
 */
export const cancelBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.cancelBooking(id, userId);

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error in cancelBookingById:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to cancel booking'
        });
    }
};
