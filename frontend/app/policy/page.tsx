'use client';

import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle, Sparkles } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <Shield className="w-16 h-16" />
            <Sparkles className="w-12 h-12 animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-2xl text-red-100">
              Cam kết bảo vệ thông tin cá nhân của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-8 mb-12 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-blue-900">
              <p className="font-bold text-xl mb-3">Cam kết của chúng tôi</p>
              <p className="text-lg leading-relaxed">
                AlphaCinema cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 space-y-10 border border-red-100">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                1. Thông Tin Chúng Tôi Thu Thập
              </h2>
            </div>
            <div className="pl-14 text-gray-700 space-y-4">
              <p className="font-bold text-lg text-red-600">Chúng tôi thu thập các loại thông tin sau:</p>
              <ul className="list-disc space-y-3 ml-6 text-lg">
                <li>
                  <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, ngày sinh, 
                  địa chỉ (nếu có)
                </li>
                <li>
                  <strong>Thông tin tài khoản:</strong> Username, mật khẩu được mã hóa, lịch sử 
                  đặt vé
                </li>
                <li>
                  <strong>Thông tin thanh toán:</strong> Số thẻ được mã hóa, phương thức thanh toán 
                  (không lưu thông tin thẻ đầy đủ)
                </li>
                <li>
                  <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị, 
                  thời gian truy cập
                </li>
                <li>
                  <strong>Cookie và tracking:</strong> Để cải thiện trải nghiệm người dùng và 
                  phân tích lượng truy cập
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                2. Mục Đích Sử Dụng Thông Tin
              </h2>
            </div>
            <div className="pl-14 text-gray-700 space-y-4">
              <p className="font-bold text-lg text-red-600">Chúng tôi sử dụng thông tin của bạn cho các mục đích:</p>
              <ul className="list-disc space-y-3 ml-6 text-lg">
                <li>Xử lý đặt vé và thanh toán</li>
                <li>Gửi xác nhận đặt vé và thông tin suất chiếu</li>
                <li>Hỗ trợ khách hàng và giải đáp thắc mắc</li>
                <li>Gửi thông báo về chương trình khuyến mãi, tin tức (nếu bạn đồng ý)</li>
                <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                <li>Phân tích thống kê và nghiên cứu thị trường</li>
                <li>Tuân thủ quy định pháp luật và giải quyết tranh chấp</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Bảo Mật Thông Tin
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>Chúng tôi áp dụng các biện pháp bảo mật sau:</p>
              <ul className="list-disc space-y-2 ml-6">
                <li>
                  <strong>Mã hóa SSL/TLS:</strong> Tất cả dữ liệu truyền tải được mã hóa 256-bit
                </li>
                <li>
                  <strong>Bảo mật thanh toán:</strong> Tuân thủ tiêu chuẩn PCI DSS cho giao dịch thẻ
                </li>
                <li>
                  <strong>Mật khẩu:</strong> Được mã hóa bằng thuật toán bcrypt/hash an toàn
                </li>
                <li>
                  <strong>Tường lửa:</strong> Hệ thống firewall và phần mềm chống virus bảo vệ server
                </li>
                <li>
                  <strong>Giới hạn truy cập:</strong> Chỉ nhân viên được ủy quyền mới truy cập 
                  dữ liệu khách hàng
                </li>
                <li>
                  <strong>Sao lưu định kỳ:</strong> Dữ liệu được backup thường xuyên để phòng 
                  tránh mất mát
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <UserCheck className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Chia Sẻ Thông Tin
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>
                Chúng tôi <strong>KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin cá nhân 
                của bạn cho bên thứ ba. Tuy nhiên, chúng tôi có thể chia sẻ thông tin với:
              </p>
              <ul className="list-disc space-y-2 ml-6">
                <li>
                  <strong>Đối tác thanh toán:</strong> Ngân hàng, ví điện tử để xử lý giao dịch
                </li>
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Email marketing, analytics (Google Analytics)
                </li>
                <li>
                  <strong>Cơ quan chức năng:</strong> Khi có yêu cầu theo quy định pháp luật
                </li>
              </ul>
              <p className="mt-3">
                Tất cả các bên thứ ba phải tuân thủ nghiêm ngặt chính sách bảo mật và chỉ sử 
                dụng thông tin cho mục đích được chỉ định.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                5. Quyền Của Bạn
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>Bạn có các quyền sau đối với thông tin cá nhân:</p>
              <ul className="list-disc space-y-2 ml-6">
                <li>
                  <strong>Truy cập:</strong> Xem thông tin cá nhân chúng tôi đang lưu trữ
                </li>
                <li>
                  <strong>Chỉnh sửa:</strong> Cập nhật hoặc sửa thông tin không chính xác
                </li>
                <li>
                  <strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu cá nhân
                </li>
                <li>
                  <strong>Rút lại đồng ý:</strong> Hủy nhận email marketing bất kỳ lúc nào
                </li>
                <li>
                  <strong>Phản đối:</strong> Từ chối xử lý dữ liệu cho mục đích marketing
                </li>
                <li>
                  <strong>Yêu cầu xuất dữ liệu:</strong> Nhận bản sao dữ liệu cá nhân
                </li>
              </ul>
              <p className="mt-3">
                Để thực hiện các quyền trên, vui lòng liên hệ: 
                <strong> support@alphacinema.vn</strong>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Cookie và Công Nghệ Tracking
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>Chúng tôi sử dụng cookie để:</p>
              <ul className="list-disc space-y-2 ml-6">
                <li>Duy trì phiên đăng nhập của bạn</li>
                <li>Ghi nhớ tùy chọn người dùng</li>
                <li>Phân tích lượng truy cập và hành vi người dùng</li>
                <li>Cá nhân hóa nội dung và quảng cáo</li>
              </ul>
              <p className="mt-3">
                Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng một số tính năng có thể 
                không hoạt động đúng.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Thời Gian Lưu Trữ
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>
                Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:
              </p>
              <ul className="list-disc space-y-2 ml-6">
                <li>Cung cấp dịch vụ cho bạn</li>
                <li>Tuân thủ nghĩa vụ pháp lý (tối thiểu 5 năm cho hồ sơ giao dịch)</li>
                <li>Giải quyết tranh chấp và thực thi thỏa thuận</li>
              </ul>
              <p className="mt-3">
                Sau khi bạn xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa dữ liệu cá nhân 
                của bạn, trừ khi pháp luật yêu cầu lưu giữ.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                8. Liên Kết Bên Thứ Ba
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>
                Website của chúng tôi có thể chứa liên kết đến các trang web bên thứ ba. 
                Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang web đó. 
                Vui lòng đọc kỹ chính sách bảo mật trước khi cung cấp thông tin cá nhân.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Thay Đổi Chính Sách
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>
                Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Các thay đổi 
                quan trọng sẽ được thông báo qua email hoặc thông báo trên website. Ngày cập 
                nhật cuối cùng sẽ được ghi rõ ở cuối trang.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <UserCheck className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Liên Hệ
              </h2>
            </div>
            <div className="pl-11 text-gray-700 space-y-3">
              <p>
                Nếu bạn có câu hỏi về Chính sách Bảo mật này hoặc muốn thực hiện các quyền 
                của mình, vui lòng liên hệ:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">AlphaCinema - Bộ phận Bảo mật Dữ liệu</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Email:</strong> privacy@alphacinema.vn</li>
                  <li><strong>Hotline:</strong> 1900 0000</li>
                  <li><strong>Địa chỉ:</strong> Hà Nội, Việt Nam</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Chính sách này có hiệu lực từ ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="mt-1">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Có thắc mắc về bảo mật?</h2>
          <p className="text-red-100 mb-6">
            Chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi của bạn
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Liên Hệ Ngay
          </a>
        </div>
      </div>
    </div>
  );
}
