'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/components/auth/SignUp'; 

export default function SignUpPage() {
    const router = useRouter();

    // Hàm được gọi sau khi SignUpForm hoàn tất lưu token
    const handleSignUpSuccess = () => {
        // Chỉ cần gọi refresh để trang chủ nhận trạng thái đăng nhập mới
        router.refresh(); 
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                {/* Truyền hàm xử lý thành công vào SignUpForm */}
                <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
            </div>
        </div>
    );
}