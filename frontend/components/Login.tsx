'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Import các component UI của shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Import các kiểu dữ liệu tùy chỉnh
import { ILoginForm, IAPIResponse } from '@/types/auth'; 

// Lấy Base URL từ biến môi trường
// Kết quả: http://localhost:3001/api/v1/auth
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth'; 

// Định nghĩa Props cho component
interface LoginFormProps extends React.ComponentProps<"div"> {
    onLoginSuccess: () => void; // Hàm được gọi khi đăng nhập thành công
}

export function LoginForm({
    className,
    onLoginSuccess,
    ...props
}: LoginFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<ILoginForm>({
        email: '',
        matKhau: '', // Phải khớp với backend
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // GỌI API ĐẾN BACKEND ĐĂNG NHẬP: http://localhost:3001/api/v1/auth/login
            const response = await axios.post<IAPIResponse>(`${API_URL}/login`, formData);
            
            // LƯU TOKEN VÀ THÔNG TIN USER
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            onLoginSuccess(); // Báo cáo thành công cho page.tsx
            router.push('/'); // Chuyển hướng về trang chủ

        } catch (err: any) {
            // Xử lý lỗi từ backend (401 Unauthorized do sai email/mật khẩu)
            const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại Email và Mật khẩu.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Chào mừng trở lại!</h1>
                                <p className="text-muted-foreground text-balance">
                                    Đăng nhập vào hệ thống đặt vé phim.
                                </p>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 font-medium text-center">{error}</p>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="matKhau">Mật khẩu</FieldLabel>
                                    <Link
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <Input 
                                    id="matKhau" 
                                    name="matKhau"
                                    type="password" 
                                    required 
                                    value={formData.matKhau}
                                    onChange={handleChange}
                                />
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </Button>
                            </Field>
                            
                            <Field className="text-center">
                                Chưa có tài khoản? <Link href="/register" className="text-red-600 underline-offset-2 hover:underline">Đăng ký</Link>
                            </Field>
                            
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            // THAY THẾ bằng hình ảnh phù hợp cho ứng dụng đặt vé
                            onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/1e293b/ffffff?text=Cinema+Aesthetic"; }}
                        />
                    </div>
                </CardContent>
            </Card>
            <p className="px-6 text-center text-xs text-muted-foreground">
                Bằng cách đăng nhập, bạn đồng ý với <Link href="#" className="underline-offset-2 hover:underline">Điều khoản dịch vụ</Link>
                {" "}và <Link href="#" className="underline-offset-2 hover:underline">Chính sách quyền riêng tư</Link> của chúng tôi.
            </p>
        </div>
    );
}