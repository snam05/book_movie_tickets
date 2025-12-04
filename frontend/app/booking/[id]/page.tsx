// frontend/app/booking/[id]/page.tsx

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { SeatMap } from '@/components/booking/SeatMap';

// Sử dụng 'async' và 'await params' là BẮT BUỘC để truy cập ID an toàn
export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    
    // Khắc phục lỗi: Giải quyết Promise của params
    const { id: showtimeId } = await params; 

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Chọn Ghế: Suất Chiếu #{showtimeId}
            </h1>

            {/* 1. Thông báo Màn hình (Sử dụng Alert của shadcn/ui) */}
            <Alert variant="default" className="bg-gray-800 text-white text-center py-4 rounded-b-none shadow-xl">
                <AlertTitle className="text-2xl font-extrabold tracking-widest">MÀN HÌNH CHIẾU</AlertTitle>
            </Alert>

            {/* 2. Bố cục chính: Bản đồ Ghế (2 cột) và Tóm tắt (1 cột) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cột 1 & 2: Khu vực Bản đồ Ghế */}
                <div className="lg:col-span-2 flex flex-col items-center">
                    {/* TRUYỀN showtimeId động vào SeatMap */}
                    <SeatMap showtimeId={showtimeId} /> 

                    {/* Chú thích màu sắc ghế (Sử dụng Badge tùy chỉnh) */}
                    <div className="flex flex-wrap space-x-4 justify-center text-sm mt-6 p-3 border rounded-lg bg-gray-50">
                        <span className="flex items-center">
                            <Badge className="w-4 h-4 mr-2 bg-green-600 hover:bg-green-600"></Badge> Đang Chọn
                        </span>
                        <span className="flex items-center">
                            <Badge className="w-4 h-4 mr-2 bg-red-300 hover:bg-red-300"></Badge> Đã Bán
                        </span>
                        <span className="flex items-center">
                            <Badge className="w-4 h-4 mr-2 bg-yellow-500 hover:bg-yellow-500"></Badge> VIP
                        </span>
                        <span className="flex items-center">
                            <Badge className="w-4 h-4 mr-2 bg-gray-300 hover:bg-gray-300"></Badge> Còn Trống
                        </span>
                    </div>
                </div>

                {/* Cột 3: Tóm tắt Đơn hàng */}
                <div className="lg:col-span-1">
                    <BookingSummary />
                </div>
            </div>
        </div>
    );
}