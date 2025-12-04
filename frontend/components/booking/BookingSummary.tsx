// frontend/components/booking/BookingSummary.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

// Dữ liệu giả định về các ghế đã chọn để minh họa
const mockSelectedSeats = [
    { seat: "A5", price: 100000 },
    { seat: "A6", price: 100000 },
];
const totalAmount = mockSelectedSeats.reduce((sum, item) => sum + item.price, 0);

export function BookingSummary() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-red-600">
                    Tóm Tắt Đơn Hàng
                </CardTitle>
                <CardDescription>
                    Phim: Vùng Đất Quỷ Dữ | 18:30 | Phòng 1
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Bảng chi tiết ghế đã chọn (Sử dụng Table của shadcn/ui) */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ghế</TableHead>
                            <TableHead className="text-right">Giá (VNĐ)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockSelectedSeats.map((item) => (
                            <TableRow key={item.seat}>
                                <TableCell className="font-medium">{item.seat}</TableCell>
                                <TableCell className="text-right">{item.price.toLocaleString('vi-VN')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full text-lg font-bold">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-red-600">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                {/* Nút Thanh toán (Sử dụng Button của shadcn/ui) */}
                <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                        Tiếp tục Thanh toán
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}