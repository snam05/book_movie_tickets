'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/Login'; 
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();

    // 1. Nếu đã có token (đã đăng nhập), không cho ở lại trang login
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.replace('/');
        }
    }, [router]);

    // 2. Xử lý khi đăng nhập thành công từ LoginForm
    const handleLoginSuccess = () => {
    // Ép trình duyệt tải lại toàn bộ từ trang chủ
    // Cách này đảm bảo 100% thành công vì nó xóa bỏ mọi cache router cũ
    window.location.href = '/'; 
};

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                {/* Khi LoginForm chạy xong logic lưu LocalStorage & Cookie, 
                  nó sẽ gọi handleLoginSuccess ở đây 
                */}
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
}