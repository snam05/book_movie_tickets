'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { IRegisterForm, IAPIResponse } from '@/types/auth'; 

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth'; 

interface RegisterFormProps extends React.ComponentProps<"div"> {
    onRegisterSuccess: () => void;
}

export function RegisterForm({ className, onRegisterSuccess, ...props }: RegisterFormProps) {
    const router = useRouter();
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

    // Hàm kiểm tra các ràng buộc dữ liệu
    const validateForm = () => {
        if (formData.full_name.trim().length < 3) {
            return "Họ và tên phải từ 3 ký tự trở lên.";
        }
        
        // Kiểm tra CCCD: Chỉ chứa số và đúng 12 chữ số
        const cccdRegex = /^\d{12}$/;
        if (!cccdRegex.test(formData.cccd_number)) {
            return "Số CCCD phải là 12 chữ số.";
        }

        // Kiểm tra mật khẩu: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(formData.matKhau)) {
            return "Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post<IAPIResponse>(`${API_URL}/register`, formData);
            
            // Backend trả về: { message, data: user, token }
            const user = response.data.data;
            const token = response.data.token;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Phát tín hiệu cho Header cập nhật avatar ngay
                window.dispatchEvent(new Event('authChange')); 

                // Chuyển hướng về trang chủ
                router.push('/');
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-none shadow-xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold text-red-600">TẠO TÀI KHOẢN</h1>
                                <p className="text-muted-foreground text-sm">
                                    Đăng ký để nhận ưu đãi và đặt vé nhanh hơn.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="full_name">Họ và Tên</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cccd_number">Số CCCD (12 số)</Label>
                                <Input
                                    id="cccd_number"
                                    name="cccd_number"
                                    type="text"
                                    maxLength={12}
                                    placeholder="012345678901"
                                    required
                                    value={formData.cccd_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="matKhau">Mật khẩu</Label>
                                <Input 
                                    id="matKhau" 
                                    name="matKhau"
                                    type="password" 
                                    placeholder="••••••••"
                                    required 
                                    value={formData.matKhau}
                                    onChange={handleChange}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                                {loading ? 'Đang tạo tài khoản...' : 'ĐĂNG KÝ NGAY'}
                            </Button>

                            <div className="text-center text-sm">
                                Đã có tài khoản?{" "}
                                <Link href="/auth/login" className="font-bold text-red-600 underline underline-offset-4">
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop"
                            alt="Cinema background"
                            fill
                            className="object-cover brightness-[0.4]"
                            priority
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                            <h2 className="text-xl font-bold">Thành viên TicketApp</h2>
                            <p className="text-sm text-gray-300">Nhận thông báo về các bộ phim bom tấn sớm nhất.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}