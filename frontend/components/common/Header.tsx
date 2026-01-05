'use client';

import React, { useEffect, useState, useCallback, useSyncExternalStore, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, LogOut, Ticket, Settings, ShieldCheck } from 'lucide-react';
import { IUser } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth';
const USER_CACHE_KEY = 'cached_user';

const NAV_LINKS = [
    { href: "/", label: "Lịch Chiếu" },
    { href: "/prices", label: "Giá Vé" },
    { href: "/news", label: "Tin Tức & Ưu Đãi" },
];

export function Header() {
    const router = useRouter();
    
    // Use useSyncExternalStore for hydration-safe mounting detection
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');

    // Hàm lấy User từ Backend qua /auth/verify
    const fetchUser = useCallback(async (): Promise<IUser | null> => {
        if (typeof window === 'undefined') return null;
        
        try {
            const response = await fetch(`${API_URL}/verify`, {
                method: 'GET',
                credentials: 'include', // Gửi cookie session_token
                cache: 'no-store'
            });
            
            if (response.ok) {
                const data = await response.json();
                const userData = data.user as IUser;
                // Cache user info vào localStorage
                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
                return userData;
            } else {
                // Xóa cache nếu verify fail
                localStorage.removeItem(USER_CACHE_KEY);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }, []);

    // Load cached user before first paint (useLayoutEffect runs before useEffect)
    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;
        
        const cachedUser = localStorage.getItem(USER_CACHE_KEY);
        if (cachedUser) {
            try {
                // Suppress React Compiler warning - this is intentional for cache loading
                const userData = JSON.parse(cachedUser);
                setUser(userData);
            } catch (e) {
                console.error('Error parsing cached user:', e);
            }
        }
    }, []);

    // Load user từ cache trước, sau đó verify từ server
    useEffect(() => {
        if (!mounted) return;

        // Verify từ server và update  
        (async () => {
            setIsLoading(true);
            const freshUser = await fetchUser();
            setUser(freshUser);
            setIsLoading(false);
        })();
    }, [mounted, fetchUser]);

    const handleSearch = useCallback(() => {
        const trimmedSearch = searchInput.trim();
        if (trimmedSearch) {
            // Navigate to home page with search query
            router.push(`/?search=${encodeURIComponent(trimmedSearch)}`);
        } else {
            // Clear search if empty
            router.push('/');
        }
    }, [searchInput, router]);

    const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const handleLogout = useCallback(async () => {
        try {
            // Gọi backend để xóa session
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Xóa cache và cập nhật State
        localStorage.removeItem(USER_CACHE_KEY);
        setUser(null);

        // Đẩy người dùng về trang đăng nhập
        router.push('/auth/signin');
        router.refresh();

        console.log("Logged out: Session cleared.");
    }, [router]);

    const syncAuth = useCallback(() => {
        setIsLoading(true);
        fetchUser().then((freshUser) => {
            setUser(freshUser);
            setIsLoading(false);
        });
    }, [fetchUser]);

    useEffect(() => {
        window.addEventListener('authChange', syncAuth);
        window.addEventListener('storage', syncAuth);
        return () => {
            window.removeEventListener('authChange', syncAuth);
            window.removeEventListener('storage', syncAuth);
        };
    }, [syncAuth]);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter flex-shrink-0">
                    TICKET<span className="text-gray-900">APP</span>
                </Link>

                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-5 py-2.5 w-full max-w-md mx-6 lg:mx-10">
                    <Search className="h-4 w-4 text-gray-400 mr-2 cursor-pointer" onClick={handleSearch} />
                    <input 
                        type="text" 
                        placeholder="Tìm phim..." 
                        className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-900 placeholder:text-gray-500"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                    {!mounted ? (
                        // Skeleton loading during hydration
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>
                    ) : isLoading ? (
                        // Show cached user or skeleton during verification
                        user ? (
                            // Hiển thị cached user trong khi verify
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-3 cursor-pointer group">
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{user.full_name}</p>
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
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="w-full flex text-amber-600 font-semibold">
                                                <ShieldCheck className="mr-2 h-4 w-4" /> 
                                                Trang Quản Trị
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild><Link href="/profile" className="w-full flex"><Settings className="mr-2 h-4 w-4" /> Hồ sơ</Link></DropdownMenuItem>
                                    <DropdownMenuItem asChild><Link href="/my-bookings" className="w-full flex"><Ticket className="mr-2 h-4 w-4" /> Vé của tôi</Link></DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Đăng xuất</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // Skeleton placeholder khi chưa có cache
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            </div>
                        )
                    ) : user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{user.full_name}</p>
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
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="w-full flex text-amber-600 font-semibold">
                                            <ShieldCheck className="mr-2 h-4 w-4" /> 
                                            Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild><Link href="/profile" className="w-full flex"><Settings className="mr-2 h-4 w-4" /> Hồ sơ</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/my-bookings" className="w-full flex"><Ticket className="mr-2 h-4 w-4" /> Vé của tôi</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Đăng xuất</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="text-sm font-bold text-gray-900 hover:text-red-600" asChild><Link href="/auth/signin">ĐĂNG NHẬP</Link></Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6" asChild><Link href="/auth/signup">ĐĂNG KÝ</Link></Button>
                        </div>
                    )}
                </div>
            </div>
            <Separator />
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-3 bg-white">
                <ul className="flex space-x-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}><Link href={link.href} className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors uppercase">{link.label}</Link></li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

function Separator() { return <div className="h-[1px] bg-gray-100 w-full" />; }