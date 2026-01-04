'use client';

import React, { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, Calendar, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllShowtimes, deleteShowtime, Showtime } from '@/lib/api/showtimes';
import { Input } from '@/components/ui/input';

export default function AdminShowtimesPage() {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '', code: '' });

  useEffect(() => {
    loadShowtimes();
  }, []);

  const loadShowtimes = async () => {
    try {
      setLoading(true);
      const data = await getAllShowtimes();
      setShowtimes(data);
      setFilteredShowtimes(data);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      setErrorDialog({ open: true, message: 'Lỗi khi tải danh sách lịch chiếu' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredShowtimes(showtimes);
      setCurrentPage(1);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = showtimes.filter(showtime => 
      showtime.movie?.title.toLowerCase().includes(term) ||
      showtime.theater?.name.toLowerCase().includes(term)
    );
    setFilteredShowtimes(filtered);
    setCurrentPage(1);
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredShowtimes.length / pageSize);
  const paginatedShowtimes = filteredShowtimes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPaginationNumbers = () => {
    const pages = [];
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

  const handleDelete = async () => {
    if (!showtimeToDelete) return;

    try {
      await deleteShowtime(showtimeToDelete.id);
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
      loadShowtimes();
    } catch (error: any) {
      console.error('Error deleting showtime:', error);
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi xóa lịch chiếu',
        code: error.response?.data?.code || ''
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'scheduled': { label: 'Lên Lịch', className: 'bg-blue-500 hover:bg-blue-600' },
      'showing': { label: 'Đang Chiếu', className: 'bg-green-500 hover:bg-green-600' },
      'completed': { label: 'Đã Kết Thúc', className: 'bg-gray-500 hover:bg-gray-600' },
      'canceled': { label: 'Đã Hủy', className: 'bg-red-500 hover:bg-red-600' }
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

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Tìm lịch chiếu theo phim, rạp, ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) {
                setFilteredShowtimes(showtimes);
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
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
            {paginatedShowtimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Không tìm thấy lịch chiếu nào' : 'Chưa có lịch chiếu nào'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedShowtimes.map((showtime) => (
                <TableRow key={showtime.id}>
                  <TableCell className="font-semibold max-w-[200px] break-words whitespace-normal">
                    {showtime.movie?.title || 'N/A'}
                  </TableCell>
                  <TableCell>{showtime.theater?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(showtime.showtime_date)}</TableCell>
                  <TableCell>{showtime.showtime_time}</TableCell>
                  <TableCell>{formatPrice(showtime.price)}</TableCell>
                  <TableCell>{showtime.available_seats}</TableCell>
                  <TableCell>{getStatusBadge(showtime.display_status || showtime.status)}</TableCell>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
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
                <span className="px-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page as number)}
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
            Trang {currentPage} của {totalPages} ({filteredShowtimes.length} tổng cộng)
          </div>
        </div>
      )}

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
            <Button onClick={() => setErrorDialog({ open: false, message: '', code: '' })}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
