// frontend/app/page.tsx

import { MovieFilter } from '@/components/movies/MovieFilter'; 
import { MovieGrid } from '@/components/movies/MovieGrid';
import { mockMovies } from '@/data/movies';

export default function HomePage() {
  return (
    <div className="space-y-12">
      
      {/* 1. Bộ lọc Phim */}
      <MovieFilter />
      
      {/* 2. Danh sách Phim */}
      <section>
          <h1 className="text-3xl font-extrabold text-red-600 mb-6">PHIM ĐANG CHIẾU</h1>
          <MovieGrid movies={mockMovies} /> 
      </section>
      
    </div>
  );
}