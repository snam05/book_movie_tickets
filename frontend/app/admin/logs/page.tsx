'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Clock,
  MapPin,
  Smartphone
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import axios from '@/lib/axios';

interface Activity {
  id: number;
  user_id: number | null;
  action: string;
  resource: string;
  resource_id: number | null;
  description: string;
  metadata: string | null;
  method: string;
  endpoint: string;
  status_code: number | null;
  ip_address: string | null;
  user_agent: string | null;
  browser: string | null;
  os: string | null;
  response_time: number | null;
  created_at: string;
  user?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

interface ActivityResponse {
  success: boolean;
  data: {
    data: Activity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ActivityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // Filters
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Detail view
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    loadActivities();
  }, [currentPage]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError('');

      const params: any = {
        page: currentPage,
        limit: pageSize
      };

      if (filterAction) params.action = filterAction;
      if (filterResource) params.resource = filterResource;
      if (filterUserId) params.userId = parseInt(filterUserId);
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const response = await axios.get('/activities', { params });

      if (response.data.success) {
        setActivities(response.data.data.data);
        setTotal(response.data.data.total);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(response.data.data.page);
      }
    } catch (error: any) {
      console.error('Error loading activities:', error);
      setError('Không thể tải nhật ký hoạt động. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    loadActivities();
  };

  const handleReset = () => {
    setFilterAction('');
    setFilterResource('');
    setFilterUserId('');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };

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

  const getActionBadge = (action: string) => {
    const actions: { [key: string]: { color: string; icon: React.ReactNode } } = {
      'CREATE': { color: 'bg-green-100 text-green-800', icon: <Plus className="w-4 h-4" /> },
      'VIEW': { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> },
      'UPDATE': { color: 'bg-yellow-100 text-yellow-800', icon: <Edit className="w-4 h-4" /> },
      'DELETE': { color: 'bg-red-100 text-red-800', icon: <Trash2 className="w-4 h-4" /> },
      'LOGIN': { color: 'bg-purple-100 text-purple-800', icon: <LogIn className="w-4 h-4" /> },
      'LOGOUT': { color: 'bg-gray-100 text-gray-800', icon: <LogOut className="w-4 h-4" /> }
    };

    const config = actions[action] || { color: 'bg-gray-100 text-gray-800', icon: null };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${config.color}`}>
        {config.icon}
        {action}
      </span>
    );
  };

  const getStatusBadge = (statusCode: number | null) => {
    if (!statusCode) return <span className="text-gray-500">-</span>;

    if (statusCode >= 200 && statusCode < 300) {
      return <span className="text-green-600 font-medium">{statusCode}</span>;
    } else if (statusCode >= 300 && statusCode < 400) {
      return <span className="text-blue-600 font-medium">{statusCode}</span>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <span className="text-yellow-600 font-medium">{statusCode}</span>;
    } else {
      return <span className="text-red-600 font-medium">{statusCode}</span>;
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải nhật ký hoạt động...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button 
          onClick={loadActivities}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nhật ký Hoạt động</h1>
        <p className="text-gray-600 mt-2">Theo dõi tất cả hoạt động trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lọc dữ liệu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 block mb-2">Hành động</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả</option>
              <option value="CREATE">Tạo mới</option>
              <option value="VIEW">Xem</option>
              <option value="UPDATE">Chỉnh sửa</option>
              <option value="DELETE">Xóa</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOGOUT">Đăng xuất</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Loại tài nguyên</label>
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả</option>
              <option value="User">Người dùng</option>
              <option value="Movie">Phim</option>
              <option value="Booking">Đặt vé</option>
              <option value="Showtime">Suất chiếu</option>
              <option value="Theater">Rạp chiếu</option>
              <option value="Genre">Thể loại</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">ID Người dùng</label>
            <Input
              type="number"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              placeholder="Nhập ID..."
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Từ ngày</label>
            <Input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Đến ngày</label>
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleFilter}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            Lọc
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            disabled={loading}
          >
            Đặt lại
          </Button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Tài nguyên</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Trình duyệt</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Không có nhật ký hoạt động
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getActionBadge(activity.action)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {activity.resource}
                    {activity.resource_id && <span className="text-gray-500 ml-1">#{activity.resource_id}</span>}
                  </TableCell>
                  <TableCell className="text-sm">
                    {activity.user ? (
                      <div>
                        <p className="font-medium">{activity.user.full_name || activity.user.email}</p>
                        <p className="text-gray-500 text-xs">{activity.user.role}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500">Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getStatusBadge(activity.status_code)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span>{activity.browser}</span>
                      <span className="text-gray-500 text-xs">{activity.os}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {activity.ip_address || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
            Trang {currentPage} của {totalPages} ({total} tổng cộng)
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm text-gray-600">Tổng cộng</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{total.toLocaleString('vi-VN')}</p>
        <p className="text-sm text-gray-500 mt-2">hoạt động được ghi lại</p>
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Chi tiết Hoạt động</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">ID</p>
                    <p className="font-medium">{selectedActivity.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thời gian</p>
                    <p className="font-medium">{format(new Date(selectedActivity.created_at), 'dd/MM/yyyy HH:mm:ss')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hành động</p>
                    <p className="font-medium">{selectedActivity.action}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tài nguyên</p>
                    <p className="font-medium">{selectedActivity.resource}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">HTTP</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Method</p>
                    <p className="font-medium">{selectedActivity.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status Code</p>
                    <p className="font-medium">{selectedActivity.status_code || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Endpoint</p>
                    <p className="font-medium break-all text-xs">{selectedActivity.endpoint}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedActivity.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Người dùng</h3>
                {selectedActivity.user ? (
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    <p><span className="text-gray-500">Email:</span> {selectedActivity.user.email}</p>
                    <p><span className="text-gray-500">Tên:</span> {selectedActivity.user.full_name}</p>
                    <p><span className="text-gray-500">Quyền:</span> {selectedActivity.user.role}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không xác định</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Thông tin Hệ thống</h3>
                <div className="text-sm bg-gray-50 p-3 rounded space-y-2">
                  <p><span className="text-gray-500">IP Address:</span> {selectedActivity.ip_address || '-'}</p>
                  <p><span className="text-gray-500">Trình duyệt:</span> {selectedActivity.browser || '-'}</p>
                  <p><span className="text-gray-500">Hệ điều hành:</span> {selectedActivity.os || '-'}</p>
                  <p><span className="text-gray-500">Thời gian phản hồi:</span> {selectedActivity.response_time ? `${selectedActivity.response_time}ms` : '-'}</p>
                </div>
              </div>

              {selectedActivity.metadata && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Metadata</h3>
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedActivity.metadata), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-2 justify-end sticky bottom-0 bg-white">
              <Button 
                onClick={() => setSelectedActivity(null)}
                className="bg-red-600 hover:bg-red-700"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
