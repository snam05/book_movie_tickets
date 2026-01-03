'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm } from '@/components/auth/SignIn'; 

export default function SignInPage() {
    const router = useRouter();

    // Middleware sẽ xử lý redirect nếu đã đăng nhập (có session_token)
    // Không cần check ở đây nữa

    // Xử lý khi đăng nhập thành công từ SignInForm
    const handleSignInSuccess = () => {
        // Ép trình duyệt tải lại toàn bộ từ trang chủ
        window.location.href = '/'; 
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                {/* Khi SignInForm chạy xong logic lưu LocalStorage & Cookie, 
                  nó sẽ gọi handleSignInSuccess ở đây 
                */}
                <SignInForm onSignInSuccess={handleSignInSuccess} />
            </div>
        </div>
    );
}