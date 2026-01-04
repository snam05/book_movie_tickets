'use client';

import { useState, useEffect } from 'react';
import { getAllMovies, deleteMovie, MovieFromAPI } from '@/lib/api/movies';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2, Film, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export default function AdminMoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<MovieFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<MovieFromAPI | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
      alert('Lỗi khi tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : '';
      const response = await axios.get(`${API_URL}/movies${params}`);
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      alert('Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!movieToDelete) return;

    try {
      await axios.delete(`${API_URL}/movies/${movieToDelete.id}`, {
        withCredentials: true
      });
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
      loadMovies();
    } catch (error: any) {
      console.error('Error deleting movie:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa phim');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'now_showing': { label: 'Đang chiếu', className: 'bg-green-500 hover:bg-green-600' },
      'coming_soon': { label: 'Sắp chiếu', className: 'bg-blue-500 hover:bg-blue-600' },
      'ended': { label: 'Đã kết thúc', className: 'bg-gray-500 hover:bg-gray-600' }
    };
    const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
    return <Badge className={config.className}>{config.label}</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Phim</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách phim trong hệ thống</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => router.push('/admin/movies/create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm phim mới
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Tìm phim theo tên..."
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
              <TableHead>ID</TableHead>
              <TableHead>Tên phim</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Chưa có phim nào
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.id}</TableCell>
                  <TableCell className="font-semibold max-w-[200px] break-words whitespace-normal">{movie.title}</TableCell>
                  <TableCell>{movie.duration} phút</TableCell>
                  <TableCell>
                    <Badge variant="outline">⭐ {movie.rating || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(movie.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/movies/edit/${movie.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setMovieToDelete(movie);
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
            <DialogTitle>Xác nhận xóa phim</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phim <strong>{movieToDelete?.title}</strong>? 
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
