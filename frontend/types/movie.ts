// frontend/types/movie.ts (Cập nhật)

// Định nghĩa cơ bản cho Phim (đã có)
export type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  genre: string[];
  duration: number;
  rating: number;
};

// Định nghĩa cho một Suất chiếu
export type Showtime = {
  id: string;
  time: string; // Ví dụ: "10:30"
  theater: string; // Ví dụ: "Phòng 1"
  price: number;
};

// Định nghĩa cho Chi tiết Phim (bao gồm lịch chiếu)
export type MovieDetail = Movie & {
  description: string; // Tóm tắt nội dung
  releaseDate: string;
  director: string;
  actors: string;
  showtimes: Showtime[]; // Lịch chiếu
};

export type Seat = {
  id: string; // Ví dụ: "A1", "VIP-C5"
  row: string;
  number: number;
  status: 'available' | 'booked' | 'vip' | 'selected';
  price: number;
};