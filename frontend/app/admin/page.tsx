'use client';

import Link from 'next/link';
import { Building2, Film, Calendar, Users, BarChart3, Package } from 'lucide-react';

const adminFeatures = [
  {
    title: 'Quản lý Rạp Chiếu',
    description: 'Thêm, sửa, xóa và quản lý các rạp chiếu trong hệ thống',
    icon: Building2,
    href: '/admin/theaters',
    color: 'bg-blue-500',
    stats: 'Quản lý rạp'
  },
  {
    title: 'Quản lý Phim',
    description: 'Quản lý danh sách phim, thông tin chi tiết và lịch chiếu',
    icon: Film,
    href: '/admin/movies',
    color: 'bg-red-500',
    stats: 'Quản lý phim'
  },
  {
    title: 'Quản lý Lịch Chiếu',
    description: 'Tạo và quản lý lịch chiếu phim cho từng rạp',
    icon: Calendar,
    href: '/admin/showtimes',
    color: 'bg-green-500',
    stats: 'Lịch chiếu'
  },
  {
    title: 'Quản lý Người Dùng',
    description: 'Xem và quản lý thông tin người dùng trong hệ thống',
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-500',
    stats: 'Người dùng'
  },
  {
    title: 'Thống Kê',
    description: 'Xem báo cáo và thống kê doanh thu, lượt đặt vé',
    icon: BarChart3,
    href: '/admin/statistics',
    color: 'bg-yellow-500',
    stats: 'Báo cáo'
  },
  {
    title: 'Quản lý Đặt Vé',
    description: 'Xem và quản lý các đơn đặt vé trong hệ thống',
    icon: Package,
    href: '/admin/bookings',
    color: 'bg-indigo-500',
    stats: 'Đơn đặt vé'
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Bảng Điều Khiển Admin</h1>
        <p className="text-gray-600 mt-2">Chào mừng đến với trang quản trị hệ thống đặt vé xem phim</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${feature.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">{feature.stats}</span>
                  <span className="text-red-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-start space-x-4">
          <div className="bg-red-600 p-3 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Hướng Dẫn Sử Dụng
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Chọn một trong các tính năng bên trên để bắt đầu quản lý hệ thống. 
              Mỗi tính năng đều có giao diện trực quan và dễ sử dụng.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Rạp Chiếu:</strong> Quản lý thông tin rạp và sơ đồ ghế</li>
              <li>• <strong>Phim:</strong> Thêm phim mới, cập nhật thông tin và trạng thái</li>
              <li>• <strong>Lịch Chiếu:</strong> Tạo lịch chiếu cho từng phim và rạp</li>
              <li>• <strong>Người Dùng:</strong> Xem và quản lý tài khoản người dùng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
