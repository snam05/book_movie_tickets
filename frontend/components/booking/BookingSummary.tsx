// frontend/components/booking/BookingSummary.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type SeatData = {
    id: string;
    row: string;
    number: number;
    type: 'standard' | 'vip' | 'couple';
    pairWith?: string;
    price?: number;
};

type BookingSummaryProps = {
    selectedSeats: SeatData[];
    totalPrice: number;
    showtimeId: string;
    movieTitle: string;
    theaterName: string;
    showtimeDate: string;
    showtimeTime: string;
};

export function BookingSummary({ 
    selectedSeats, 
    totalPrice, 
    showtimeId,
    movieTitle,
    theaterName,
    showtimeDate,
    showtimeTime
}: BookingSummaryProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ghế');
            return;
        }

        setLoading(true);
        
        try {
            // Kiểm tra user đã đăng nhập bằng localStorage
            const user = localStorage.getItem('user');
            
            if (!user) {
                alert('Vui lòng đăng nhập để đặt vé');
                router.push('/auth/signin');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    showtimeId: parseInt(showtimeId),
                    seats: selectedSeats,
                    paymentMethod: 'cash'
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Đặt vé thất bại');
            }

            alert(`Đặt vé thành công! Mã đặt vé: ${result.data.booking_code}`);
            router.push('/my-bookings');
            
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-red-600">
                    Tóm Tắt Đơn Hàng
                </CardTitle>
                <CardDescription>
                    {movieTitle} | {showtimeTime} | {theaterName}
                    <br />
                    {new Date(showtimeDate).toLocaleDateString('vi-VN')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {selectedSeats.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ghế</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead className="text-right">Giá</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedSeats.map((seat) => (
                                <TableRow key={seat.id}>
                                    <TableCell className="font-medium">{seat.id}</TableCell>
                                    <TableCell className="capitalize">{seat.type}</TableCell>
                                    <TableCell className="text-right">
                                        {(seat.price ?? Math.round(totalPrice / selectedSeats.length)).toLocaleString('vi-VN')} VNĐ
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        Chưa chọn ghế nào
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full text-lg font-bold">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-red-600">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                <Button 
                    size="lg" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    disabled={selectedSeats.length === 0 || loading}
                    onClick={handleCheckout}
                >
                    {loading ? 'Đang xử lý...' : 'Đã Thanh Toán'}
                </Button>
            </CardFooter>
        </Card>
    );
}