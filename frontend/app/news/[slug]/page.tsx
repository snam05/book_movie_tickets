'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ArrowLeft, Clock, User, Eye, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface News {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: string;
  publishedAt: string;
  views: number;
}

const categoryLabels: { [key: string]: string } = {
  promotion: 'Khuyến mại',
  event: 'Sự kiện',
  announcement: 'Thông báo',
  update: 'Cập nhật',
};

const categoryColors: { [key: string]: string } = {
  promotion: 'bg-red-100 text-red-800',
  event: 'bg-blue-100 text-blue-800',
  announcement: 'bg-green-100 text-green-800',
  update: 'bg-purple-100 text-purple-800',
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewsIncremented = useRef(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/news/${slug}`);
        const newsData = response.data.data;
        setNews(newsData);
        setError(null);

        // Tăng view count chỉ một lần
        if (newsData?.id && !viewsIncremented.current) {
          viewsIncremented.current = true;
          try {
            await axiosInstance.post(`/news/${newsData.id}/views`);
          } catch (viewError) {
            console.error('Error incrementing views:', viewError);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải tin tức');
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      viewsIncremented.current = false;
      fetchNews();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">Không tìm thấy tin tức</p>
          </div>
        </div>
      </div>
    );
  }

  const publishDate = new Date(news.publishedAt);
  const publishDateStr = publishDate.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {news.image && (
            <div className="relative w-full h-96 overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  categoryColors[news.category] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {categoryLabels[news.category] || news.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{news.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{publishDateStr}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span>{news.views} lượt xem</span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xl text-gray-700 mb-8 italic leading-relaxed">
              {news.summary}
            </p>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {news.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </article>

        {/* Related News Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tin tức liên quan</h2>
          <p className="text-gray-600">Xem thêm các tin tức khác từ danh sách</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
            Xem tất cả tin tức →
          </Link>
        </div>
      </div>
    </div>
  );
}
