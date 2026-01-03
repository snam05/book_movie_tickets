// types/booking.ts

export interface IBookedSeat {
    seat_row: string;
    seat_number: number;
    seat_type: 'standard' | 'vip' | 'couple';
    seat_price: number;
}

export interface IBooking {
    id: number;
    user_id: number;
    showtime_id: number;
    booking_code: string;
    total_seats: number;
    total_price: number;
    booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_method?: string;
    created_at: string;
    updated_at: string;
    showtime: {
        id: number;
        showtime_date: string;
        showtime_time: string;
        price: number;
        available_seats: number;
        movie: {
            id: number;
            title: string;
            poster_url: string;
            duration: number;
        };
        theater: {
            id: number;
            name: string;
            theater_type: string;
            total_seats: number;
        };
    };
    seats: IBookedSeat[];
}
