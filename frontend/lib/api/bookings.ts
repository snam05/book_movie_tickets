// lib/api/bookings.ts

import axios from '@/lib/axios';
import { IBooking } from '@/types/booking';

/**
 * Lấy tất cả bookings của user hiện tại
 */
export const getMyBookings = async (): Promise<IBooking[]> => {
    const response = await axios.get('/bookings');
    return response.data.data;
};

/**
 * Lấy chi tiết một booking
 */
export const getBookingDetail = async (bookingId: number): Promise<IBooking> => {
    const response = await axios.get(`/bookings/${bookingId}`);
    return response.data.data;
};

/**
 * Hủy booking
 */
export const cancelBooking = async (bookingId: number): Promise<IBooking> => {
    const response = await axios.put(`/bookings/${bookingId}/cancel`);
    return response.data.data;
};
