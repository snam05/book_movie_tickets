// frontend/data/movies.ts
import { Movie } from '@/types/movie';

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Vùng Đất Quỷ Dữ: Sự Trỗi Dậy",
    posterUrl: "https://via.placeholder.com/300x450/0000FF/FFFFFF?text=MOVIE+1",
    genre: ["Hành Động", "Kinh Dị"],
    duration: 115,
    rating: 7.8,
  },
  {
    id: 2,
    title: "Chuyến Tàu Định Mệnh",
    posterUrl: "https://via.placeholder.com/300x450/FF0000/FFFFFF?text=MOVIE+2",
    genre: ["Tâm Lý", "Giật Gân"],
    duration: 140,
    rating: 8.5,
  },
  // Thêm nhiều phim hơn để kiểm tra giao diện...
];