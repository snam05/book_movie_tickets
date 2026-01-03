'use client';

// frontend/components/movies/MovieList.tsx
// Client component để handle tab switching và hiển thị phim

import { useState, useMemo } from 'react';
import { MovieFilter } from './MovieFilter';
import { MovieGrid } from './MovieGrid';
import { Movie } from '@/types/movie';

interface MovieListProps {
  nowShowingMovies: Movie[];
  comingSoonMovies: Movie[];
  searchTerm?: string;
}

export function MovieList({ nowShowingMovies, comingSoonMovies, searchTerm = '' }: MovieListProps) {
  const [activeTab, setActiveTab] = useState<string>('now_showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  // Chọn danh sách phim dựa trên tab active
  const baseMovies = activeTab === 'now_showing' ? nowShowingMovies : comingSoonMovies;

  // Lọc phim theo search term và genre
  const displayMovies = useMemo(() => {
    let filtered = baseMovies;

    // Lọc theo tìm kiếm
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(lowerSearch)
      );
    }

    // Lọc theo thể loại
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre && movie.genre.some(g => 
          g.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    return filtered;
  }, [baseMovies, searchTerm, selectedGenre]);

  // Lấy danh sách tất cả thể loại từ phim
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    [...nowShowingMovies, ...comingSoonMovies].forEach(movie => {
      movie.genre?.forEach(g => genresSet.add(g));
    });
    return Array.from(genresSet).sort();
  }, [nowShowingMovies, comingSoonMovies]);

  return (
    <>
      {/* Bộ lọc phim với tabs */}
      <MovieFilter 
        onTabChange={handleTabChange}
        onGenreChange={handleGenreChange}
        availableGenres={allGenres}
      />
      
      {/* Danh sách phim */}
      <section className="mt-8">
        {displayMovies.length > 0 ? (
          <MovieGrid movies={displayMovies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm.trim() || selectedGenre !== 'all' 
                ? 'Không tìm thấy phim phù hợp.' 
                : activeTab === 'now_showing' 
                  ? 'Hiện chưa có phim đang chiếu.' 
                  : 'Hiện chưa có phim sắp chiếu.'}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
