'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';

interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

const categoryOptions = [
  { value: 'movie_news', label: 'Tin Phim' },
  { value: 'events', label: 'Sự Kiện' },
  { value: 'promotions', label: 'Khuyến Mãi' },
  { value: 'reviews', label: 'Đánh Giá' },
  { value: 'interviews', label: 'Phỏng Vấn' },
  { value: 'behind_the_scenes', label: 'Hậu Trường' },
];

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    image: '',
    category: 'movie_news',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/news/admin/all?limit=20');
      setNewsList(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải tin tức');
    } finally {
      setLoading(false);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(newsList.length / pageSize);
  const paginatedNews = newsList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axiosInstance.post('/upload/image', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success && response.data.data?.url) {
        setFormData({
          ...formData,
          image: response.data.data.url,
        });
        setError(null);
      } else {
        setError('Tải ảnh thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.message || 'Lỗi khi tải ảnh. Vui lòng kiểm tra kết nối.';
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/news/${editingId}`, formData);
      } else {
        await axiosInstance.post('/news', formData);
      }
      await fetchNews();
      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu tin tức');
    }
  };

  const handleEdit = (news: News) => {
    setFormData({
      title: news.title,
      content: news.content,
      summary: news.summary,
      image: news.image,
      category: news.category,
    });
    setEditingId(news.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn chắc chắn muốn xóa tin tức này?')) {
      try {
        await axiosInstance.delete(`/news/${id}`);
        await fetchNews();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi xóa tin tức');
      }
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await axiosInstance.put(`/news/${id}/publish`);
      await fetchNews();
    } catch (err: any) {
      setError('Lỗi khi publish tin tức');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await axiosInstance.put(`/news/${id}/unpublish`);
      await fetchNews();
    } catch (err: any) {
      setError('Lỗi khi unpublish tin tức');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      image: '',
      category: 'movie_news',
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Tin Tức</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm tin tức
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu Đề</TableHead>
              <TableHead>Danh Mục</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.length > 0 ? (
              paginatedNews.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium line-clamp-2 max-w-xs">
                    {news.title}
                  </TableCell>
                  <TableCell>
                    {categoryOptions.find((c) => c.value === news.category)?.label}
                  </TableCell>
                  <TableCell>
                    {news.isPublished ? (
                      <Badge className="bg-green-100 text-green-800 border border-green-200">
                        Đã công bố
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Bản nháp</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!news.isPublished ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublish(news.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Công bố
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnpublish(news.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <EyeOff className="w-4 h-4 mr-1" />
                        Ẩn
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(news)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(news.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Không có tin tức nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            size="sm"
          >
            Đầu tiên
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            size="sm"
          >
            Trước
          </Button>

          {getPaginationNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-500">…</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(Number(page))}
                  disabled={loading}
                  size="sm"
                  className={currentPage === page ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            size="sm"
          >
            Tiếp theo
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            size="sm"
          >
            Cuối cùng
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Đi đến:</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              defaultValue={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  handleGoToPage(page);
                }
              }}
              className="w-16 h-10"
            />
          </div>

          <div className="ml-4 text-sm text-gray-600">
            Trang {currentPage} / {totalPages} - Tổng: {newsList.length}
          </div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin tin tức để {editingId ? 'cập nhật' : 'tạo mới'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu Đề *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Tóm Tắt *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={2}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Nội Dung *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Danh Mục *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Ảnh Đại Diện</Label>
              <div className="space-y-3">
                {formData.image && (
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Đang tải...' : 'Chọn ảnh hoặc kéo thả'}
                  </span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit" disabled={uploading}>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
