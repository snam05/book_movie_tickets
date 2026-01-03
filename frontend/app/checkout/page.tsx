'use client'; // Đảm bảo toàn bộ file hoặc component form là Client Component

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const mockOrder = {
    movie: "Vùng Đất Quỷ Dữ: Sự Trỗi Dậy",
    showtime: "18:30 | Phòng 1",
    seats: [{ name: "A5", price: 120000 }, { name: "A6", price: 120000 }],
    total: 240000,
};

function CheckoutForm() {
    // 1. Sử dụng Lazy Initializer để đọc localStorage ngay khi khởi tạo
    const [customerInfo, setCustomerInfo] = useState(() => {
        // Kiểm tra xem có đang chạy ở trình duyệt không
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    return {
                        name: user.full_name || '',
                        email: user.email || '',
                        phone: ''
                    };
                } catch (e) {
                    console.error("Lỗi parse user:", e);
                }
            }
        }
        return { name: '', email: '', phone: '' };
    });

    return (
        <Card>
            <CardHeader><CardTitle className="text-2xl text-red-600">Thông Tin Khách Hàng</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và Tên</Label>
                    <Input 
                        id="name" 
                        value={customerInfo.name} 
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Nguyễn Văn A" 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="email@example.com" 
                        required 
                        readOnly 
                        className="bg-gray-50 opacity-70 cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input 
                        id="phone" 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="090 123 4567" 
                        required 
                    />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                    <Label>Phương Thức Thanh Toán</Label>
                    <Select required>
                        <SelectTrigger><SelectValue placeholder="Chọn phương thức" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="card">Thẻ Tín Dụng/ATM</SelectItem>
                            <SelectItem value="momo">Ví Momo</SelectItem>
                            <SelectItem value="transfer">Chuyển Khoản Ngân Hàng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

function OrderSummary({ order }: { order: typeof mockOrder }) {
    return (
        <Card className="sticky top-20"> 
            <CardHeader><CardTitle className="text-2xl">Chi Tiết Đơn Hàng</CardTitle></CardHeader>
            <CardContent>
                <p className="font-semibold text-lg mb-2">{order.movie}</p>
                <p className="text-sm text-gray-600 mb-4">Suất chiếu: {order.showtime}</p>
                <Table>
                    <TableHeader><TableRow><TableHead>Ghế</TableHead><TableHead className="text-right">Giá</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {order.seats.map((seat) => (
                            <TableRow key={seat.name}>
                                <TableCell>{seat.name}</TableCell>
                                <TableCell className="text-right">{seat.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardContent>
                <div className="flex justify-between font-bold text-xl pt-2 border-t mt-4">
                    <span>TỔNG THANH TOÁN:</span>
                    <span className="text-red-600">{order.total.toLocaleString('vi-VN')} VNĐ</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">Xác Nhận & Thanh Toán</Button>
            </CardFooter>
        </Card>
    );
}

export default function CheckoutPage() {
    return (
        <div className="py-10 space-y-8">
            <h1 className="text-3xl font-extrabold text-red-600">Thanh Toán Đặt Vé</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><CheckoutForm /></div>
                <div className="lg:col-span-1"><OrderSummary order={mockOrder} /></div>
            </div>
        </div>
    );
}