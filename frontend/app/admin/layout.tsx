'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Film, Calendar, Users } from 'lucide-react';

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
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg">
        <div className="p-6 border-b">
          <Link href="/admin">
            <h2 className="text-2xl font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors">
              Admin Panel
            </h2>
          </Link>
          <p className="text-sm text-gray-600 mt-1">Quản trị hệ thống</p>
        </div>
        
        <nav className="p-4 space-y-2">
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
            <span className="font-medium">Phim</span>
          </Link>
          
          <Link
            href="/admin/showtimes"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Lịch chiếu</span>
          </Link>
          
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Người dùng</span>
          </Link>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Link
            href="/"
            className="block text-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
