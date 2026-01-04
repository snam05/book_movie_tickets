// frontend/components/movies/MovieContent.tsx
'use client';

import { MovieFromAPI } from '@/lib/api/movies';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Clock, Star, Calendar, Film } from 'lucide-react';
import { ShowtimeButton } from './ShowtimeButton';
import { ShowtimeCard } from './ShowtimeCard';

// Client Component - nhận movie data từ Server Component
export function MovieContent({ movie }: { movie: MovieFromAPI }) {
    
    // Format data
    const posterUrl = movie.poster_url && movie.poster_url !== '/posters/' 
        ? movie.poster_url 
        : 'https://via.placeholder.com/300x450/1e293b/ffffff?text=No+Poster';
    
    const genreNames = movie.genres?.map(g => g.name).join(', ') || 'Chưa phân loại';
    const releaseDate = new Date(movie.release_date).toLocaleDateString('vi-VN');
    
    return (
        <div className="space-y-10">
          
          {/* Phần 1: Thông tin Chung (Bố cục 2 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Cột 1: Poster */}
            <div className="md:col-span-1">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-full h-auto rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450/1e293b/ffffff?text=No+Poster';
                }}
              />
              
              {/* Badge trạng thái */}
              <div className="mt-4">
                {movie.status === 'now_showing' && (
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🎬 Đang chiếu
                  </span>
                )}
                {movie.status === 'coming_soon' && (
                  <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🎞️ Sắp chiếu
                  </span>
                )}
              </div>
            </div>

            {/* Cột 2: Thông tin chi tiết */}
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-4xl font-extrabold text-red-600">{movie.title}</h1>
              
              {/* Thông tin nhanh */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" /> 
                    <span className="font-bold">{movie.rating}</span>/10
                </span>
                <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> 
                    {movie.duration} phút
                </span>
                <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> 
                    {releaseDate}
                </span>
                <span className="flex items-center">
                    <Film className="w-4 h-4 mr-1" /> 
                    {movie.age_rating}
                </span>
              </div>

              <Separator className="my-4" />
              
              <p className="text-gray-700 leading-relaxed">{movie.description}</p>
              
              {/* Chi tiết phụ */}
              <div className="text-sm space-y-2 pt-4 bg-gray-50 p-4 rounded-lg">
                <p><span className="font-semibold text-gray-800">Đạo diễn:</span> <span className="text-gray-600">{movie.director}</span></p>
                <p><span className="font-semibold text-gray-800">Diễn viên:</span> <span className="text-gray-600">{movie.actors}</span></p>
                <p><span className="font-semibold text-gray-800">Thể loại:</span> <span className="text-gray-600">{genreNames}</span></p>
              </div>
              
              {/* Trailer Button */}
              {movie.trailer_url && (
                <div className="pt-4">
                  <a 
                    href={movie.trailer_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-red-600 hover:bg-red-700">
                      🎥 Xem Trailer
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Phần 2: Lịch Chiếu (Showtimes) */}
          <section className="mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Lịch Chiếu</h2>
            
            {movie.status === 'coming_soon' ? (
              <div className="border p-6 rounded-lg shadow-md bg-blue-50 text-center">
                <p className="text-blue-600 font-semibold">🎞️ Phim sắp chiếu - Lịch chiếu sẽ được cập nhật sớm!</p>
              </div>
            ) : movie.showtimes && movie.showtimes.length > 0 ? (
              <div className="space-y-6">
                {/* Nhóm lịch chiếu theo ngày */}
                {Object.entries(
                  movie.showtimes.reduce((acc, showtime) => {
                    const date = showtime.showtime_date;
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(showtime);
                    return acc;
                  }, {} as Record<string, typeof movie.showtimes>)
                ).map(([date, showtimes]) => {
                  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  return (
                    <div key={date} className="border rounded-lg shadow-sm bg-white p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        📅 {formattedDate}
                      </h3>
                      
                      {/* Nhóm theo rạp */}
                      {Object.entries(
                        showtimes.reduce((acc, showtime) => {
                          const theaterName = showtime.theater.name;
                          if (!acc[theaterName]) acc[theaterName] = [];
                          acc[theaterName].push(showtime);
                          return acc;
                        }, {} as Record<string, typeof showtimes>)
                      ).map(([theaterName, theaterShowtimes]) => (
                        <div key={theaterName} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2 mb-3">
                            <Film className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-gray-700">{theaterName}</span>
                            <span className="text-xs text-gray-500">({theaterShowtimes[0].theater.theater_type})</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            {theaterShowtimes
                              .sort((a, b) => a.showtime_time.localeCompare(b.showtime_time))
                              .map((showtime) => (
                              <ShowtimeCard 
                                key={showtime.id}
                                showtimeId={showtime.id}
                                time={showtime.showtime_time}
                                price={showtime.price}
                                availableSeats={showtime.available_seats}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border p-6 rounded-lg shadow-md bg-gray-50 text-center">
                <p className="text-gray-500">Hiện tại chưa có lịch chiếu cho phim này.</p>
              </div>
            )}
          </section>
          
        </div>
    );
}