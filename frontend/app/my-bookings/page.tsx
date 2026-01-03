'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IBooking } from '@/types/booking';
import { getMyBookings, cancelBooking } from '@/lib/api/bookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, X, Loader2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300'
};

const statusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành'
};

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (booking: IBooking) => {
        setSelectedBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedBooking) return;

        try {
            setCancelling(true);
            await cancelBooking(selectedBooking.id);
            setCancelDialogOpen(false);
            fetchBookings(); // Refresh danh sách
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Không thể hủy vé. Vui lòng thử lại.');
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // HH:MM
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Vé Của Tôi</h1>
                    <p className="text-gray-600">Quản lý và theo dõi các vé đã đặt của bạn</p>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có vé nào</h3>
                            <p className="text-gray-500 mb-6">Hãy đặt vé xem phim yêu thích của bạn!</p>
                            <Button 
                                onClick={() => router.push('/')}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Đặt vé ngay
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Movie Poster */}
                                        <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0">
                                            <Image
                                                src={booking.showtime.movie.poster_url}
                                                alt={booking.showtime.movie.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Booking Info */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                        {booking.showtime.movie.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={`${statusColors[booking.booking_status]} border font-semibold`}>
                                                            {statusLabels[booking.booking_status]}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500 font-mono">
                                                            #{booking.booking_code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Theater & Location */}
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {booking.showtime.theater.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {booking.showtime.theater.theater_type.toUpperCase()}
                                                            </Badge>
                                                            {booking.showtime.theater.status === 'maintenance' && (
                                                                <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                                                    Bảo trì
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date & Time */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-5 w-5 text-red-600 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">
                                                            {formatDate(booking.showtime.showtime_date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-5 w-5 text-red-600 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">
                                                            {formatTime(booking.showtime.showtime_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Theater Maintenance Warning */}
                                            {booking.showtime.theater.status === 'maintenance' && (
                                                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-semibold text-orange-900 mb-1">
                                                                Rạp đang bảo trì
                                                            </p>
                                                            <p className="text-sm text-orange-800">
                                                                Rạp chiếu đang trong quá trình bảo trì. Vui lòng liên hệ nhân viên để được hỗ trợ về vé đã đặt.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Seats */}
                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Ghế đã đặt:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {booking.seats.map((seat, idx) => (
                                                        <Badge 
                                                            key={idx} 
                                                            variant="secondary"
                                                            className="font-mono"
                                                        >
                                                            {seat.seat_row}{seat.seat_number}
                                                            {seat.seat_type !== 'standard' && (
                                                                <span className="ml-1 text-xs">
                                                                    ({seat.seat_type === 'vip' ? 'VIP' : 'Đôi'})
                                                                </span>
                                                            )}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div>
                                                    <p className="text-sm text-gray-600">Tổng tiền</p>
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {formatPrice(Number(booking.total_price))}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {booking.booking_status === 'pending' && (
                                                        <Button
                                                            variant="outline"
                                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                                            onClick={() => handleCancelClick(booking)}
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Hủy vé
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận hủy vé</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy vé <span className="font-mono font-semibold">#{selectedBooking?.booking_code}</span>?
                            <br />
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={cancelling}
                        >
                            Không
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelConfirm}
                            disabled={cancelling}
                        >
                            {cancelling ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang hủy...
                                </>
                            ) : (
                                'Có, hủy vé'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
