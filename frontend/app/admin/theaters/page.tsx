'use client';

import { useState, useEffect } from 'react';
import { Theater, getAllTheaters, deleteTheater, updateTheaterStatus } from '@/lib/api/theaters';
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
import { Plus, Pencil, Trash2, Power, PowerOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminTheatersPage() {
  const router = useRouter();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [theaterToDelete, setTheaterToDelete] = useState<Theater | null>(null);
  const [theaterToToggle, setTheaterToToggle] = useState<Theater | null>(null);

  useEffect(() => {
    loadTheaters();
  }, []);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const data = await getAllTheaters();
      setTheaters(data);
    } catch (error) {
      console.error('Error loading theaters:', error);
      alert('Lỗi khi tải danh sách rạp chiếu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!theaterToDelete) return;

    try {
      await deleteTheater(theaterToDelete.id);
      alert('Đã xóa rạp chiếu thành công');
      setDeleteDialogOpen(false);
      setTheaterToDelete(null);
      loadTheaters();
    } catch (error: any) {
      console.error('Error deleting theater:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa rạp chiếu');
    }
  };

  const handleToggleStatusClick = (theater: Theater) => {
    setTheaterToToggle(theater);
    setStatusDialogOpen(true);
  };

  const handleToggleStatusConfirm = async () => {
    if (!theaterToToggle) return;

    const newStatus = theaterToToggle.status === 'active' ? 'maintenance' : 'active';

    try {
      await updateTheaterStatus(theaterToToggle.id, newStatus);
      setStatusDialogOpen(false);
      setTheaterToToggle(null);
      loadTheaters();
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi cập nhật trạng thái';
      alert(`Lỗi: ${errorMessage}`);
    }
  };

  const getTheaterTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      standard: 'Thường',
      vip: 'VIP',
      imax: 'IMAX',
      '3d': '3D'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500 hover:bg-green-600">Hoạt động</Badge>
    ) : (
      <Badge className="bg-yellow-500 hover:bg-yellow-600">Bảo trì</Badge>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Rạp Chiếu</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách rạp chiếu trong hệ thống</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => router.push('/admin/theaters/create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm rạp mới
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên rạp</TableHead>
              <TableHead>Loại rạp</TableHead>
              <TableHead>Số ghế</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theaters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Chưa có rạp chiếu nào
                </TableCell>
              </TableRow>
            ) : (
              theaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell className="font-medium">{theater.id}</TableCell>
                  <TableCell className="font-semibold">{theater.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTheaterTypeLabel(theater.theater_type)}</Badge>
                  </TableCell>
                  <TableCell>{theater.total_seats}</TableCell>
                  <TableCell>{getStatusBadge(theater.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatusClick(theater)}
                        title={theater.status === 'active' ? 'Chuyển sang bảo trì' : 'Chuyển sang hoạt động'}
                      >
                        {theater.status === 'active' ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/theaters/edit/${theater.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setTheaterToDelete(theater);
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
            <DialogTitle>Xác nhận xóa rạp chiếu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa rạp <strong>{theaterToDelete?.name}</strong>? 
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

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn chuyển rạp <strong>{theaterToToggle?.name}</strong> sang trạng thái{' '}
              <strong>{theaterToToggle?.status === 'active' ? 'bảo trì' : 'hoạt động'}</strong>?
              {theaterToToggle?.status === 'active' && (
                <span className="block mt-2 text-orange-600">
                  Lưu ý: Rạp sẽ không hiển thị lịch chiếu cho khách hàng khi đang bảo trì.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleToggleStatusConfirm}
              className={theaterToToggle?.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {theaterToToggle?.status === 'active' ? 'Chuyển sang bảo trì' : 'Kích hoạt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
