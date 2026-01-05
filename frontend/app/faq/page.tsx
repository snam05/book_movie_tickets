'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Đặt vé',
    question: 'Làm thế nào để đặt vé xem phim online?',
    answer: 'Bạn cần đăng ký tài khoản, đăng nhập, sau đó chọn phim, chọn suất chiếu, chọn ghế và thanh toán. Vé điện tử sẽ được gửi qua email và hiển thị trong mục "Vé của tôi".'
  },
  {
    category: 'Đặt vé',
    question: 'Tôi có thể đặt vé cho nhiều người cùng lúc không?',
    answer: 'Có, bạn có thể chọn nhiều ghế trong cùng một giao dịch. Hệ thống cho phép đặt tối đa 10 vé cho mỗi giao dịch.'
  },
  {
    category: 'Đặt vé',
    question: 'Tôi có thể đặt vé trước bao lâu?',
    answer: 'Bạn có thể đặt vé trước từ 1-7 ngày tùy theo lịch chiếu của từng bộ phim. Vé sẽ được mở bán ngay khi rạp công bố lịch chiếu.'
  },
  {
    category: 'Thanh toán',
    question: 'Có những phương thức thanh toán nào?',
    answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ ATM nội địa, thẻ tín dụng Visa/Master/JCB, ví điện tử (Momo, ZaloPay, VNPay) và chuyển khoản ngân hàng.'
  },
  {
    category: 'Thanh toán',
    question: 'Thông tin thanh toán của tôi có an toàn không?',
    answer: 'Hoàn toàn an toàn. Chúng tôi sử dụng cổng thanh toán quốc tế với mã hóa SSL 256-bit và tuân thủ tiêu chuẩn bảo mật PCI DSS.'
  },
  {
    category: 'Thanh toán',
    question: 'Tôi có được hóa đơn VAT không?',
    answer: 'Có, bạn có thể yêu cầu xuất hóa đơn VAT bằng cách liên hệ hotline hoặc email với đầy đủ thông tin công ty trong vòng 3 ngày kể từ ngày mua vé.'
  },
  {
    category: 'Hủy/Đổi vé',
    question: 'Tôi có thể hủy vé sau khi đã thanh toán không?',
    answer: 'Vé đã thanh toán không thể hủy hoặc hoàn tiền, trừ trường hợp rạp hủy suất chiếu do sự cố kỹ thuật hoặc lý do bất khả kháng.'
  },
  {
    category: 'Hủy/Đổi vé',
    question: 'Tôi có thể đổi suất chiếu không?',
    answer: 'Hiện tại chúng tôi chưa hỗ trợ đổi suất chiếu sau khi đã thanh toán. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận thanh toán.'
  },
  {
    category: 'Hủy/Đổi vé',
    question: 'Nếu rạp hủy suất chiếu thì sao?',
    answer: 'Trong trường hợp rạp hủy suất chiếu, chúng tôi sẽ hoàn lại 100% tiền vé vào tài khoản/thẻ của bạn trong vòng 5-7 ngày làm việc và thông báo qua email.'
  },
  {
    category: 'Vé & Mã QR',
    question: 'Làm sao để nhận vé sau khi đặt?',
    answer: 'Vé điện tử sẽ được gửi ngay vào email đăng ký và hiển thị trong mục "Vé của tôi" trên website/app. Bạn có thể lưu vé hoặc chụp ảnh mã QR.'
  },
  {
    category: 'Vé & Mã QR',
    question: 'Tôi cần xuất trình gì khi vào rạp?',
    answer: 'Bạn cần xuất trình vé điện tử (email hoặc trong app) hoặc mã QR tại quầy vé/cửa vào phòng chiếu. Nhân viên sẽ quét mã để xác nhận.'
  },
  {
    category: 'Vé & Mã QR',
    question: 'Nếu tôi mất email/không tìm thấy vé thì sao?',
    answer: 'Bạn có thể đăng nhập vào tài khoản và xem lại vé trong mục "Vé của tôi", hoặc liên hệ hotline với thông tin đặt vé (email, số điện thoại) để được hỗ trợ.'
  },
  {
    category: 'Rạp chiếu',
    question: 'Tôi đến rạp trước bao lâu?',
    answer: 'Vui lòng đến rạp trước giờ chiếu ít nhất 15-20 phút để có thời gian lấy vé, mua đồ ăn/uống và vào phòng chiếu.'
  },
  {
    category: 'Rạp chiếu',
    question: 'Tôi có thể mang đồ ăn từ ngoài vào không?',
    answer: 'Không, theo quy định của rạp, khách hàng không được mang thức ăn, đồ uống từ bên ngoài vào. Chúng tôi có quầy bắp rang bơ và nước ngọt phục vụ tại rạp.'
  },
  {
    category: 'Rạp chiếu',
    question: 'Trẻ em có phải mua vé không?',
    answer: 'Trẻ em dưới 0.8m được miễn phí vé nhưng không có ghế riêng. Trẻ em từ 0.8m trở lên cần mua vé theo giá thông thường.'
  },
  {
    category: 'Tài khoản',
    question: 'Làm sao để đăng ký tài khoản?',
    answer: 'Click vào "Đăng ký" ở góc trên cùng, điền email, mật khẩu và thông tin cá nhân. Bạn sẽ nhận email xác nhận để kích hoạt tài khoản.'
  },
  {
    category: 'Tài khoản',
    question: 'Tôi quên mật khẩu thì phải làm sao?',
    answer: 'Click vào "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu vào email của bạn.'
  },
  {
    category: 'Tài khoản',
    question: 'Tôi có thể thay đổi thông tin cá nhân không?',
    answer: 'Có, bạn có thể cập nhật thông tin trong mục "Tài khoản" > "Hồ sơ". Một số thông tin như email có thể cần xác minh lại.'
  },
  {
    category: 'Khuyến mãi',
    question: 'Làm sao để biết các chương trình khuyến mãi?',
    answer: 'Theo dõi website, fanpage hoặc đăng ký nhận email để cập nhật các chương trình khuyến mãi, ưu đãi đặc biệt và tin tức mới nhất.'
  },
  {
    category: 'Khuyến mãi',
    question: 'Tôi có thể dùng nhiều mã giảm giá cùng lúc không?',
    answer: 'Mỗi giao dịch chỉ áp dụng được 1 mã giảm giá. Bạn nên chọn mã có giá trị ưu đãi cao nhất.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <HelpCircle className="w-16 h-16 animate-pulse" />
            <Sparkles className="w-12 h-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-2xl text-red-100 max-w-2xl mx-auto">
            Tìm câu trả lời cho các thắc mắc của bạn
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-red-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chọn chủ đề:</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tất cả' : category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-5">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 hover:shadow-2xl transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-red-50 hover:to-white transition-colors"
              >
                <div className="flex items-start gap-4 text-left flex-1">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl flex-shrink-0 mt-1 shadow-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-red-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-8 pb-6 pt-2 pl-24 bg-gradient-to-r from-red-50/50 to-white">
                  <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-2xl shadow-2xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-3">Không tìm thấy câu trả lời?</h2>
            <p className="text-xl text-red-100 mb-8">
              Liên hệ với chúng tôi để được hỗ trợ trực tiếp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-red-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Liên Hệ Ngay
              </a>
              <a
                href="tel:19000000"
                className="bg-red-800 text-white px-10 py-4 rounded-xl font-bold hover:bg-red-900 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
              >
                Gọi: 1900 0000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
