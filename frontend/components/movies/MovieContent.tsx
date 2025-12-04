// frontend/components/movies/MovieContent.tsx

import { getMovieDetail } from '@/data/movies';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Clock, Star, Calendar } from 'lucide-react';
import { ShowtimeButton } from './ShowtimeButton'; // Import component con

// Component này nhận movieId (đã được chuyển đổi an toàn)
export async function MovieContent({ movieId }: { movieId: number }) { 
    // Vẫn nên dùng async/await nếu sau này bạn dùng fetch() API thực tế
    const movie = getMovieDetail(movieId); 

    if (!movie) {
        return (
            <div className="text-center text-xl mt-10 p-10 border border-red-300 bg-red-50 rounded-lg">
                Không tìm thấy phim có ID: {movieId}. Vui lòng kiểm tra dữ liệu giả.
            </div>
        );
    }
    
    // Toàn bộ giao diện từ trước:
    return (
        <div className="space-y-10">
          
          {/* Phần 1: Thông tin Chung (Bố cục 2 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Cột 1: Poster */}
            <div className="md:col-span-1">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto rounded-lg shadow-xl" />
            </div>

            {/* Cột 2: Thông tin chi tiết */}
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-4xl font-extrabold text-red-600">{movie.title}</h1>
              
              {/* Thông tin nhanh */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" /> 
                    **{movie.rating}**
                </span>
                <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> 
                    {movie.duration} phút
                </span>
                <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> 
                    {movie.releaseDate}
                </span>
              </div>

              <Separator className="my-4" />
              
              <p className="text-gray-700">{movie.description}</p>
              
              {/* Chi tiết phụ */}
              <div className="text-sm space-y-1 pt-2">
                <p><span className="font-semibold">Đạo diễn:</span> {movie.director}</p>
                <p><span className="font-semibold">Diễn viên:</span> {movie.actors}</p>
                <p><span className="font-semibold">Thể loại:</span> {movie.genre.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Phần 2: Lịch Chiếu (Showtimes) */}
          <section className="mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Chọn Suất Chiếu</h2>
            
            {/* Bộ lọc Ngày */}
            <div className="flex items-center space-x-4 mb-6 p-3 bg-red-50 rounded-lg">
                <p className="font-semibold text-red-700">Ngày:</p>
                <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700">Hôm nay</Button>
                <Button variant="outline">Ngày mai</Button>
            </div>
            
            {/* Hiển thị các giờ chiếu */}
            <div className="border p-6 rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Phòng chiếu 2D</h3>
              <div className="flex flex-wrap gap-4">
                {movie.showtimes.map((showtime) => (
                    <ShowtimeButton key={showtime.id} showtime={showtime} />
                ))}
                 <Button disabled variant="outline" className="opacity-50">23:00 (Hết)</Button> 
              </div>
            </div>
          </section>
          
        </div>
    );
}