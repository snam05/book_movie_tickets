// frontend/components/common/Footer.tsx

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// Import các icons mạng xã hội (ví dụ từ lucide-react)
import { Facebook, Instagram, Youtube } from 'lucide-react'; 

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
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Phần Nội dung Chính của Footer (3 Cột) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cột 1 & 2: Về chúng tôi & Hỗ trợ */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-red-400">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Cột 3: Liên hệ và Mạng xã hội */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-red-400">
              Liên hệ
            </h4>
            <p className="text-gray-300 mb-4">
              Địa chỉ: Hà Nội, Việt Nam
              <br />
              Hotline: 1900 0000
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-red-400 hover:text-red-500">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-red-400 hover:text-red-500">
                <Instagram className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-red-400 hover:text-red-500">
                <Youtube className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Phần Bản quyền (Copyright) */}
        <div className="text-center text-sm text-gray-400">
          © {currentYear} BetaCinema. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}