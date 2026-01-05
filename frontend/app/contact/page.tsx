'use client';

import { Mail, Phone, MapPin, Clock, MessageCircle, HeadphonesIcon } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-2xl text-red-100 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Message */}
        <div className="text-center mb-12">
          <HeadphonesIcon className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Chúng Tôi Ở Đây Để Hỗ Trợ Bạn</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Liên hệ với chúng tôi qua các kênh dưới đây để được hỗ trợ nhanh chóng và tận tình
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Contact Card 1 */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mb-6 inline-block shadow-lg group-hover:shadow-xl transition-shadow">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Hotline</h3>
            <a href="tel:19000000" className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-2">
              1900 0000
            </a>
            <p className="text-gray-600">
              8:00 - 22:00 hàng ngày
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hỗ trợ đặt vé và giải đáp thắc mắc
            </p>
          </div>

          {/* Contact Card 2 */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mb-6 inline-block shadow-lg group-hover:shadow-xl transition-shadow">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Email</h3>
            <a href="mailto:support@betacinema.vn" className="text-lg font-semibold text-red-600 hover:text-red-700 block mb-2 break-words">
              support@betacinema.vn
            </a>
            <p className="text-gray-600">
              Phản hồi trong 24h
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Gửi câu hỏi hoặc phản hồi
            </p>
          </div>

          {/* Contact Card 3 */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mb-6 inline-block shadow-lg group-hover:shadow-xl transition-shadow">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Địa chỉ</h3>
            <p className="text-lg text-gray-700 mb-2">
              Hà Nội, Việt Nam
            </p>
            <p className="text-gray-600">
              Trụ sở chính
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ghé thăm chúng tôi
            </p>
          </div>

          {/* Contact Card 4 */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mb-6 inline-block shadow-lg group-hover:shadow-xl transition-shadow">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Giờ làm việc</h3>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Thứ 2 - Chủ nhật
            </p>
            <p className="text-gray-600">
              8:00 - 22:00
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sẵn sàng phục vụ
            </p>
          </div>
        </div>

        {/* FAQ & Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl p-8 border border-red-100">
            <MessageCircle className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Câu Hỏi Thường Gặp</h3>
            <p className="text-gray-600 mb-6">
              Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về đặt vé, thanh toán và dịch vụ của chúng tôi.
            </p>
            <a
              href="/faq"
              className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Xem FAQ
            </a>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl p-8 border border-red-100">
            <HeadphonesIcon className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Hỗ Trợ Trực Tuyến</h3>
            <p className="text-gray-600 mb-6">
              Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn qua điện thoại hoặc email.
            </p>
            <a
              href="tel:19000000"
              className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Gọi Ngay: 1900 0000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
