'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/Login'; 

export default function LoginPage() {
    const router = useRouter();

    // 1. Logic kiểm tra nếu đã đăng nhập thì chuyển hướng ngay
    useEffect(() => {
        // Kiểm tra localStorage chỉ khi chạy trên client
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            router.replace('/');
        }
    }, [router]);

    // 2. Hàm được gọi sau khi Login.tsx hoàn tất lưu token
    const handleLoginSuccess = () => {
        // Gọi router.refresh() để ép Next.js tải lại dữ liệu trên trang chủ
        // và nhận trạng thái đăng nhập mới.
        router.refresh(); 
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                {/* Truyền hàm xử lý thành công vào LoginForm */}
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
}