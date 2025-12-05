'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/Register'; 

export default function RegisterPage() {
    const router = useRouter();

    // 1. Logic kiểm tra nếu đã đăng nhập thì chuyển hướng ngay
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            router.replace('/');
        }
    }, [router]);

    // 2. Hàm được gọi sau khi RegisterForm hoàn tất lưu token
    const handleRegisterSuccess = () => {
        // Chỉ cần gọi refresh để trang chủ nhận trạng thái đăng nhập mới
        router.refresh(); 
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                {/* Truyền hàm xử lý thành công vào RegisterForm */}
                <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            </div>
        </div>
    );
}