// frontend/app/booking/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { SeatMap } from '@/components/booking/SeatMap';

// Định nghĩa type
type SeatData = {
    id: string;
    row: string;
    number: number;
    type: 'standard' | 'vip' | 'couple';
    isBooked?: boolean;
    pairWith?: string;
};

type SeatMapData = {
    rows: string[];
    seatsPerRow: number;
    layout: SeatData[][];
    pricing: {
        standard?: number;
        vip?: number;
        couple?: number;
    };
};

type ShowtimeData = {
    id: number;
    showtime_date: string;
    showtime_time: string;
    price: string;
    available_seats: number;
    movie: {
        id: number;
        title: string;
        poster_url: string;
        duration: number;
        age_rating: string;
    };
    theater: {
        id: number;
        name: string;
        theater_type: string;
        total_seats: number;
        seat_map: SeatMapData;
    };
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const [showtimeId, setShowtimeId] = useState<string | null>(null);
    const [showtime, setShowtime] = useState<ShowtimeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        params.then(({ id }) => {
            setShowtimeId(id);
            fetchShowtime(id);
        });
    }, [params]);

    const fetchShowtime = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/showtimes/${id}`);
            
            if (!res.ok) {
                setShowtime(null);
                return;
            }
            
            const result = await res.json();
            setShowtime(result.data);
        } catch (error) {
            console.error('Error fetching showtime:', error);
            setShowtime(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSeatsSelected = (seats: SeatData[], price: number) => {
        setSelectedSeats(seats);
        setTotalPrice(price);
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Đang tải...</p>
            </div>
        );
    }

    if (!showtime) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-600">Không tìm thấy suất chiếu</h1>
                <p className="text-gray-600 mt-2">Vui lòng kiểm tra lại thông tin.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6 shadow-xl">
                <h1 className="text-3xl font-bold mb-2">{showtime.movie.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">📍 Rạp:</span>
                        <span>{showtime.theater.name} ({showtime.theater.theater_type})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">📅 Ngày:</span>
                        <span>{new Date(showtime.showtime_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">🕐 Giờ:</span>
                        <span>{showtime.showtime_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">💰 Giá vé:</span>
                        <span>{parseInt(showtime.price).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                            {showtime.movie.age_rating || 'P'}
                        </Badge>
                        <span>• {showtime.movie.duration} phút</span>
                    </div>
                </div>
            </div>

            {/* Màn hình */}
            <Alert variant="default" className="bg-gray-800 text-white text-center py-4 rounded-b-none shadow-xl">
                <AlertTitle className="text-2xl font-extrabold tracking-widest">MÀN HÌNH CHIẾU</AlertTitle>
            </Alert>

            {/* Bố cục chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sơ đồ ghế */}
                <div className="lg:col-span-2">
                    {showtime.theater.seat_map ? (
                        <SeatMap 
                            seatMapData={showtime.theater.seat_map}
                            basePrice={parseInt(showtime.price)}
                            onSeatsSelected={handleSeatsSelected}
                        />
                    ) : (
                        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
                            <p className="text-gray-600">Sơ đồ ghế chưa có sẵn</p>
                        </div>
                    )}
                </div>

                {/* Tóm tắt */}
                <div className="lg:col-span-1">
                    <BookingSummary 
                        selectedSeats={selectedSeats}
                        totalPrice={totalPrice}
                        showtimeId={showtimeId || ''}
                        movieTitle={showtime.movie.title}
                        theaterName={showtime.theater.name}
                        showtimeDate={showtime.showtime_date}
                        showtimeTime={showtime.showtime_time}
                    />
                </div>
            </div>
        </div>
    );
}