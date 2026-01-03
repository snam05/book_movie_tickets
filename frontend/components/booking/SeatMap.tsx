// frontend/components/booking/SeatMap.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Seat type từ backend
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

// Hàm lấy class CSS cho ghế
const getSeatClass = (seat: SeatData, isSelected: boolean) => {
    if (isSelected) return 'bg-green-600 hover:bg-green-700 text-white shadow-lg';
    if (seat.isBooked) return 'bg-red-400 cursor-not-allowed text-white';
    
    switch (seat.type) {
        case 'vip':
            return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md';
        case 'couple':
            return 'bg-pink-400 hover:bg-pink-500 text-white shadow-md';
        case 'standard':
        default:
            return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    }
};

type SeatMapProps = {
    seatMapData: SeatMapData;
    basePrice: number;
    onSeatsSelected: (seats: SeatData[], totalPrice: number) => void;
};

export function SeatMap({ seatMapData, basePrice, onSeatsSelected }: SeatMapProps) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    
    const handleSeatClick = (seat: SeatData) => {
        if (seat.isBooked) return;

        if (selectedSeats.includes(seat.id)) {
            // Hủy chọn
            const newSelected = selectedSeats.filter(id => id !== seat.id);
            setSelectedSeats(newSelected);
            updateSelection(newSelected);
        } else {
            // Chọn (Giới hạn tối đa 8 ghế)
            if (selectedSeats.length >= 8) {
                alert("Chỉ có thể chọn tối đa 8 ghế!");
                return;
            }
            
            const newSelected = [...selectedSeats, seat.id];
            setSelectedSeats(newSelected);
            updateSelection(newSelected);
        }
    };

    const updateSelection = (seatIds: string[]) => {
        const seats: SeatData[] = [];
        let totalPrice = 0;

        seatMapData.layout.forEach(row => {
            row.forEach(seat => {
                if (seatIds.includes(seat.id)) {
                    seats.push(seat);
                    const multiplier = seatMapData.pricing[seat.type] || 1.0;
                    totalPrice += basePrice * multiplier;
                }
            });
        });

        onSeatsSelected(seats, totalPrice);
    };

    const maxCols = seatMapData.seatsPerRow;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Sơ đồ Ghế</h3>
            
            {/* Lưới mô phỏng các hàng ghế */}
            <div 
                className="grid gap-x-2 gap-y-4 justify-items-center mb-6"
                style={{ gridTemplateColumns: `auto repeat(${maxCols}, 1fr)` }}
            >
                {seatMapData.layout.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {/* Hiển thị tên hàng */}
                        <span className="text-sm font-bold text-gray-700 flex items-center">
                            {row[0]?.row}
                        </span>
                        
                        {/* Render ghế trong hàng */}
                        {row.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.id);
                            return (
                                <Button
                                    key={seat.id}
                                    size="sm"
                                    disabled={seat.isBooked}
                                    onClick={() => handleSeatClick(seat)}
                                    className={cn(
                                        'w-9 h-9 p-0 rounded text-xs font-semibold transition-all duration-150',
                                        getSeatClass(seat, isSelected)
                                    )}
                                    title={`${seat.id} - ${seat.type}${seat.isBooked ? ' (Đã đặt)' : ''}`}
                                >
                                    {seat.number}
                                </Button>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
            
            {/* Ghế đã chọn */}
            <div className="pt-4 border-t">
                <p className="font-semibold text-gray-700 mb-2">Ghế đã chọn:</p>
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map(id => (
                            <Badge key={id} className="bg-green-100 text-green-700 border border-green-700">
                                {id}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Chưa chọn ghế nào</p>
                    )}
                </div>
            </div>
            
            {/* Chú thích */}
            <div className="flex flex-wrap gap-4 justify-center text-sm mt-6 p-3 border rounded-lg bg-gray-50">
                <span className="flex items-center">
                    <Badge className="w-4 h-4 mr-2 bg-gray-300 hover:bg-gray-300"></Badge> Thường
                </span>
                <span className="flex items-center">
                    <Badge className="w-4 h-4 mr-2 bg-yellow-500 hover:bg-yellow-500"></Badge> VIP
                </span>
                <span className="flex items-center">
                    <Badge className="w-4 h-4 mr-2 bg-pink-400 hover:bg-pink-400"></Badge> Couple
                </span>
                <span className="flex items-center">
                    <Badge className="w-4 h-4 mr-2 bg-red-400 hover:bg-red-400"></Badge> Đã đặt
                </span>
                <span className="flex items-center">
                    <Badge className="w-4 h-4 mr-2 bg-green-600 hover:bg-green-600"></Badge> Đang chọn
                </span>
            </div>
        </div>
    );
}