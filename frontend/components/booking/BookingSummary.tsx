// frontend/components/booking/BookingSummary.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type SeatData = {
    id: string;
    row: string;
    number: number;
    type: 'standard' | 'vip' | 'couple';
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
    
    const handleCheckout = () => {
        // TODO: Navigate to checkout page with booking data
        console.log('Checkout:', { selectedSeats, totalPrice, showtimeId });
        alert('Chức năng thanh toán đang phát triển');
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
                                        {(totalPrice / selectedSeats.length).toLocaleString('vi-VN')}
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
                    disabled={selectedSeats.length === 0}
                    onClick={handleCheckout}
                >
                    Tiến Hành Thanh Toán
                </Button>
            </CardFooter>
        </Card>
    );
}