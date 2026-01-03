// frontend/app/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="space-y-6">
        {/* 404 Animation */}
        <div className="text-9xl font-black text-red-600 animate-pulse">
          404
        </div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900">
          Trang không tồn tại
        </h1>
        
        <p className="text-gray-600 max-w-md">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button 
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8"
          >
            <Link href="/?search=">
              <Search className="mr-2 h-4 w-4" />
              Tìm phim
            </Link>
          </Button>
        </div>
        
        {/* Decorative Elements */}
        <div className="pt-8 opacity-50">
          <p className="text-sm text-gray-400">
            🎬 Hoặc bạn có thể tìm kiếm phim yêu thích ở thanh tìm kiếm phía trên
          </p>
        </div>
      </div>
    </div>
  );
}
