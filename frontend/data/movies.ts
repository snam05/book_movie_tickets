// frontend/data/movies.ts

import { MovieDetail, Movie } from '@/types/movie'; // Đảm bảo bạn đã định nghĩa kiểu MovieDetail

// Dữ liệu giả lập chi tiết
const detailedMovies: MovieDetail[] = [
  {
    id: 1,
    title: "Vùng Đất Quỷ Dữ: Sự Trỗi Dậy",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP6Oi8xE-f09qmPM82L6bUqj6hVbxNOJgQOA&s",
    genre: ["Hành Động", "Kinh Dị"],
    duration: 115,
    rating: 7.8,
    releaseDate: "2025-01-01",
    director: "Đạo Diễn A",
    actors: "Diễn Viên X, Diễn Viên Y, Diễn Viên Z",
    description: "Bộ phim hành động kinh dị về một virus bí ẩn đang biến cư dân thành những sinh vật khát máu. Đồ họa ấn tượng và cốt truyện kịch tính.",
    showtimes: [
        { id: 's1', time: "10:30", theater: "Phòng 1", price: 95000 },
        { id: 's2', time: "14:00", theater: "Phòng 2", price: 110000 },
    ],
  },
  {
    id: 2,
    title: "Chuyến Tàu Định Mệnh",
    posterUrl: "https://via.placeholder.com/400x600/FF0000/FFFFFF?text=DETAIL+MOVIE+2",
    genre: ["Tâm Lý", "Giật Gân"],
    duration: 140,
    rating: 8.5,
    releaseDate: "2024-12-15",
    director: "Đạo Diễn B",
    actors: "Diễn Viên M, Diễn Viên N",
    description: "Một chuyến tàu kỳ lạ bắt đầu hành trình không lối thoát với những bí mật đen tối của các hành khách.",
    showtimes: [
        { id: 's3', time: "09:00", theater: "Phòng 4", price: 90000 },
        { id: 's4', time: "16:45", theater: "Phòng 5", price: 115000 },
    ],
  },
];

// Hàm lấy dữ liệu chi tiết (Đồng bộ)
export const getMovieDetail = (id: number): MovieDetail | undefined => {
  // Tìm kiếm phim theo ID
  return detailedMovies.find(movie => movie.id === id);
};

// Hàm lấy dữ liệu tóm tắt cho Trang Chủ (Nếu cần)
export const mockMovies: Movie[] = detailedMovies.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterUrl: movie.posterUrl,
    genre: movie.genre,
    duration: movie.duration,
    rating: movie.rating,
}));