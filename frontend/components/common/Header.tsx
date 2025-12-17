'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LogOut, Ticket, Settings, ShieldCheck } from 'lucide-react';
import { IUser } from '@/types/auth';

interface CustomJwtPayload extends JwtPayload {
    id: number;
    role: string;
}

const NAV_LINKS = [
    { href: "/", label: "Lịch Chiếu" },
    { href: "/theaters", label: "Rạp/Giá Vé" },
    { href: "/news", label: "Tin Tức & Ưu Đãi" },
];

export function Header() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Hàm lấy User từ LocalStorage
    const getStoredUser = useCallback(() => {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData && userData !== "undefined") {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                if (decoded.exp && decoded.exp > Date.now() / 1000) {
                    return JSON.parse(userData) as IUser;
                }
            } catch {
                return null;
            }
        }
        return null;
    }, []);

    const [user, setUser] = useState<IUser | null>(null);

    // Xử lý Hydration: Đảm bảo Client khớp với Server
    useEffect(() => {
        setMounted(true);
        setUser(getStoredUser());
    }, [getStoredUser]);

    const handleLogout = useCallback(() => {
    // 1. Xóa dữ liệu trong LocalStorage (phục vụ UI/Header)
    localStorage.removeItem('token');
    localStorage.setItem('user', 'undefined'); // Hoặc removeItem('user')
    
    // 2. QUAN TRỌNG: Xóa Cookie (phục vụ Middleware Frontend)
    // Lưu ý: path phải khớp với path lúc bạn set (thường là '/')
    Cookies.remove('token', { path: '/' });

    // 3. Cập nhật lại State để ẩn Avatar ngay lập tức
    setUser(null);

    // 4. Đẩy người dùng về trang chủ hoặc trang đăng nhập
    router.push('/auth/login');
    
    // 5. Refresh lại để Middleware Next.js nhận diện trạng thái "không token"
    router.refresh();

    console.log("Logged out: LocalStorage & Cookies cleared.");
}, [router]);

    const syncAuth = useCallback(() => {
        setUser(getStoredUser());
    }, [getStoredUser]);

    useEffect(() => {
        window.addEventListener('authChange', syncAuth);
        window.addEventListener('storage', syncAuth);
        return () => {
            window.removeEventListener('authChange', syncAuth);
            window.removeEventListener('storage', syncAuth);
        };
    }, [syncAuth]);

    // Tránh lỗi Hydration Mismatch bằng cách không render phần User khi chưa mount
    if (!mounted) return <header className="bg-white shadow-sm sticky top-0 z-50 h-20 border-b" />;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter">
                    TICKET<span className="text-gray-900">APP</span>
                </Link>

                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md mx-8">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <input type="text" placeholder="Tìm phim..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-sm font-bold group-hover:text-red-600 transition-colors">{user.full_name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">#{user.member_code}</p>
                                    </div>
                                    <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-red-500 transition-all">
                                        <AvatarFallback className="bg-red-600 text-white font-bold">
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{user.full_name}</span>
                                        <span className="text-xs text-gray-500">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.role === 'admin' && (
                                    <DropdownMenuItem className="text-amber-600 font-semibold"><ShieldCheck className="mr-2 h-4 w-4" /> Admin</DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild><Link href="/profile" className="w-full flex"><Settings className="mr-2 h-4 w-4" /> Hồ sơ</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/my-bookings" className="w-full flex"><Ticket className="mr-2 h-4 w-4" /> Vé của tôi</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Đăng xuất</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="text-sm font-bold" asChild><Link href="/auth/login">ĐĂNG NHẬP</Link></Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-sm font-bold px-6" asChild><Link href="/auth/register">ĐĂNG KÝ</Link></Button>
                        </div>
                    )}
                </div>
            </div>
            <Separator />
            <nav className="container mx-auto px-4 py-2 bg-white">
                <ul className="flex space-x-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}><Link href={link.href} className="text-sm font-medium text-gray-700 hover:text-red-600 uppercase">{link.label}</Link></li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

function Separator() { return <div className="h-[1px] bg-gray-100 w-full" />; }