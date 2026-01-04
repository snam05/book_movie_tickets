'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Ticket,
  Download,
  Filter
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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '@/lib/axios';

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
  tickets: number;
}

interface RevenueStats {
  totalRevenue: number;
  monthRevenue: number;
  todayRevenue: number;
  totalBookings: number;
  totalTickets: number;
  dailyData: RevenueData[];
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState<RevenueData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setDefaultDateRange();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadStatistics();
    }
  }, [startDate, endDate]);

  const setDefaultDateRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(format(startOfMonth, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch real data from API
      const response = await axios.get('/bookings/statistics/revenue', {
        params: {
          startDate,
          endDate
        }
      });

      if (response.data.success) {
        setStats(response.data.data);
        setFilteredData(response.data.data.dailyData);
        setCurrentPage(1);
      }
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadStatistics();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setDefaultDateRange();
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (!filteredData.length) return;

    const csv = [
      ['Ngày', 'Doanh thu (VND)', 'Số booking', 'Số vé'],
      ...filteredData.map(item => [
        item.date,
        item.revenue.toLocaleString('vi-VN'),
        item.bookings,
        item.tickets
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thong-ke-doanh-thu-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button 
          onClick={loadStatistics}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không thể tải dữ liệu thống kê</p>
      </div>
    );
  }

  const avgDailyRevenue = stats.dailyData.length > 0
    ? stats.monthRevenue / stats.dailyData.length
    : 0;

  // Format chart data
  const chartData = filteredData.map(item => ({
    date: format(new Date(item.date), 'dd/MM'),
    revenue: item.revenue,
    bookings: item.bookings,
    tickets: item.tickets
  }));

  // Format revenue for Y-axis
  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê Doanh thu</h1>
        <p className="text-gray-600 mt-2">Theo dõi doanh thu và hiệu suất bán vé</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Doanh thu Tổng cộng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(stats.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Doanh thu Kỳ này</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(stats.monthRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Doanh thu Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(stats.todayRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tổng Booking</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalBookings}
              </p>
            </div>
            <Ticket className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tổng Vé bán</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalTickets}
              </p>
            </div>
            <Ticket className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-blue-900 font-medium">Doanh thu trung bình/ngày</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {(avgDailyRevenue / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-sm text-green-900 font-medium">Vé trung bình/booking</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalBookings > 0 ? (stats.totalTickets / stats.totalBookings).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Lọc dữ liệu</h2>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-600 block mb-2">Từ ngày</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-600 block mb-2">Đến ngày</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 items-end">
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
            <Button 
              onClick={handleExport}
              variant="outline"
              disabled={loading || !filteredData.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <>
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ Doanh thu theo Ngày</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatRevenue} />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('vi-VN')}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ef4444" 
                  name="Doanh thu (VND)"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings and Tickets Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ Booking & Vé bán theo Ngày</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('vi-VN')}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#8b5cf6" name="Số Booking" />
                <Bar dataKey="tickets" fill="#06b6d4" name="Số Vé bán" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Combined Revenue and Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ Doanh thu vs Booking</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" tickFormatter={formatRevenue} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('vi-VN')}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ef4444" 
                  name="Doanh thu (VND)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#8b5cf6" 
                  name="Số Booking"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Chi tiết Doanh thu theo Ngày</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead className="text-right">Doanh thu (VND)</TableHead>
              <TableHead className="text-right">Số Booking</TableHead>
              <TableHead className="text-right">Số Vé bán</TableHead>
              <TableHead className="text-right">Doanh thu/Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Không có dữ liệu trong khoảng thời gian này
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.date}>
                  <TableCell className="font-medium">
                    {format(new Date(item.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">
                      {item.revenue.toLocaleString('vi-VN')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.bookings}</TableCell>
                  <TableCell className="text-right">{item.tickets}</TableCell>
                  <TableCell className="text-right">
                    {item.bookings > 0 ? (item.revenue / item.bookings).toLocaleString('vi-VN') : '0'}
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
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                  }
                }
              }}
              className="w-16 h-10"
            />
          </div>

          <div className="ml-4 text-sm text-gray-600">
            Trang {currentPage} của {totalPages} ({filteredData.length} tổng cộng)
          </div>
        </div>
      )}
    </div>
  );
}
