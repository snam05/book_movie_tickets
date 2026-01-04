'use client';

import { useState, useEffect } from 'react';
import {
    AdminBooking,
    BookingStats,
    getAllBookings,
    getBookingStats,
    updatePaymentStatus,
    updateBookingStatus,
    deleteBooking
} from '@/lib/api/admin-bookings';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Trash2, Search, DollarSign, Ticket, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
    const [stats, setStats] = useState<BookingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [newPaymentMethod, setNewPaymentMethod] = useState('');
    const [newBookingStatus, setNewBookingStatus] = useState('');

    const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
    const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bookingsData, statsData] = await Promise.all([
                getAllBookings(),
                getBookingStats()
            ]);
            setBookings(bookingsData);
            setFilteredBookings(bookingsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading data:', error);
            setErrorDialog({ open: true, message: 'Lỗi khi tải dữ liệu' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        let filtered = bookings;

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.booking_code.toLowerCase().includes(term) ||
                booking.user?.email.toLowerCase().includes(term) ||
                booking.user?.full_name.toLowerCase().includes(term) ||
                booking.showtime?.movie?.title.toLowerCase().includes(term)
            );
        }

        // Filter by booking status
        if (bookingStatusFilter !== 'all') {
            filtered = filtered.filter(b => b.booking_status === bookingStatusFilter);
        }

        // Filter by payment status
        if (paymentStatusFilter !== 'all') {
            filtered = filtered.filter(b => b.payment_status === paymentStatusFilter);
        }

        setFilteredBookings(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [bookingStatusFilter, paymentStatusFilter, searchTerm]);

    const handleDeleteClick = (booking: AdminBooking) => {
        setSelectedBooking(booking);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedBooking) return;

        try {
            await deleteBooking(selectedBooking.id);
            setDeleteDialogOpen(false);
            setSelectedBooking(null);
            setSuccessDialog({ open: true, message: 'Xóa booking thành công' });
            loadData();
        } catch (error: any) {
            console.error('Error deleting booking:', error);
            setDeleteDialogOpen(false);
            setSelectedBooking(null);
            setErrorDialog({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi xóa booking'
            });
        }
    };

    const handleDetailClick = (booking: AdminBooking) => {
        setSelectedBooking(booking);
        setDetailDialogOpen(true);
    };

    const handlePaymentClick = (booking: AdminBooking) => {
        setSelectedBooking(booking);
        setNewPaymentStatus(booking.payment_status);
        setNewPaymentMethod(booking.payment_method || '');
        setPaymentDialogOpen(true);
    };

    const handlePaymentSubmit = async () => {
        if (!selectedBooking) return;

        try {
            await updatePaymentStatus(selectedBooking.id, newPaymentStatus, newPaymentMethod);
            setPaymentDialogOpen(false);
            setSelectedBooking(null);
            setSuccessDialog({ open: true, message: 'Cập nhật trạng thái thanh toán thành công' });
            loadData();
        } catch (error: any) {
            console.error('Error updating payment:', error);
            setErrorDialog({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi cập nhật'
            });
        }
    };

    const handleStatusClick = (booking: AdminBooking) => {
        setSelectedBooking(booking);
        setNewBookingStatus(booking.booking_status);
        setStatusDialogOpen(true);
    };

    const handleStatusSubmit = async () => {
        if (!selectedBooking) return;

        try {
            await updateBookingStatus(selectedBooking.id, newBookingStatus);
            setStatusDialogOpen(false);
            setSelectedBooking(null);
            setSuccessDialog({ open: true, message: 'Cập nhật trạng thái booking thành công' });
            loadData();
        } catch (error: any) {
            console.error('Error updating status:', error);
            setErrorDialog({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi cập nhật'
            });
        }
    };

    const getBookingStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            'pending': { label: 'Chờ xử lý', className: 'bg-yellow-500 hover:bg-yellow-600' },
            'confirmed': { label: 'Đã xác nhận', className: 'bg-green-500 hover:bg-green-600' },
            'cancelled': { label: 'Đã hủy', className: 'bg-red-500 hover:bg-red-600' },
            'completed': { label: 'Hoàn thành', className: 'bg-blue-500 hover:bg-blue-600' }
        };
        const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={`${config.className} text-xs px-2 py-0.5 whitespace-nowrap`}>{config.label}</Badge>;
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            'paid': { label: 'Đã thanh toán', className: 'bg-green-500 hover:bg-green-600' },
            'unpaid': { label: 'Chưa thanh toán', className: 'bg-orange-500 hover:bg-orange-600' },
            'refunded': { label: 'Đã hoàn tiền', className: 'bg-purple-500 hover:bg-purple-600' }
        };
        const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={`${config.className} text-xs px-2 py-0.5 whitespace-nowrap`}>{config.label}</Badge>;
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(parseFloat(price));
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
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
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Đặt Vé</h1>
                    <p className="text-gray-600 mt-1">Quản lý bookings trong hệ thống</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Tổng đặt vé</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <Ticket className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Chờ xử lý</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <Ticket className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Đã hủy</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Đã thanh toán</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Doanh thu</p>
                                <p className="text-xl font-bold text-blue-600 mt-1">
                                    {(stats.totalRevenue / 1000000).toFixed(1)}M
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Tìm theo mã booking, email, tên, phim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                    </div>

                    <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái booking" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="paid">Đã thanh toán</SelectItem>
                            <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                            <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
                        <Search className="mr-2 h-4 w-4" />
                        Tìm kiếm
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="w-full overflow-x-hidden">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 w-[10%] text-sm font-medium">Mã BK</th>
                                <th className="text-left p-2 w-[20%] text-sm font-medium">Người đặt</th>
                                <th className="text-left p-2 w-[15%] text-sm font-medium hidden lg:table-cell">Phim</th>
                                <th className="text-left p-2 w-[12%] text-sm font-medium">Suất</th>
                                <th className="text-center p-2 w-[6%] text-sm font-medium">SL</th>
                                <th className="text-left p-2 w-[10%] text-sm font-medium">Giá</th>
                                <th className="text-left p-2 w-[12%] text-sm font-medium">Trạng thái</th>
                                <th className="text-right p-2 w-[15%] text-sm font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'Không tìm thấy booking nào' : 'Chưa có booking nào'}
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">
                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded block truncate">
                                            {booking.booking_code}
                                        </code>
                                    </td>
                                    <td className="p-2">
                                        <div className="font-semibold truncate">{booking.user?.full_name}</div>
                                        <div className="text-sm text-gray-500 truncate">{booking.user?.email}</div>
                                    </td>
                                    <td className="p-2 hidden lg:table-cell">
                                        <div className="truncate" title={booking.showtime?.movie?.title}>
                                            {booking.showtime?.movie?.title || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="text-sm whitespace-nowrap">
                                            <div>{format(new Date(booking.showtime?.showtime_date || ''), 'dd/MM/yy')}</div>
                                            <div className="text-gray-500">{booking.showtime?.showtime_time}</div>
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">{booking.total_seats}</td>
                                    <td className="p-2 font-semibold">
                                        <div className="truncate">{formatPrice(booking.total_price)}</div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex flex-col gap-1">
                                            {getBookingStatusBadge(booking.booking_status)}
                                            {getPaymentStatusBadge(booking.payment_status)}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex justify-end gap-0.5">
                                            <button
                                                onClick={() => handleDetailClick(booking)}
                                                title="Xem"
                                                className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handlePaymentClick(booking)}
                                                title="TT"
                                                className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded"
                                            >
                                                <DollarSign className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusClick(booking)}
                                                title="Status"
                                                className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(booking)}
                                                disabled={booking.payment_status === 'paid'}
                                                className="h-7 w-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                title="Xóa"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-2xl" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Chi tiết Booking</DialogTitle>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Mã Booking</p>
                                    <p className="font-semibold">{selectedBooking.booking_code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Người đặt</p>
                                    <p className="font-semibold">{selectedBooking.user?.full_name}</p>
                                    <p className="text-sm text-gray-500">{selectedBooking.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phim</p>
                                    <p className="font-semibold">{selectedBooking.showtime?.movie?.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rạp</p>
                                    <p className="font-semibold">{selectedBooking.showtime?.theater?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Suất chiếu</p>
                                    <p className="font-semibold">
                                        {selectedBooking.showtime && format(new Date(selectedBooking.showtime.showtime_date), 'dd/MM/yyyy')} {selectedBooking.showtime?.showtime_time}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng tiền</p>
                                    <p className="font-semibold text-red-600">{formatPrice(selectedBooking.total_price)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Danh sách ghế ({selectedBooking.total_seats} ghế)</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedBooking.seats?.map((seat) => (
                                        <Badge key={seat.id} variant="outline">
                                            {seat.seat_row}{seat.seat_number} ({seat.seat_type})
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Trạng thái</p>
                                    <p>{getBookingStatusBadge(selectedBooking.booking_status)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Thanh toán</p>
                                    <p>{getPaymentStatusBadge(selectedBooking.payment_status)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phương thức</p>
                                    <p className="font-semibold">{selectedBooking.payment_method || 'Chưa chọn'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Ngày tạo</p>
                                    <p className="font-semibold">{formatDate(selectedBooking.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Status Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái thanh toán</DialogTitle>
                        <DialogDescription>
                            Booking: {selectedBooking?.booking_code}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Trạng thái thanh toán</label>
                            <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                                    <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Phương thức thanh toán</label>
                            <Select value={newPaymentMethod} onValueChange={setNewPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn phương thức" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Tiền mặt</SelectItem>
                                    <SelectItem value="card">Thẻ</SelectItem>
                                    <SelectItem value="momo">MoMo</SelectItem>
                                    <SelectItem value="vnpay">VNPay</SelectItem>
                                    <SelectItem value="zalopay">ZaloPay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handlePaymentSubmit} className="bg-red-600 hover:bg-red-700">
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Booking Status Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái booking</DialogTitle>
                        <DialogDescription>
                            Booking: {selectedBooking?.booking_code}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <label className="text-sm font-medium">Trạng thái booking</label>
                        <Select value={newBookingStatus} onValueChange={setNewBookingStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleStatusSubmit} className="bg-red-600 hover:bg-red-700">
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa booking</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa booking <strong>{selectedBooking?.booking_code}</strong>?
                            <br />
                            <span className="text-red-600">Hành động này không thể hoàn tác!</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Lỗi</DialogTitle>
                        <DialogDescription>{errorDialog.message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setErrorDialog({ open: false, message: '' })}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={successDialog.open} onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Thành công</DialogTitle>
                        <DialogDescription>{successDialog.message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setSuccessDialog({ open: false, message: '' })}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
