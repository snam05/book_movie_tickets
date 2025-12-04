import { MovieContent } from '@/components/movies/MovieContent';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;  // ⭐ FIX CHUẨN NHẤT

  return <MovieContent movieId={Number(id)} />;
}
