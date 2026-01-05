// frontend/components/common/Footer.tsx

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Film } from 'lucide-react'; 

const footerSections = [
  {
    title: "Về chúng tôi",
    links: [
      { href: "/about", label: "Giới thiệu" },
      { href: "/terms", label: "Điều khoản & Quy định" },
    ],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [
      { href: "/contact", label: "Liên hệ" },
      { href: "/faq", label: "Hỏi đáp" },
      { href: "/policy", label: "Chính sách bảo mật" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Phần Nội dung Chính của Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Cột 1: Brand & Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
                <Film className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">BetaCinema</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trải nghiệm điện ảnh đẳng cấp với công nghệ hiện đại, chất lượng hình ảnh và âm thanh tuyệt vời.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Cột 2 & 3: Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-lg font-bold mb-6 text-white border-b border-red-600 pb-2 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Cột 4: Liên hệ */}
          <div className="col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white border-b border-red-600 pb-2 inline-block">
              Liên hệ
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-400 hover:text-red-500 transition-colors group">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                <span className="text-sm">Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 hover:text-red-500 transition-colors group">
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                <a href="tel:19000000" className="text-sm">1900 0000</a>
              </div>
              <div className="flex items-start gap-3 text-gray-400 hover:text-red-500 transition-colors group">
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                <a href="mailto:support@betacinema.vn" className="text-sm break-all">support@betacinema.vn</a>
              </div>
            </div>
            
            {/* <div className="mt-6 bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Giờ hoạt động</p>
              <p className="text-xs text-red-100">Thứ 2 - Chủ nhật<br />8:00 - 22:00</p>
            </div> */}
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Phần Bản quyền */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {currentYear} <span className="text-red-500 font-semibold">BetaCinema</span>. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-red-500 transition-colors">Điều khoản sử dụng</Link>
            <Link href="/policy" className="hover:text-red-500 transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}