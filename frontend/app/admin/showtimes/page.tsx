'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

interface Showtime {
  id: number;
  showtime_date: string;
  showtime_time: string;
  price: string;
  available_seats: number;
  status: string;
  movie?: {
    id: number;
    title: string;
  };
  theater?: {
    id: number;
    name: string;
  };
}

export default function AdminShowtimesPage() {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);

  useEffect(() => {
    loadShowtimes();
  }, []);

  const loadShowtimes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/showtimes`, {
        withCredentials: true
      });
      setShowtimes(response.data.data);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      alert('Lỗi khi tải danh sách lịch chiếu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showtimeToDelete) return;

    try {
      await axios.delete(`${API_URL}/showtimes/${showtimeToDelete.id}`, {
        withCredentials: true
      });
      alert('Đã xóa lịch chiếu thành công');
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
      loadShowtimes();
    } catch (error: any) {
      console.error('Error deleting showtime:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa lịch chiếu');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'active': { label: 'Hoạt động', className: 'bg-green-500 hover:bg-green-600' },
      'cancelled': { label: 'Đã hủy', className: 'bg-red-500 hover:bg-red-600' },
      'ended': { label: 'Đã kết thúc', className: 'bg-gray-500 hover:bg-gray-600' }
    };
    const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Lịch Chiếu</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch chiếu phim trong hệ thống</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => router.push('/admin/showtimes/create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm lịch chiếu
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Phim</TableHead>
              <TableHead>Rạp</TableHead>
              <TableHead>Ngày chiếu</TableHead>
              <TableHead>Giờ chiếu</TableHead>
              <TableHead>Giá vé</TableHead>
              <TableHead>Ghế trống</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showtimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  Chưa có lịch chiếu nào
                </TableCell>
              </TableRow>
            ) : (
              showtimes.map((showtime) => (
                <TableRow key={showtime.id}>
                  <TableCell className="font-medium">{showtime.id}</TableCell>
                  <TableCell className="font-semibold max-w-[200px] break-words whitespace-normal">
                    {showtime.movie?.title || 'N/A'}
                  </TableCell>
                  <TableCell>{showtime.theater?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(showtime.showtime_date)}</TableCell>
                  <TableCell>{showtime.showtime_time}</TableCell>
                  <TableCell>{formatPrice(showtime.price)}</TableCell>
                  <TableCell>{showtime.available_seats}</TableCell>
                  <TableCell>{getStatusBadge(showtime.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/showtimes/edit/${showtime.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setShowtimeToDelete(showtime);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lịch chiếu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa lịch chiếu này? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
