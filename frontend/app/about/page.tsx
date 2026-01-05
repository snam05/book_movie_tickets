'use client';

import { Building2, Target, Users, Award, Sparkles, Film } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
            <Film className="w-14 h-14 animate-pulse" />
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
            Về Chúng Tôi
          </h1>
          <p className="text-2xl text-red-100 text-center md:text-left max-w-2xl">
            Mang đến trải nghiệm điện ảnh đẳng cấp quốc tế
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Company Overview */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-900">Giới Thiệu BetaCinema</h2>
            </div>
            <div className="prose max-w-none text-gray-700 space-y-5">
              <p className="text-xl leading-relaxed">
                🎬 <strong className="text-red-600">BetaCinema</strong> là chuỗi rạp chiếu phim hiện đại hàng đầu tại Việt Nam, 
                cam kết mang đến cho khán giả những trải nghiệm điện ảnh đẳng cấp quốc tế với công nghệ tiên tiến nhất.
              </p>
              <p className="text-lg leading-relaxed">
                Với hệ thống rạp chiếu phim được trang bị công nghệ âm thanh <span className="font-semibold text-red-600">Dolby Atmos</span>, 
                màn hình chiếu <span className="font-semibold text-red-600">3D/4DX</span>, ghế ngồi cao cấp và không gian sang trọng, 
                chúng tôi tự hào là điểm đến yêu thích của những người yêu điện ảnh.
              </p>
              <p className="text-lg leading-relaxed">
                Hệ thống đặt vé trực tuyến của chúng tôi giúp bạn dễ dàng chọn phim, chọn ghế và 
                thanh toán nhanh chóng, tiện lợi mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Sứ Mệnh</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Mang đến những trải nghiệm giải trí điện ảnh tuyệt vời, hiện đại và chất lượng cao 
                cho khán giả Việt Nam. Chúng tôi không ngừng đổi mới để đáp ứng mọi nhu cầu của 
                khách hàng với dịch vụ tốt nhất.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-red-100 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Trở thành chuỗi rạp chiếu phim số 1 tại Việt Nam, được yêu thích nhất với hệ thống 
                rạp hiện đại, dịch vụ xuất sắc và trải nghiệm khách hàng hoàn hảo. Đồng thành 
                kênh kết nối văn hóa điện ảnh thế giới với khán giả Việt.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow border border-red-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
                <Sparkles className="w-8 h-8 text-red-600" />
                <div className="h-1 w-16 bg-gradient-to-l from-red-600 to-red-400 rounded-full"></div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Giá Trị Cốt Lõi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Chất Lượng</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Cam kết cung cấp dịch vụ và trải nghiệm xem phim chất lượng cao nhất
                </p>
              </div>

              <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Khách Hàng Là Trung Tâm</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Luôn lắng nghe và đặt sự hài lòng của khách hàng lên hàng đầu
                </p>
              </div>

              <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Đổi Mới Sáng Tạo</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Không ngừng cải tiến công nghệ và dịch vụ để mang lại trải nghiệm tốt nhất
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-2xl shadow-2xl p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
              <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
                Bạn có câu hỏi hoặc muốn hợp tác? Hãy liên hệ với chúng tôi!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white text-red-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Liên Hệ Ngay
                </a>
                <a
                  href="/movies"
                  className="bg-red-800 text-white px-10 py-4 rounded-xl font-bold hover:bg-red-900 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
                >
                  Xem Phim Đang Chiếu
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
