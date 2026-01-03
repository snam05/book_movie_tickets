'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ILoginForm, IAPIResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth';

interface SignInFormProps extends React.ComponentProps<"div"> {
    onSignInSuccess: () => void;
}

export function SignInForm({ className, onSignInSuccess, ...props }: SignInFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<ILoginForm>({ email: '', matKhau: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post<IAPIResponse>(`${API_URL}/login`, formData);
            const user = response.data.data;
            const token = response.data.token;

            if (token && user) {
                // 1. Lưu vào localStorage cho Client UI
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // 2. Lưu vào COOKIE cho Middleware (QUAN TRỌNG)
                Cookies.set('token', token, { 
                    expires: 1, 
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production' 
                });

                // 3. Thông báo Header cập nhật
                window.dispatchEvent(new Event('authChange')); 
                
                // 4. CHUYỂN HƯỚNG: Sử dụng router.push phối hợp với onSignInSuccess
                // Gọi callback từ props trước nếu có
                onSignInSuccess();
                
                // Chuyển hướng về trang chủ
                router.push('/');
                
                // Ép router nhận diện cookie mới ngay lập tức
                router.refresh();
            }

        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-none shadow-xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-red-600">Chào mừng trở lại!</h1>
                                <p className="text-muted-foreground text-sm">Đăng nhập để đặt vé ngay.</p>
                            </div>
                            {error && <div className="p-3 text-xs text-red-600 bg-red-50 rounded-md">{error}</div>}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="email@example.com"
                                    required 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="matKhau">Mật khẩu</Label>
                                <Input 
                                    id="matKhau" 
                                    name="matKhau" 
                                    type="password" 
                                    required 
                                    value={formData.matKhau} 
                                    onChange={(e) => setFormData({...formData, matKhau: e.target.value})} 
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                            <div className="text-center text-sm">
                                Chưa có tài khoản? <Link href="/auth/signup" className="font-bold text-red-600 underline">Đăng ký</Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <Image 
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000" 
                            alt="Cinema" 
                            fill 
                            className="object-cover brightness-[0.4]" 
                            priority 
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
