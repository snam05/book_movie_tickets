'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    User, Mail, CreditCard, Hash, 
    Pencil, Save, X 
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Form tạm thời để lưu giá trị khi đang sửa
    const [formData, setFormData] = useState({
        full_name: '',
        cccd_number: ''
    });

    // 1. Lấy dữ liệu từ Database ngay khi vào trang
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/verify`, {
                    withCredentials: true
                });

                if (response.data.valid) {
                    const userData = response.data.user;
                    setUser(userData);
                    setFormData({
                        full_name: userData.full_name || '',
                        cccd_number: userData.cccd_number || ''
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 2. Logic xử lý lưu thay đổi
    const handleSave = async () => {
        try {
            const res = await axios.put(`${API_URL}/update-profile`, formData, {
                withCredentials: true
            });

            if (res.data.success) {
                const updatedData = res.data.data;
                
                // Cập nhật giao diện
                setUser(updatedData);
                
                // Thông báo cho các component khác (như Header) cập nhật lại tên
                window.dispatchEvent(new Event('authChange'));
                
                setIsEditing(false);
                alert("✅ Cập nhật thông tin thành công!");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "❌ Cập nhật thất bại, vui lòng kiểm tra lại.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen font-medium text-red-600">
            Đang đồng bộ dữ liệu...
        </div>
    );

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                {/* Phần bìa màu Gradient */}
                <div className="h-32 bg-gradient-to-r from-red-600 to-red-800 relative">
                    <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                        <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                            <AvatarFallback className="bg-gray-100 text-red-600 text-3xl font-black uppercase">
                                {user?.full_name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    
                    {/* CỤM NÚT ĐIỀU KHIỂN SỬA/LƯU/HỦY */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {!isEditing ? (
                            <Button 
                                onClick={() => setIsEditing(true)} 
                                variant="secondary" 
                                className="gap-2 shadow-md hover:bg-white"
                            >
                                <Pencil size={16} /> Chỉnh sửa hồ sơ
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    onClick={handleSave} 
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md"
                                >
                                    <Save size={16} /> Lưu thay đổi
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset lại form về dữ liệu cũ nếu hủy sửa
                                        setFormData({
                                            full_name: user.full_name,
                                            cccd_number: user.cccd_number || ''
                                        });
                                    }} 
                                    variant="destructive" 
                                    className="gap-2 shadow-md"
                                >
                                    <X size={16} /> Hủy
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <CardContent className="pt-16 pb-8 px-8">
                    {/* Header thông tin chính */}
                    <div className="mb-8 border-b pb-6">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                            {user?.full_name}
                        </h1>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-red-600 border-red-200 uppercase font-mono tracking-widest">
                                {user?.role || 'CUSTOMER'} MEMBER
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-none">
                                ID: {user?.member_code}
                            </Badge>
                        </div>
                    </div>

                    {/* Lưới thông tin chi tiết */}
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                        <InfoSection 
                            icon={<User className="text-red-600" />} 
                            label="Họ và Tên" 
                            isEditing={isEditing}
                            value={user?.full_name}
                        >
                            <Input 
                                value={formData.full_name} 
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className="border-red-200 focus-visible:ring-red-500"
                                placeholder="Nhập họ tên mới"
                            />
                        </InfoSection>

                        <InfoSection 
                            icon={<Mail className="text-red-600" />} 
                            label="Địa chỉ Email" 
                            isEditing={false} 
                            value={user?.email}
                        />

                        <InfoSection 
                            icon={<CreditCard className="text-red-600" />} 
                            label="Số CCCD / Định danh" 
                            isEditing={isEditing}
                            value={user?.cccd_number || "Chưa cập nhật"}
                        >
                            <Input 
                                value={formData.cccd_number} 
                                onChange={(e) => setFormData({...formData, cccd_number: e.target.value})}
                                className="border-red-200 focus-visible:ring-red-500"
                                placeholder="Nhập 12 số CCCD"
                            />
                        </InfoSection>

                        <InfoSection 
                            icon={<Hash className="text-red-600" />} 
                            label="Mã thành viên" 
                            isEditing={false}
                            value={user?.member_code}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function InfoSection({ icon, label, value, isEditing, children }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                {icon}
                <span>{label}</span>
            </div>
            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            ) : (
                <p className="text-lg font-semibold text-gray-800 ml-8 truncate">
                    {value}
                </p>
            )}
        </div>
    );
}