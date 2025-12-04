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

// frontend/data/movies.ts (Thêm vào cuối tệp)

import { MovieDetail } from '@/types/movie';

// Hàm giả lập việc lấy dữ liệu chi tiết
export const getMovieDetail = (id: number): MovieDetail | undefined => {
  if (id === 1 || id === 2) { // Giả sử ID 1 và 2 có dữ liệu chi tiết
    return {
      id: 1,
      title: "Vùng Đất Quỷ Dữ: Sự Trỗi Dậy",
      posterUrl: "https://via.placeholder.com/400x600/0000FF/FFFFFF?text=DETAIL+MOVIE+1",
      genre: ["Hành Động", "Kinh Dị"],
      duration: 115,
      rating: 7.8,
      releaseDate: "2025-01-01",
      director: "Đạo Diễn A",
      actors: "Diễn Viên X, Diễn Viên Y",
      description: "Bộ phim kể về một nhóm thám tử dũng cảm điều tra về một virus bí ẩn đang biến cư dân thành những sinh vật khát máu, đẩy nhân loại vào bờ vực thẳm. Đồ họa ấn tượng và cốt truyện kịch tính.",
      showtimes: [
        { id: 's1', time: "10:30", theater: "Phòng 1", price: 95000 },
        { id: 's2', time: "14:00", theater: "Phòng 2", price: 110000 },
        { id: 's3', time: "18:30", theater: "Phòng 1", price: 120000 },
        { id: 's4', time: "22:00", theater: "Phòng 3", price: 110000 },
      ],
    };
  }
  return undefined;
};