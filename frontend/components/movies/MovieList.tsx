'use client';

// frontend/components/movies/MovieList.tsx
// Client component để handle tab switching và hiển thị phim

import { useState } from 'react';
import { MovieFilter } from './MovieFilter';
import { MovieGrid } from './MovieGrid';
import { Movie } from '@/types/movie';

interface MovieListProps {
  nowShowingMovies: Movie[];
  comingSoonMovies: Movie[];
}

export function MovieList({ nowShowingMovies, comingSoonMovies }: MovieListProps) {
  const [activeTab, setActiveTab] = useState<string>('now_showing');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Chọn danh sách phim dựa trên tab active
  const displayMovies = activeTab === 'now_showing' ? nowShowingMovies : comingSoonMovies;

  return (
    <>
      {/* Bộ lọc phim với tabs */}
      <MovieFilter onTabChange={handleTabChange} />
      
      {/* Danh sách phim */}
      <section className="mt-8">
        {displayMovies.length > 0 ? (
          <MovieGrid movies={displayMovies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === 'now_showing' 
                ? 'Hiện chưa có phim đang chiếu.' 
                : 'Hiện chưa có phim sắp chiếu.'}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
