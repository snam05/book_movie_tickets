// frontend/components/booking/SeatMap.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getSeatMapData } from '@/data/seats'; // <-- IMPORT DỮ LIỆU
import { Seat } from '@/types/movie'; // <-- IMPORT KIỂU DỮ LIỆU

// Hàm lấy kiểu dáng dựa trên trạng thái (Không thay đổi)
const getSeatClass = (status: Seat['status'], isSelected: boolean) => {
    if (isSelected) return 'bg-green-600 hover:bg-green-700 text-white shadow-lg';
    switch (status) {
        case 'available':
            return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
        case 'vip':
            return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md';
        case 'booked':
            return 'bg-red-300 cursor-not-allowed text-white';
        default:
            return 'bg-gray-300';
    }
};

// Component nhận ID suất chiếu làm prop
export function SeatMap({ showtimeId }: { showtimeId: string }) {
    
    // 1. Lấy dữ liệu sơ đồ ghế dựa trên showtimeId (sử dụng useMemo để tránh re-run)
    const seats = useMemo(() => getSeatMapData(showtimeId), [showtimeId]);
    
    // State để quản lý các ghế đã chọn
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    
    const handleSeatClick = (seatId: string, status: Seat['status']) => {
        if (status === 'booked') return;

        if (selectedSeats.includes(seatId)) {
            // Hủy chọn
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            // Chọn (Giới hạn tối đa 6 ghế)
            if (selectedSeats.length < 6) {
                setSelectedSeats([...selectedSeats, seatId]);
            } else {
                alert("Chỉ có thể chọn tối đa 6 ghế!");
            }
        }
    };

    // Tìm số lượng cột lớn nhất để định nghĩa Grid
    const maxCols = 8; // Đặt thủ công hoặc tính toán từ dữ liệu

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Sơ đồ Ghế</h3>
            
            {/* Lưới mô phỏng các hàng ghế */}
            <div 
                className={`grid gap-x-2 gap-y-4 justify-items-center`}
                style={{ gridTemplateColumns: `auto repeat(${maxCols}, 1fr)` }} // Thiết lập cột dựa trên maxCols
            >
                {seats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                        <React.Fragment key={seat.id}>
                            {/* Hiển thị tên hàng (chỉ cột đầu tiên) */}
                            {seat.number === 1 && (
                                <span className="text-sm font-bold text-gray-700 mt-2">{seat.row}</span>
                            )}
                            
                            {/* Button của shadcn/ui mô phỏng ghế */}
                            <Button
                                size="sm"
                                disabled={seat.status === 'booked'}
                                onClick={() => handleSeatClick(seat.id, seat.status)}
                                className={cn(
                                    'w-8 h-8 p-0 rounded-sm text-xs font-semibold transition-all duration-150',
                                    getSeatClass(seat.status, isSelected)
                                )}
                            >
                                {seat.number}
                            </Button>
                        </React.Fragment>
                    );
                })}
            </div>
            
            {/* Vùng Ghế Đã Chọn */}
            <div className="mt-8 pt-4 border-t">
                <p className="font-semibold text-gray-700">Ghế đã chọn:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map(id => (
                            <Badge key={id} className="bg-green-100 text-green-700 border border-green-700">
                                {id}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Chưa chọn ghế nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}