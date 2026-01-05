'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Film, Calendar, Users, Ticket, BarChart3, Activity, Tag, DollarSign, Newspaper } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      } else {
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg sticky top-0 h-screen flex flex-col">
        <div className="p-6 border-b text-center">
          <Link href="/admin">
            <h2 className="text-2xl font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors">
              Admin Panel
            </h2>
          </Link>
          <p className="text-sm text-gray-600 mt-1">Quản trị hệ thống</p>
          
          <Link
            href="/"
            className="mt-4 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ← Về trang chủ
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          
          <Link
            href="/admin/theaters"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Building2 className="h-5 w-5" />
            <span className="font-medium">Rạp chiếu</span>
          </Link>
          
          <Link
            href="/admin/movies"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Film className="h-5 w-5" />
            <span className="font-medium">Danh sách Phim</span>
          </Link>
          
          <Link
            href="/admin/movies/genres"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Tag className="h-5 w-5" />
            <span className="font-medium">Thể loại Phim</span>
          </Link>
          
          <Link
            href="/admin/showtimes"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Lịch chiếu</span>
          </Link>

          <Link
            href="/admin/bookings"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Ticket className="h-5 w-5" />
            <span className="font-medium">Quản lý đặt vé</span>
          </Link>

          <Link
            href="/admin/prices"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">Giá vé</span>
          </Link>

          <Link
            href="/admin/news"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Newspaper className="h-5 w-5" />
            <span className="font-medium">Tin tức & thông báo</span>
          </Link>
          
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Người dùng</span>
          </Link>
          
          <Link
            href="/admin/statistics"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Thống kê doanh thu</span>
          </Link>
          
          <Link
            href="/admin/logs"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Activity className="h-5 w-5" />
            <span className="font-medium">Nhật ký hoạt động</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
