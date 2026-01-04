'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  getUserStats, 
  UserStats,
  createUser,
  updateUser,
  setUserPassword,
  CreateUserData,
  UpdateUserData
} from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Shield, User as UserIcon, Search, Users, Edit, Key, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggleRole, setUserToToggleRole] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToSetPassword, setUserToSetPassword] = useState<User | null>(null);
  
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '', code: '' });
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });

  // Form states
  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: '',
    password: '',
    full_name: '',
    cccd_number: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    role: 'customer'
  });

  const [editForm, setEditForm] = useState<UpdateUserData>({
    email: '',
    full_name: '',
    phone_number: '',
    cccd_number: '',
    date_of_birth: '',
    gender: ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadData();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.response?.status === 403) {
        setErrorDialog({ open: true, message: 'Bạn không có quyền truy cập trang này' });
      } else {
        setErrorDialog({ open: true, message: 'Lỗi khi tải dữ liệu' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page when searching
      const filters: any = {};
      if (searchTerm.trim()) filters.search = searchTerm.trim();
      if (roleFilter !== 'all') filters.role = roleFilter;
      
      const data = await getAllUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
      setErrorDialog({ open: true, message: 'Lỗi khi tìm kiếm' });
    } finally {
      setLoading(false);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  // Create user handlers
  const handleCreateClick = () => {
    setCreateForm({
      email: '',
      password: '',
      full_name: '',
      cccd_number: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      role: 'customer'
    });
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      if (!createForm.email || !createForm.password || !createForm.full_name || !createForm.cccd_number) {
        setErrorDialog({ open: true, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
        return;
      }

      // Validate password: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passRegex.test(createForm.password)) {
        setErrorDialog({ 
          open: true, 
          message: 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)' 
        });
        return;
      }

      await createUser(createForm);
      setCreateDialogOpen(false);
      setSuccessDialog({ open: true, message: 'Tạo người dùng mới thành công' });
      loadData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi tạo người dùng mới' 
      });
    }
  };

  // Edit user handlers
  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number || '',
      cccd_number: user.cccd_number,
      date_of_birth: user.date_of_birth || '',
      gender: user.gender || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!userToEdit) return;

    try {
      if (!editForm.email || !editForm.full_name || !editForm.cccd_number) {
        setErrorDialog({ open: true, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
        return;
      }

      await updateUser(userToEdit.id, editForm);
      setEditDialogOpen(false);
      setUserToEdit(null);
      setSuccessDialog({ open: true, message: 'Cập nhật thông tin người dùng thành công' });
      loadData();
    } catch (error: any) {
      console.error('Error updating user:', error);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật thông tin người dùng' 
      });
    }
  };

  // Password handlers
  const handlePasswordClick = (user: User) => {
    setUserToSetPassword(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = async () => {
    if (!userToSetPassword) return;

    try {
      if (!newPassword) {
        setErrorDialog({ open: true, message: 'Vui lòng nhập mật khẩu mới' });
        return;
      }

      // Validate password: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passRegex.test(newPassword)) {
        setErrorDialog({ 
          open: true, 
          message: 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)' 
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorDialog({ open: true, message: 'Mật khẩu xác nhận không khớp' });
        return;
      }

      await setUserPassword(userToSetPassword.id, newPassword);
      setPasswordDialogOpen(false);
      setUserToSetPassword(null);
      setNewPassword('');
      setConfirmPassword('');
      setSuccessDialog({ open: true, message: 'Đặt mật khẩu mới thành công' });
    } catch (error: any) {
      console.error('Error setting password:', error);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi đặt mật khẩu mới' 
      });
    }
  };

  // Delete handlers
  const handleDeleteClick = (user: User) => {
    if (user.id === currentUserId) {
      setErrorDialog({ open: true, message: 'Không thể xóa tài khoản của chính bạn' });
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setSuccessDialog({ open: true, message: 'Xóa người dùng thành công' });
      loadData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi xóa người dùng',
        code: error.response?.data?.code || ''
      });
    }
  };

  // Role handlers
  const handleToggleRoleClick = (user: User) => {
    if (user.id === currentUserId && user.role === 'admin') {
      setErrorDialog({ open: true, message: 'Không thể hạ quyền của chính bạn' });
      return;
    }
    setUserToToggleRole(user);
    setRoleDialogOpen(true);
  };

  const handleToggleRoleConfirm = async () => {
    if (!userToToggleRole) return;

    try {
      const newRole = userToToggleRole.role === 'admin' ? 'customer' : 'admin';
      await updateUserRole(userToToggleRole.id, newRole);
      setRoleDialogOpen(false);
      setUserToToggleRole(null);
      setSuccessDialog({ open: true, message: 'Cập nhật quyền thành công' });
      loadData();
    } catch (error: any) {
      console.error('Error updating role:', error);
      setRoleDialogOpen(false);
      setUserToToggleRole(null);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật quyền' 
      });
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-amber-500 hover:bg-amber-600">Admin</Badge>
    ) : (
      <Badge variant="outline">Customer</Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };

  if (loading && !stats) {
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Người Dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <Button onClick={handleCreateClick} className="bg-red-600 hover:bg-red-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Tạo người dùng mới
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng người dùng</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Admin</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.admins}</p>
              </div>
              <Shield className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Người dùng thường</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.users}</p>
              </div>
              <UserIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Tìm theo email, tên, mã thành viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          
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
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CCCD</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Mã thành viên</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Không tìm thấy người dùng
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cccd_number}</TableCell>
                  <TableCell>{user.phone_number || '-'}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.member_code}</code>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(user)}
                        title="Sửa thông tin"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePasswordClick(user)}
                        title="Đặt mật khẩu"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRoleClick(user)}
                        disabled={user.id === currentUserId && user.role === 'admin'}
                        title={user.id === currentUserId && user.role === 'admin' ? 'Không thể hạ quyền chính mình' : 'Thay đổi quyền'}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.id === currentUserId}
                        className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={user.id === currentUserId ? 'Không thể xóa tài khoản của chính bạn' : 'Xóa người dùng'}
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
            Trang {currentPage} của {totalPages} ({users.length} tổng cộng)
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.full_name}</strong> ({userToDelete?.email})? 
              <br />
              <span className="text-red-600">Hành động này không thể hoàn tác!</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi quyền</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thay đổi quyền của <strong>{userToToggleRole?.full_name}</strong> từ{' '}
              <strong>{userToToggleRole?.role === 'admin' ? 'Admin' : 'Customer'}</strong> sang{' '}
              <strong>{userToToggleRole?.role === 'admin' ? 'Customer' : 'Admin'}</strong>?
              {userToToggleRole?.role === 'admin' && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ Lưu ý: Người dùng sẽ mất quyền truy cập trang quản trị khi chuyển sang Customer.
                </span>
              )}
              {userToToggleRole?.role === 'customer' && (
                <span className="block mt-2 text-blue-600 font-medium">
                  ℹ️ Lưu ý: Người dùng sẽ có toàn quyền quản trị hệ thống khi chuyển sang Admin.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleToggleRoleConfirm}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Tạo người dùng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo tài khoản người dùng mới
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Mật khẩu *</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Tối thiểu 8 ký tự"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-fullname">Họ và tên *</Label>
              <Input
                id="create-fullname"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-cccd">Số CCCD *</Label>
                <Input
                  id="create-cccd"
                  value={createForm.cccd_number}
                  onChange={(e) => setCreateForm({ ...createForm, cccd_number: e.target.value })}
                  placeholder="001234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">Số điện thoại</Label>
                <Input
                  id="create-phone"
                  value={createForm.phone_number}
                  onChange={(e) => setCreateForm({ ...createForm, phone_number: e.target.value })}
                  placeholder="0912345678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-dob">Ngày sinh</Label>
                <Input
                  id="create-dob"
                  type="date"
                  value={createForm.date_of_birth}
                  onChange={(e) => setCreateForm({ ...createForm, date_of_birth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-gender">Giới tính</Label>
                <Select 
                  value={createForm.gender} 
                  onValueChange={(value) => setCreateForm({ ...createForm, gender: value })}
                >
                  <SelectTrigger id="create-gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Quyền</Label>
              <Select 
                value={createForm.role} 
                onValueChange={(value: 'customer' | 'admin') => setCreateForm({ ...createForm, role: value })}
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateSubmit} className="bg-red-600 hover:bg-red-700">
              Tạo người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin của người dùng {userToEdit?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fullname">Họ và tên *</Label>
              <Input
                id="edit-fullname"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cccd">Số CCCD *</Label>
                <Input
                  id="edit-cccd"
                  value={editForm.cccd_number}
                  onChange={(e) => setEditForm({ ...editForm, cccd_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dob">Ngày sinh</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Giới tính</Label>
                <Select 
                  value={editForm.gender} 
                  onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                >
                  <SelectTrigger id="edit-gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditSubmit} className="bg-red-600 hover:bg-red-700">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Đặt mật khẩu mới</DialogTitle>
            <DialogDescription>
              Đặt mật khẩu mới cho người dùng {userToSetPassword?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handlePasswordSubmit} className="bg-red-600 hover:bg-red-700">
              Đặt mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Lỗi</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog({ open: false, message: '', code: '' })}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialog.open} onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-green-600">Thành công</DialogTitle>
            <DialogDescription>{successDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccessDialog({ ...successDialog, open: false })} className="bg-green-600 hover:bg-green-700">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
