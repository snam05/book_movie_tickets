import { MovieContent } from '@/components/movies/MovieContent';
import { getMovieById } from '@/lib/api/movies';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const movie = await getMovieById(Number(id));
  
  if (!movie) {
    return (
      <div className="text-center text-xl mt-10 p-10 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-bold mb-2">Không tìm thấy phim</p>
        <p className="text-gray-600">Phim có ID {id} không tồn tại trong hệ thống.</p>
      </div>
    );
  }
  
  return <MovieContent movie={movie} />;
}
