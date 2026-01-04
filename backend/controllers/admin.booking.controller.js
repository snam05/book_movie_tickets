// backend/controllers/admin.booking.controller.js
// Controller cho admin quản lý bookings

import * as adminBookingService from '../services/admin.booking.service.js';

/**
 * Lấy tất cả bookings (Admin only)
 * GET /api/v1/admin/bookings
 */
export const getAllBookings = async (req, res) => {
    try {
        const { booking_status, payment_status, search } = req.query;
        
        const filters = {};
        if (booking_status) filters.booking_status = booking_status;
        if (payment_status) filters.payment_status = payment_status;
        if (search) filters.search = search;
        
        const bookings = await adminBookingService.getAllBookings(filters);
        
        res.status(200).json({
            message: 'Lấy danh sách bookings thành công',
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        console.error('Error in getAllBookings:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách bookings',
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết booking (Admin only)
 * GET /api/v1/admin/bookings/:id
 */
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await adminBookingService.getBookingById(parseInt(id));
        
        res.status(200).json({
            message: 'Lấy thông tin booking thành công',
            data: booking
        });
    } catch (error) {
        console.error('Error in getBookingById:', error);
        if (error.message === 'Không tìm thấy booking') {
            return res.status(404).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin booking',
            error: error.message
        });
    }
};

/**
 * Cập nhật payment status (Admin only)
 * PATCH /api/v1/admin/bookings/:id/payment
 */
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_method } = req.body;
        
        if (!payment_status) {
            return res.status(400).json({
                message: 'Thiếu thông tin payment_status'
            });
        }
        
        const booking = await adminBookingService.updatePaymentStatus(
            parseInt(id),
            payment_status,
            payment_method
        );
        
        res.status(200).json({
            message: 'Cập nhật trạng thái thanh toán thành công',
            data: booking
        });
    } catch (error) {
        console.error('Error in updatePaymentStatus:', error);
        if (error.message === 'Không tìm thấy booking' || error.message === 'Payment status không hợp lệ') {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'Lỗi khi cập nhật trạng thái thanh toán',
            error: error.message
        });
    }
};

/**
 * Cập nhật booking status (Admin only)
 * PATCH /api/v1/admin/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_status } = req.body;
        
        if (!booking_status) {
            return res.status(400).json({
                message: 'Thiếu thông tin booking_status'
            });
        }
        
        const booking = await adminBookingService.updateBookingStatus(
            parseInt(id),
            booking_status
        );
        
        res.status(200).json({
            message: 'Cập nhật trạng thái booking thành công',
            data: booking
        });
    } catch (error) {
        console.error('Error in updateBookingStatus:', error);
        if (error.message === 'Không tìm thấy booking' || error.message === 'Booking status không hợp lệ') {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'Lỗi khi cập nhật trạng thái booking',
            error: error.message
        });
    }
};

/**
 * Xóa booking (Admin only)
 * DELETE /api/v1/admin/bookings/:id
 */
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminBookingService.deleteBooking(parseInt(id));
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteBooking:', error);
        if (error.message === 'Không tìm thấy booking' || error.message.includes('Không thể xóa')) {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'Lỗi khi xóa booking',
            error: error.message
        });
    }
};

/**
 * Lấy thống kê bookings (Admin only)
 * GET /api/v1/admin/bookings/stats
 */
export const getBookingStats = async (req, res) => {
    try {
        const stats = await adminBookingService.getBookingStats();
        
        res.status(200).json({
            message: 'Lấy thống kê bookings thành công',
            data: stats
        });
    } catch (error) {
        console.error('Error in getBookingStats:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy thống kê bookings',
            error: error.message
        });
    }
};
