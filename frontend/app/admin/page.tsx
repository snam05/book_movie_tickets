'use client';

export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng Điều Khiển Admin</h1>
        <p className="text-xl text-gray-600 mb-8">
          Vui lòng chọn một tính năng ở thanh bên để bắt đầu
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-gray-700">
            👈 Chọn một trong các menu ở bên trái để quản lý hệ thống
          </p>
        </div>
      </div>
    </div>
  );
}
