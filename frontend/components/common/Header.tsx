// frontend/components/common/Header.tsx

import Link from 'next/link'; // Dùng Link của Next.js để điều hướng
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, User } from 'lucide-react'; // Icon từ thư viện lucide-react (đã được cài đặt cùng shadcn)

// --- Dữ liệu điều hướng giả ---
const NAV_LINKS = [
  { href: "/", label: "Lịch Chiếu" },
  { href: "/theaters", label: "Rạp/Giá Vé" },
  { href: "/news", label: "Tin Tức & Ưu Đãi" },
];

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* 1. Thanh Top Bar: Logo, Tìm kiếm, User */}
      <div className="container mx-auto flex items-center justify-between p-4">
        
        {/* Logo/Trang chủ */}
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700">
          TICKET APP
        </Link>

        {/* Tìm kiếm (Giữa) */}
        <div className="flex items-center space-x-2 w-1/3">
          <Input 
            placeholder="Tìm kiếm phim, rạp..." 
            className="flex-grow"
          />
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* User/Đăng nhập (Phải) */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-sm">
            <User className="mr-2 h-4 w-4" /> 
            Đăng nhập / Đăng ký
          </Button>
          {/* Nút Ngôn ngữ (Tùy chọn) */}
          <Button variant="outline" size="sm">
            VI
          </Button>
        </div>
      </div>

      <Separator />

      {/* 2. Thanh Điều hướng Chính (Menu) */}
      <nav className="container mx-auto py-2">
        <ul className="flex space-x-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} passHref>
                <Button variant="link" className="text-base text-gray-700 hover:text-red-600 font-medium">
                  {link.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}