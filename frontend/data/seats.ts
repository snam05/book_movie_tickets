// frontend/data/seats.ts

import { Seat } from '@/types/movie';

// Hàm giả lập sơ đồ ghế cho một rạp/suất chiếu
export const getSeatMapData = (showtimeId: string): Seat[] => {
    // Luôn trả về cùng một sơ đồ, nhưng trong ứng dụng thật, dữ liệu sẽ thay đổi
    // tùy theo showtimeId

    const seatMap: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 8;
    
    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            let status: Seat['status'] = 'available';
            let price = 100000;
            
            // Logic giả lập:
            if (row === 'A' && i === 2) {
                status = 'booked'; // Ghế A2 đã bán
            } else if (row === 'D' || row === 'E') {
                status = 'vip'; // Hàng D, E là VIP
                price = 120000;
            } else if (row === 'C' && i === 7) {
                 status = 'booked'; // Ghế C7 đã bán
            }
            
            seatMap.push({
                id: `${row}${i}`,
                row: row,
                number: i,
                status: status,
                price: price,
            });
        }
    });

    return seatMap;
};