//frontend/app/movie/[id]/page.tsx (Đặt component này phía trên MovieDetailPage)

import { Showtime } from '@/types/movie';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ShowtimeButton({ showtime }: { showtime: Showtime }) {
    // Đường dẫn đến trang đặt vé (ví dụ: /booking/s1)
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



// frontend/app/movie/[id]/page.tsx

import { getMovieDetail } from '@/data/movies';
import { MovieDetail as MovieDetailType } from '@/types/movie';
import { Separator } from '@/components/ui/separator';
import { Clock, Star, Calendar, User } from 'lucide-react';
// (Import ShowtimeButton ở trên)

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  // Lấy dữ liệu chi tiết phim
//   const movie = getMovieDetail(Number(params.id));
    const movie = getMovieDetail(1);

  if (!movie) {
    return <div className="text-center text-xl mt-10">Không tìm thấy phim.</div>;
  }

  return (
    <div className="space-y-10">
      {/* 1. Phần Thông tin Chung (Bố cục 2 cột) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Poster */}
        <div className="md:col-span-1">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-auto rounded-lg shadow-xl" 
          />
        </div>

        {/* Cột 2: Thông tin chi tiết */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-extrabold text-red-600">{movie.title}</h1>
          
          {/* Thông tin nhanh (Sử dụng các Icons) */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center"><Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" /> **{movie.rating}**</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {movie.duration} phút</span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {movie.releaseDate}</span>
          </div>

          <Separator className="my-4" />
          
          <p className="text-gray-700">{movie.description}</p>
          
          <div className="text-sm space-y-1 pt-2">
            <p><span className="font-semibold">Đạo diễn:</span> {movie.director}</p>
            <p><span className="font-semibold">Diễn viên:</span> {movie.actors}</p>
            <p><span className="font-semibold">Thể loại:</span> {movie.genre.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* 2. Phần Lịch Chiếu (Showtimes) */}
      <section className="mt-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Chọn Suất Chiếu</h2>
        
        {/* Lọc theo ngày (Có thể sử dụng Component Date Picker của shadcn/ui) */}
        <div className="flex items-center space-x-4 mb-6 p-3 bg-red-50 rounded-lg">
            <p className="font-semibold text-red-700">Ngày:</p>
            <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700">Hôm nay</Button>
            <Button variant="outline">Ngày mai</Button>
            {/* ... thêm Date Picker nếu cần */}
        </div>
        
        {/* Hiển thị các giờ chiếu */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-semibold mb-4 text-red-600">Phòng chiếu 2D</h3>
          <div className="flex flex-wrap gap-4">
            {movie.showtimes.map((showtime) => (
                <ShowtimeButton key={showtime.id} showtime={showtime} />
            ))}
            {/* Minh họa suất chiếu đã hết */}
            <Button disabled variant="outline" className="opacity-50">23:00 (Hết)</Button> 
          </div>
        </div>
      </section>
      
    </div>
  );
}