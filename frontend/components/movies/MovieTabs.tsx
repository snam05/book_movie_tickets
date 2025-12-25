'use client';

// frontend/components/movies/MovieTabs.tsx
// Component hiển thị phim theo tabs: Đang chiếu và Sắp chiếu

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MovieGrid } from './MovieGrid';
import { Movie } from '@/types/movie';

interface MovieTabsProps {
  nowShowingMovies: Movie[];
  comingSoonMovies: Movie[];
}

export function MovieTabs({ nowShowingMovies, comingSoonMovies }: MovieTabsProps) {
  return (
    <Tabs defaultValue="now-showing" className="w-full">
      {/* Tab Headers */}
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger 
          value="now-showing"
          className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
        >
          🎬 Phim Đang Chiếu
        </TabsTrigger>
        <TabsTrigger 
          value="coming-soon"
          className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
        >
          🎞️ Phim Sắp Chiếu
        </TabsTrigger>
      </TabsList>

      {/* Tab Content: Phim Đang Chiếu */}
      <TabsContent value="now-showing" className="mt-6">
        {nowShowingMovies.length > 0 ? (
          <MovieGrid movies={nowShowingMovies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hiện chưa có phim đang chiếu.</p>
          </div>
        )}
      </TabsContent>

      {/* Tab Content: Phim Sắp Chiếu */}
      <TabsContent value="coming-soon" className="mt-6">
        {comingSoonMovies.length > 0 ? (
          <MovieGrid movies={comingSoonMovies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hiện chưa có phim sắp chiếu.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
