'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
}

const categoryConfig = {
  movie_news: { label: 'Tin Phim', color: 'bg-blue-500' },
  events: { label: 'Sự Kiện', color: 'bg-green-500' },
  promotions: { label: 'Khuyến Mãi', color: 'bg-red-500' },
  reviews: { label: 'Đánh Giá', color: 'bg-purple-500' },
  interviews: { label: 'Phỏng Vấn', color: 'bg-orange-500' },
  behind_the_scenes: { label: 'Hậu Trường', color: 'bg-pink-500' }
};

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pageSize = 9;

  useEffect(() => {
    fetchNews();
  }, [currentPage, selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `/news?page=${currentPage}&limit=${pageSize}`
        : `/news/category/${selectedCategory}?page=${currentPage}&limit=${pageSize}`;
      
      const response = await axiosInstance.get(url);
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      setNews(items);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải tin tức');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tin Tức Phim Ảnh</h1>
          <p className="text-lg text-gray-600">
            Cập nhật thông tin mới nhất về thế giới điện ảnh
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => handleCategoryChange('all')}
            className={selectedCategory === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Tất Cả
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(key)}
              className={selectedCategory === key ? `${config.color} hover:opacity-90` : ''}
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* News Grid */}
        {news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => {
                const config = categoryConfig[item.category as keyof typeof categoryConfig];
                const imageUrl = item.image || 'https://via.placeholder.com/400x250/1e293b/ffffff?text=No+Image';

                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    {/* Image */}
                    <CardHeader className="p-0 relative">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250/1e293b/ffffff?text=No+Image';
                        }}
                      />
                      <Badge className={`absolute top-4 left-4 ${config?.color || 'bg-gray-500'} text-white`}>
                        {config?.label || item.category}
                      </Badge>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold line-clamp-2 min-h-[56px] mb-3 hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {item.summary}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views} lượt xem</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/news/${item.slug}`} className="w-full">
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          Đọc Thêm
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">Không có tin tức nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
