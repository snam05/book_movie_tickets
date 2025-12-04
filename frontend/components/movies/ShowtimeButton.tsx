// frontend/components/movies/ShowtimeButton.tsx

import { Showtime } from '@/types/movie';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ShowtimeButton({ showtime }: { showtime: Showtime }) {
    // Đường dẫn đến trang đặt vé, ví dụ: /booking/s1
    const bookingLink = `/booking/${showtime.id}`; 
    return (
        <Link href={bookingLink}>
            <Button 
                variant="outline" 
                className="hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
                {showtime.time} 
                <span className="ml-2 text-xs opacity-70">
                    {showtime.theater}
                </span>
            </Button>
        </Link>
    );
}