// frontend/components/movies/MovieCard.tsx

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Movie } from '@/types/movie';

export function MovieCard({ movie }: { movie: Movie }) {
  const detailLink = `/movie/${movie.id}`; // Đường dẫn đến trang chi tiết
  
  return (
    <Card className="w-full sm:w-[300px] hover:shadow-xl transition-shadow duration-300">
      
      {/* Ảnh Poster */}
      <CardHeader className="p-0">
        <Link href={detailLink}>
            <img 
                src={movie.posterUrl}
                alt={`Poster phim ${movie.title}`}
                className="w-full h-80 object-cover rounded-t-lg"
            />
        </Link>
      </CardHeader>
      
      {/* Thông tin tóm tắt */}
      <CardContent className="p-4">
        <Link href={detailLink} className="block hover:underline">
            <h3 className="text-xl font-bold line-clamp-2 min-h-[56px]"> 
                {movie.title}
            </h3>
        </Link>
        
        {/* Rating và Thời lượng */}
        <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-red-100 text-red-600">
                {movie.duration} phút
            </Badge>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Star className="w-3 h-3 mr-1 fill-white" />
                {movie.rating}
            </Badge>
        </div>
      </CardContent>
      
      {/* Nút hành động */}
      <CardFooter className="p-4 pt-0">
        <Link href={detailLink} className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Đặt Vé Ngay
            </Button>
        </Link>
      </CardFooter>
      
    </Card>
  );
}