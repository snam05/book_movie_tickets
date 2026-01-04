// lib/api/admin-bookings.ts
// API cho admin quản lý bookings

import axios from '@/lib/axios';

export interface AdminBooking {
    id: number;
    booking_code: string;
    user_id: number;
    showtime_id: number;
    total_seats: number;
    total_price: string;
    booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'paid' | 'unpaid' | 'refunded';
    payment_method: string | null;
    payment_date: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        email: string;
        full_name: string;
        member_code: string;
        phone_number?: string;
    };
    showtime?: {
        id: number;
        showtime_date: string;
        showtime_time: string;
        price: string;
        movie?: {
            id: number;
            title: string;
            poster_url: string;
        };
        theater?: {
            id: number;
            name: string;
            theater_type: string;
        };
    };
    seats?: Array<{
        id: number;
        seat_row: string;
        seat_number: number;
        seat_type: string;
        seat_price: string;
    }>;
}

export interface BookingStats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    paid: number;
    unpaid: number;
    totalRevenue: number;
}

/**
 * Lấy tất cả bookings (Admin only)
 */
export const getAllBookings = async (filters?: {
    booking_status?: string;
    payment_status?: string;
    search?: string;
}): Promise<AdminBooking[]> => {
    const params = new URLSearchParams();
    if (filters?.booking_status) params.append('booking_status', filters.booking_status);
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await axios.get(`/admin/bookings?${params.toString()}`);
    return response.data.data;
};

/**
 * Lấy chi tiết booking (Admin only)
 */
export const getBookingById = async (bookingId: number): Promise<AdminBooking> => {
    const response = await axios.get(`/admin/bookings/${bookingId}`);
    return response.data.data;
};

/**
 * Cập nhật payment status (Admin only)
 */
export const updatePaymentStatus = async (
    bookingId: number,
    paymentStatus: string,
    paymentMethod?: string
): Promise<AdminBooking> => {
    const response = await axios.patch(`/admin/bookings/${bookingId}/payment`, {
        payment_status: paymentStatus,
        payment_method: paymentMethod
    });
    return response.data.data;
};

/**
 * Cập nhật booking status (Admin only)
 */
export const updateBookingStatus = async (
    bookingId: number,
    bookingStatus: string
): Promise<AdminBooking> => {
    const response = await axios.patch(`/admin/bookings/${bookingId}/status`, {
        booking_status: bookingStatus
    });
    return response.data.data;
};

/**
 * Xóa booking (Admin only)
 */
export const deleteBooking = async (bookingId: number): Promise<void> => {
    await axios.delete(`/admin/bookings/${bookingId}`);
};

/**
 * Lấy thống kê bookings (Admin only)
 */
export const getBookingStats = async (): Promise<BookingStats> => {
    const response = await axios.get('/admin/bookings/stats');
    return response.data.data;
};
