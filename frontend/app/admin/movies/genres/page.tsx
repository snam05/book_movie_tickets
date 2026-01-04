'use client';

import React, { useState, useEffect } from 'react';
import { getAllGenres, deleteGenre, Genre } from '@/lib/api/genres';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export default function AdminGenresPage() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filteredGenres, setFilteredGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '', code: '' });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const data = await getAllGenres();
      setGenres(data);
      setFilteredGenres(data);
    } catch (error) {
      console.error('Error loading genres:', error);
      setErrorDialog({ open: true, message: 'Lỗi khi tải danh sách thể loại' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredGenres(genres);
      setCurrentPage(1);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = genres.filter(genre => 
      genre.name.toLowerCase().includes(term)
    );
    setFilteredGenres(filtered);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!genreToDelete) return;

    try {
      await deleteGenre(genreToDelete.id);
      setDeleteDialogOpen(false);
      setGenreToDelete(null);
      loadGenres();
    } catch (error: any) {
      console.error('Error deleting genre:', error);
      setDeleteDialogOpen(false);
      setGenreToDelete(null);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi xóa thể loại',
        code: error.response?.data?.code || ''
      });
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredGenres.length / pageSize);
  const paginatedGenres = filteredGenres.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Thể loại Phim</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách các thể loại phim</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => router.push('/admin/movies/genres/create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm Thể loại
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Tìm thể loại theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableHead>Tên Thể loại</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGenres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Chưa có thể loại nào
                </TableCell>
              </TableRow>
            ) : (
              paginatedGenres.map((genre) => (
                <TableRow key={genre.id}>
                  <TableCell>{genre.name}</TableCell>
                  <TableCell className="text-gray-600 max-w-[300px] truncate">
                    {genre.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/movies/genres/${genre.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setGenreToDelete(genre);
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
            Trang {currentPage} của {totalPages} ({filteredGenres.length} tổng cộng)
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thể loại</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thể loại <strong>{genreToDelete?.name}</strong>? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
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
