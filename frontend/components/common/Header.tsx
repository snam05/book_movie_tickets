// frontend/components/common/Header.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, User } from 'lucide-react';

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
            {/* ĐIỀU CHỈNH: Bọc nội dung bằng div với "container mx-auto" và thêm padding ngang "px-4" */}
            <div className="container mx-auto px-4"> 
                <div className="flex items-center justify-between py-4"> {/* Dùng py-4 thay vì p-4 để chỉ điều chỉnh padding dọc */}
                    
                    {/* Logo/Trang chủ */}
                    <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700">
                        TICKET APP
                    </Link>

                    {/* Tìm kiếm (Giữa) */}
                    <div className="flex items-center space-x-2 w-1/3 max-w-sm">
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
                        <Button variant="outline" size="sm">
                            VI
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            {/* 2. Thanh Điều hướng Chính (Menu) */}
            {/* ĐIỀU CHỈNH: Thêm padding ngang "px-4" */}
            <nav className="container mx-auto px-4 py-2">
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