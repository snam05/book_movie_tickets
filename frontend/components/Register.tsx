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
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Import các kiểu dữ liệu tùy chỉnh
import { IRegisterForm, IAPIResponse } from '@/types/auth'; 

// Lấy Base URL từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth'; 

// Định nghĩa Props cho component
interface RegisterFormProps extends React.ComponentProps<"div"> {
    onRegisterSuccess: () => void; // Hàm được gọi khi đăng ký thành công
}

export function RegisterForm({
    className,
    onRegisterSuccess,
    ...props
}: RegisterFormProps) {
    const router = useRouter();
    // State phải khớp với các trường bắt buộc của backend
    const [formData, setFormData] = useState<IRegisterForm>({
        full_name: '',
        email: '',
        matKhau: '', 
        cccd_number: '', 
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
            // GỌI API ĐẾN BACKEND ĐĂNG KÝ
            const response = await axios.post<IAPIResponse>(`${API_URL}/register`, formData);
            
            // LƯU TOKEN VÀ THÔNG TIN USER (Backend trả về token sau khi đăng ký thành công)
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            onRegisterSuccess(); 
            router.push('/'); // Chuyển hướng về trang chủ sau khi đăng ký thành công

        } catch (err: any) {
            // Xử lý lỗi từ backend (trùng email/cccd)
            const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
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
                                <h1 className="text-2xl font-bold">Tạo Tài Khoản Mới</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Đăng ký để bắt đầu đặt vé ngay lập tức!
                                </p>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 font-medium text-center">{error}</p>
                            )}
                            
                            {/* 1. Họ và Tên */}
                            <Field>
                                <FieldLabel htmlFor="full_name">Họ và Tên</FieldLabel>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </Field>

                            {/* 2. Email */}
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
                                <FieldDescription>
                                    Chúng tôi sẽ sử dụng email này để liên hệ với bạn.
                                </FieldDescription>
                            </Field>
                            
                            {/* 3. Số CCCD */}
                            <Field>
                                <FieldLabel htmlFor="cccd_number">Số CCCD</FieldLabel>
                                <Input
                                    id="cccd_number"
                                    name="cccd_number"
                                    type="text"
                                    required
                                    value={formData.cccd_number}
                                    onChange={handleChange}
                                />
                            </Field>

                            {/* 4. Mật khẩu */}
                            <Field>
                                <Field className="grid grid-cols-1 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="matKhau">Mật khẩu</FieldLabel>
                                        <Input 
                                            id="matKhau" 
                                            name="matKhau"
                                            type="password" 
                                            required 
                                            value={formData.matKhau}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                    {/* Bỏ trường Confirm Password vì backend không yêu cầu */}
                                </Field>
                                <FieldDescription>
                                    Mật khẩu phải dài ít nhất 8 ký tự.
                                </FieldDescription>
                            </Field>
                            
                            <Field>
                                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                                    {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                                </Button>
                            </Field>
                            
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Hoặc tiếp tục với
                            </FieldSeparator>
                            
                            <Field className="grid grid-cols-3 gap-4">
                                <Button variant="outline" type="button">...</Button>
                                <Button variant="outline" type="button">...</Button>
                                <Button variant="outline" type="button">...</Button>
                            </Field>
                            
                            <FieldDescription className="text-center">
                                Đã có tài khoản? <Link href="/login" className="text-green-600 underline-offset-2 hover:underline">Đăng nhập</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/1e293b/ffffff?text=Cinema+Signup"; }}
                        />
                    </div>
                </CardContent>
            </Card>
            <p className="px-6 text-center text-xs text-muted-foreground">
                Bằng cách tạo tài khoản, bạn đồng ý với <Link href="#" className="underline-offset-2 hover:underline">Điều khoản dịch vụ</Link>
                {" "}và <Link href="#" className="underline-offset-2 hover:underline">Chính sách quyền riêng tư</Link> của chúng tôi.
            </p>
        </div>
    );
}