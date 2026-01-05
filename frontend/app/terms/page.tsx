'use client';

import { FileText, CheckCircle, Sparkles } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <FileText className="w-14 h-14" />
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Điều Khoản & Quy Định
            </h1>
            <p className="text-2xl text-red-100">
              Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              1. Điều Khoản Chung
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <p>
                Khi truy cập và sử dụng trang web AlphaCinema, bạn đồng ý tuân thủ các điều khoản 
                và điều kiện sử dụng được quy định dưới đây.
              </p>
              <p>
                AlphaCinema có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong 
                Điều khoản sử dụng này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được 
                đăng tải trên trang web.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              2. Đặt Vé & Thanh Toán
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <ul className="list-disc space-y-2">
                <li>
                  Khách hàng phải đăng ký tài khoản và đăng nhập để thực hiện đặt vé trực tuyến.
                </li>
                <li>
                  Vé đã đặt không thể hủy hoặc hoàn tiền sau khi thanh toán thành công, trừ trường 
                  hợp rạp hủy suất chiếu.
                </li>
                <li>
                  Thông tin thẻ thanh toán của quý khách được bảo mật theo tiêu chuẩn PCI DSS.
                </li>
                <li>
                  Vé điện tử sẽ được gửi qua email và hiển thị trong mục "Vé của tôi" sau khi 
                  thanh toán thành công.
                </li>
                <li>
                  Quý khách cần xuất trình vé điện tử hoặc mã QR tại quầy vé trước giờ chiếu 
                  ít nhất 15 phút.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              3. Quy Định Về Ghế Ngồi
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <ul className="list-disc space-y-2">
                <li>
                  Khách hàng chọn ghế khi đặt vé online. Ghế đã chọn sẽ được giữ trong 5 phút 
                  để thanh toán.
                </li>
                <li>
                  Không được đổi ghế sau khi đã thanh toán thành công, trừ trường hợp ghế bị 
                  hỏng hoặc có vấn đề kỹ thuật.
                </li>
                <li>
                  Trẻ em dưới 13 tuổi phải có người lớn đi cùng khi xem phim có giới hạn độ tuổi.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              4. Quy Định Trong Rạp
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <ul className="list-disc space-y-2">
                <li>
                  Nghiêm cấm mang thức ăn, đồ uống từ bên ngoài vào rạp.
                </li>
                <li>
                  Không được ghi âm, ghi hình trong rạp chiếu phim.
                </li>
                <li>
                  Tắt hoặc chuyển điện thoại sang chế độ im lặng trong suốt thời gian chiếu phim.
                </li>
                <li>
                  Giữ gìn vệ sinh chung, không hút thuốc trong khu vực rạp.
                </li>
                <li>
                  Tuân thủ hướng dẫn của nhân viên rạp và quy định phòng cháy chữa cháy.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              5. Chính Sách Hoàn/Hủy Vé
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <ul className="list-disc space-y-2">
                <li>
                  Vé đã thanh toán không được hoàn lại dưới mọi hình thức.
                </li>
                <li>
                  Trường hợp rạp hủy suất chiếu do sự cố kỹ thuật hoặc lý do bất khả kháng, 
                  khách hàng sẽ được hoàn lại 100% tiền vé.
                </li>
                <li>
                  Thời gian hoàn tiền từ 5-7 ngày làm việc tùy theo phương thức thanh toán.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              6. Quyền Sở Hữu Trí Tuệ
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <p>
                Tất cả nội dung trên trang web AlphaCinema bao gồm văn bản, hình ảnh, logo, 
                đồ họa, video và các tài liệu khác đều thuộc quyền sở hữu của AlphaCinema hoặc 
                các đối tác có bản quyền.
              </p>
              <p>
                Nghiêm cấm sao chép, phân phối, truyền tải hoặc sử dụng nội dung cho mục đích 
                thương mại mà không có sự cho phép bằng văn bản.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              7. Giới Hạn Trách Nhiệm
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <p>
                AlphaCinema không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, 
                ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể 
                sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600" />
              8. Liên Hệ
            </h2>
            <div className="text-gray-700 space-y-3 pl-8">
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản và Quy định này, vui lòng 
                liên hệ với chúng tôi:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li><strong>Email:</strong> support@alphacinema.vn</li>
                <li><strong>Hotline:</strong> 1900 0000</li>
                <li><strong>Địa chỉ:</strong> Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </section>

          {/* Last Updated */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </div>
  );
}
