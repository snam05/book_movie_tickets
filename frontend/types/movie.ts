// frontend/types/movie.ts

export type Movie = {
  id: number;
  title: string;
  posterUrl: string; // Đường dẫn đến ảnh poster
  genre: string[];
  duration: number; // phút
  rating: number; // Điểm đánh giá
};