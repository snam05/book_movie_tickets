'use client';

import React, { useState } from 'react';
import { createGenre } from '@/lib/api/genres';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateGenrePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setErrorDialog({ open: true, message: 'Vui lòng nhập tên thể loại' });
      return;
    }

    try {
      setLoading(true);
      await createGenre({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });
      router.push('/admin/movies/genres');
    } catch (error: any) {
      console.error('Error creating genre:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi khi tạo thể loại';
      setErrorDialog({ open: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thêm Thể loại Mới</h1>
          <p className="text-gray-600 mt-1">Tạo một thể loại phim mới trong hệ thống</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên Thể loại */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Tên Thể loại <span className="text-red-600">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Hành động, Lãng mạn, Khoa học viễn tưởng..."
              disabled={loading}
              required
              className="h-10"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
              Mô tả (không bắt buộc)
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả về thể loại phim..."
              disabled={loading}
              rows={5}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Đang tạo...' : 'Tạo Thể loại'}
            </Button>
          </div>
        </form>
      </div>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription className="text-red-600 font-medium">
              {errorDialog.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setErrorDialog({ ...errorDialog, open: false })}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
