'use client';

import { Button } from '@/components/ui/button';

interface ShowtimeCardProps {
  showtimeId: number;
  time: string;
  price: string;
  availableSeats: number;
}

export function ShowtimeCard({ showtimeId, time, price, availableSeats }: ShowtimeCardProps) {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-red-50 hover:border-red-500"
      asChild
    >
      <a href={`/booking/${showtimeId}`}>
        <span className="font-bold text-lg">{time.slice(0, 5)}</span>
        <span className="text-xs text-gray-500">{parseInt(price).toLocaleString('vi-VN')}đ</span>
        <span className="text-xs text-green-600">{availableSeats} ghế</span>
      </a>
    </Button>
  );
}
