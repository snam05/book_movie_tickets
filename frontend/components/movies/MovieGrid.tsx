// frontend/components/movies/MovieGrid.tsx

import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    // Sử dụng CSS Grid của Tailwind để tạo lưới phản hồi
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}