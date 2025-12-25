// frontend/app/page.tsx

import { MovieList } from '@/components/movies/MovieList';
import { getNowShowingMovies, getComingSoonMovies, convertToMovieType } from '@/lib/api/movies';

export default async function HomePage() {
  // Fetch data từ API
  const nowShowingMovies = await getNowShowingMovies();
  const comingSoonMovies = await getComingSoonMovies();

  // Convert sang format cũ để tương thích với MovieCard
  const nowShowingData = nowShowingMovies.map(convertToMovieType);
  const comingSoonData = comingSoonMovies.map(convertToMovieType);

  return (
    <div className="space-y-8">
      {/* Component hiển thị filter và danh sách phim */}
      <MovieList 
        nowShowingMovies={nowShowingData}
        comingSoonMovies={comingSoonData}
      />
    </div>
  );
}