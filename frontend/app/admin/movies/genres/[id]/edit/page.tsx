'use client';

import React, { useState, useEffect } from 'react';
import { getGenreById, updateGenre } from '@/lib/api/genres';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const genreId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadGenre();
  }, [genreId]);

  const loadGenre = async () => {
    try {
      setLoading(true);
      const genre = await getGenreById(genreId);
      setFormData({
        name: genre.name,
        description: genre.description || ''
      });
    } catch (error: any) {
      console.error('Error loading genre:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi khi tải thể loại';
      setErrorDialog({ open: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitting(true);
      await updateGenre(genreId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });
      router.push('/admin/movies/genres');
    } catch (error: any) {
      console.error('Error updating genre:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật thể loại';
      setErrorDialog({ open: true, message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa Thể loại</h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin thể loại phim</p>
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
              disabled={submitting}
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
              disabled={submitting}
              rows={5}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Đang cập nhật...' : 'Cập nhật Thể loại'}
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
