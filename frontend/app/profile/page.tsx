'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    User, Mail, CreditCard, Hash, 
    Pencil, Save, X, Lock 
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

    // Password change dialog states
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Profile update dialog states
    const [profileSuccessDialog, setProfileSuccessDialog] = useState(false);
    const [profileErrorDialog, setProfileErrorDialog] = useState({ open: false, message: '' });

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
                setProfileSuccessDialog(true);
            }
        } catch (err: any) {
            console.error(err);
            setProfileErrorDialog({ 
                open: true, 
                message: err.response?.data?.message || "Cập nhật thất bại, vui lòng kiểm tra lại." 
            });
        }
    };

    // 3. Logic xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        setPasswordError('');

        // Validation
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        // Check password strength
        const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
        const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
        const hasNumber = /[0-9]/.test(passwordForm.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            setPasswordError('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*...)');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const res = await axios.put(`${API_URL}/change-password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                setPasswordSuccess(true);
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    setPasswordDialogOpen(false);
                    setPasswordSuccess(false);
                }, 2000);
            }
        } catch (err: any) {
            console.error(err);
            setPasswordError(err.response?.data?.message || "❌ Đổi mật khẩu thất bại");
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
                            <>
                                <Button 
                                    onClick={() => setPasswordDialogOpen(true)} 
                                    variant="outline" 
                                    className="gap-2 shadow-md hover:bg-gray-50"
                                >
                                    <Lock size={16} /> Đổi mật khẩu
                                </Button>
                                <Button 
                                    onClick={() => setIsEditing(true)} 
                                    variant="secondary" 
                                    className="gap-2 shadow-md hover:bg-white"
                                >
                                    <Pencil size={16} /> Chỉnh sửa hồ sơ
                                </Button>
                            </>
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

            {/* Password Change Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="text-red-600" size={20} />
                            Đổi mật khẩu
                        </DialogTitle>
                        <DialogDescription>
                            Nhập mật khẩu hiện tại và mật khẩu mới của bạn
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mật khẩu hiện tại</label>
                            <Input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                placeholder="Nhập mật khẩu hiện tại"
                                className="border-red-200 focus-visible:ring-red-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mật khẩu mới</label>
                            <Input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                className="border-red-200 focus-visible:ring-red-500"
                            />
                            <p className="text-xs text-gray-500">
                                * Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                            <Input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                placeholder="Nhập lại mật khẩu mới"
                                className="border-red-200 focus-visible:ring-red-500"
                            />
                        </div>

                        {passwordError && (
                            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded">
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded">
                                ✅ Đổi mật khẩu thành công!
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setPasswordDialogOpen(false);
                                setPasswordForm({
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                });
                                setPasswordError('');
                            }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            onClick={handleChangePassword}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={passwordSuccess}
                        >
                            Đổi mật khẩu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Success Dialog */}
            <Dialog open={profileSuccessDialog} onOpenChange={setProfileSuccessDialog}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle className="text-green-600">Thành công</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin thành công!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            onClick={() => setProfileSuccessDialog(false)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Error Dialog */}
            <Dialog open={profileErrorDialog.open} onOpenChange={(open) => setProfileErrorDialog({ ...profileErrorDialog, open })}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Lỗi</DialogTitle>
                        <DialogDescription className="text-red-600 font-medium">
                            {profileErrorDialog.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            onClick={() => setProfileErrorDialog({ open: false, message: '' })}
                            variant="outline"
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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