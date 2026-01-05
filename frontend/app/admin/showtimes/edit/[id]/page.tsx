'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAllMovies, MovieFromAPI } from '@/lib/api/movies';
import { getAllTheaters, Theater } from '@/lib/api/theaters';
import { getShowtimeById, updateShowtime } from '@/lib/api/showtimes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EditShowtimePage() {
  const router = useRouter();
  const params = useParams();
  const showtimeId = params.id as string;

  const [formData, setFormData] = useState({
    movie_id: '',
    theater_id: '',
    showtime_date: '',
    showtime_time: '',
    price: '',
  });
  const [isCanceled, setIsCanceled] = useState(false);

  const [movies, setMovies] = useState<MovieFromAPI[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  const loadData = useCallback(async () => {
    try {
      setPageLoading(true);
      const [showtimeData, moviesData, theatersData] = await Promise.all([
        getShowtimeById(Number(showtimeId)),
        getAllMovies(),
        getAllTheaters()
      ]);

      // Lọc bỏ phim đã kết thúc
      setMovies(moviesData.filter(movie => movie.status !== 'ended'));
      setTheaters(theatersData);

      // Format date for input
      const dateOnly = showtimeData.showtime_date.split('T')[0];

      setFormData({
        movie_id: String(showtimeData.movie_id),
        theater_id: String(showtimeData.theater_id),
        showtime_date: dateOnly,
        showtime_time: showtimeData.showtime_time,
        price: String(showtimeData.price),
      });
      setIsCanceled(showtimeData.status === 'canceled');
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorDialog({ open: true, message: 'Lỗi khi tải dữ liệu' });
    } finally {
      setPageLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => {
    if (showtimeId) {
      loadData();
    }
  }, [showtimeId, loadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.movie_id || !formData.theater_id || !formData.showtime_date || !formData.showtime_time || !formData.price) {
      setErrorDialog({ open: true, message: 'Vui lòng điền tất cả thông tin bắt buộc' });
      return;
    }

    try {
      setLoading(true);
      await updateShowtime(Number(showtimeId), {
        movie_id: Number(formData.movie_id),
        theater_id: Number(formData.theater_id),
        showtime_date: formData.showtime_date,
        showtime_time: formData.showtime_time,
        price: formData.price,
        status: isCanceled ? 'canceled' : 'normal'
      });

      router.push('/admin/showtimes');
    } catch (error: any) {
      console.error('Error updating showtime:', error);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật lịch chiếu' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/showtimes">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Sửa Lịch Chiếu</h1>
        <p className="text-gray-600 mt-1">Cập nhật thông tin lịch chiếu</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Movie Selection */}
          <div className="space-y-2">
            <Label htmlFor="movie_id">Phim <span className="text-red-600">*</span></Label>
            <Select value={formData.movie_id} onValueChange={(value) => handleSelectChange('movie_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent>
                {movies.map(movie => (
                  <SelectItem key={movie.id} value={String(movie.id)}>
                    {movie.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theater Selection */}
          <div className="space-y-2">
            <Label htmlFor="theater_id">Rạp Chiếu <span className="text-red-600">*</span></Label>
            <Select value={formData.theater_id} onValueChange={(value) => handleSelectChange('theater_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn rạp chiếu" />
              </SelectTrigger>
              <SelectContent>
                {theaters.map(theater => (
                  <SelectItem key={theater.id} value={String(theater.id)}>
                    {theater.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="showtime_date">Ngày Chiếu <span className="text-red-600">*</span></Label>
              <Input
                type="date"
                name="showtime_date"
                value={formData.showtime_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="showtime_time">Giờ Chiếu <span className="text-red-600">*</span></Label>
              <Input
                type="time"
                name="showtime_time"
                value={formData.showtime_time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Giá Vé (VND) <span className="text-red-600">*</span></Label>
            <Input
              type="number"
              name="price"
              placeholder="Nhập giá vé"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="1000"
              required
            />
          </div>

          {/* Canceled Status */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <input
              type="checkbox"
              id="is_canceled"
              checked={isCanceled}
              onChange={(e) => setIsCanceled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor="is_canceled" className="cursor-pointer font-normal">
              Đánh dấu lịch chiếu này là đã hủy
            </Label>
          </div>
          <p className="text-xs text-gray-500 -mt-1">
            💡 <strong>Lưu ý:</strong> Trạng thái hiển thị (Lên lịch/Đang chiếu/Đã kết thúc) sẽ tự động tính toán dựa trên thời gian chiếu.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập Nhật Lịch Chiếu'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/admin/showtimes')}
            >
              Hủy
            </Button>
          </div>
        </form>

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
            <Button onClick={() => setErrorDialog({ open: false, message: '' })}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
