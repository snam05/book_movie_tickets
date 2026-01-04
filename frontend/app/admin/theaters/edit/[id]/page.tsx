'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTheaterById, updateTheater, Theater, TheaterFormData } from '@/lib/api/theaters';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Upload, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function EditTheaterPage() {
  const router = useRouter();
  const params = useParams();
  const theaterId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<TheaterFormData>({
    name: '',
    total_seats: 0,
    theater_type: 'standard',
    status: 'active',
  });
  const [seatMapFile, setSeatMapFile] = useState<File | null>(null);
  const [seatMapData, setSeatMapData] = useState<any>(null);
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  useEffect(() => {
    loadTheater();
  }, [theaterId]);

  const loadTheater = async () => {
    try {
      setLoadingData(true);
      const theater = await getTheaterById(parseInt(theaterId));
      setFormData({
        name: theater.name,
        total_seats: theater.total_seats,
        theater_type: theater.theater_type,
        status: theater.status,
        seat_map: theater.seat_map,
      });
      // Nếu có seat_map, load vào state
      if (theater.seat_map) {
        setSeatMapData(theater.seat_map);
      }
    } catch (error) {
      console.error('Error loading theater:', error);
      setErrorDialog({ open: true, message: 'Lỗi khi tải thông tin rạp chiếu' });
      router.push('/admin/theaters');
    } finally {
      setLoadingData(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setJsonError('Vui lòng chọn file JSON');
      return;
    }

    setSeatMapFile(file);
    setJsonError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setSeatMapData(json);
        setFormData({ ...formData, seat_map: json });
        
        // Tự động tính tổng số ghế từ seat_map
        if (json.rows && Array.isArray(json.rows)) {
          const totalSeats = json.rows.reduce((sum: number, row: any) => {
            if (row.seats && Array.isArray(row.seats)) {
              return sum + row.seats.filter((seat: any) => seat.type !== 'empty').length;
            }
            return sum;
          }, 0);
          setFormData(prev => ({ ...prev, total_seats: totalSeats, seat_map: json }));
        }
      } catch (error) {
        setJsonError('File JSON không hợp lệ');
        setSeatMapData(null);
      }
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setSeatMapFile(null);
    setSeatMapData(null);
    setJsonError('');
    setFormData({ ...formData, seat_map: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.total_seats <= 0) {
      setErrorDialog({ open: true, message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    try {
      setLoading(true);
      await updateTheater(parseInt(theaterId), formData);
      router.push('/admin/theaters');
    } catch (error: any) {
      console.error('Error updating theater:', error);
      setErrorDialog({ 
        open: true, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật rạp chiếu' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/theaters">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh Sửa Rạp Chiếu</h1>
        <p className="text-gray-600 mt-1">Cập nhật thông tin rạp chiếu</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Tên rạp */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên rạp <span className="text-red-600">*</span></Label>
          <Input
            id="name"
            type="text"
            placeholder="Ví dụ: Rạp 1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Loại rạp */}
        <div className="space-y-2">
          <Label htmlFor="theater_type">Loại rạp <span className="text-red-600">*</span></Label>
          <Select
            value={formData.theater_type}
            onValueChange={(value: any) => setFormData({ ...formData, theater_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại rạp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Thường</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="imax">IMAX</SelectItem>
              <SelectItem value="3d">3D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Số ghế */}
        <div className="space-y-2">
          <Label htmlFor="total_seats">Tổng số ghế <span className="text-red-600">*</span></Label>
          <div className="flex gap-2">
            <Input
              id="total_seats"
              type="number"
              min="1"
              placeholder="Tự động tính từ file JSON"
              value={formData.total_seats || ''}
              onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) || 0 })}
              readOnly={!!seatMapData}
              required
              className="flex-1"
            />
            {seatMapData && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('seatMapData:', seatMapData);
                  let totalSeats = 0;
                  
                  // Cách 1: Nếu có layout (array of arrays)
                  if (seatMapData.layout && Array.isArray(seatMapData.layout)) {
                    totalSeats = seatMapData.layout.reduce((sum: number, row: any[]) => {
                      if (Array.isArray(row)) {
                        return sum + row.filter((seat: any) => seat && seat.type !== 'empty').length;
                      }
                      return sum;
                    }, 0);
                  }
                  // Cách 2: Nếu có rows với seats (định dạng cũ)
                  else if (seatMapData.rows && Array.isArray(seatMapData.rows)) {
                    totalSeats = seatMapData.rows.reduce((sum: number, row: any) => {
                      if (row.seats && Array.isArray(row.seats)) {
                        return sum + row.seats.filter((seat: any) => seat.type !== 'empty').length;
                      }
                      return sum;
                    }, 0);
                  }
                  
                  setFormData(prev => ({ ...prev, total_seats: totalSeats }));
                  console.log('Calculated total seats:', totalSeats);
                }}
                className="flex-shrink-0"
              >
                Tính
              </Button>
            )}
          </div>
          {seatMapData && (
            <p className="text-sm text-gray-500">
              {seatMapFile ? 'Đã tự động tính từ sơ đồ ghế mới' : 'Sử dụng sơ đồ ghế hiện tại'}
            </p>
          )}
        </div>

        {/* Upload seat map JSON */}
        <div className="space-y-2">
          <Label htmlFor="seat_map">
            Sơ đồ ghế (JSON) {!seatMapData && <span className="text-red-600">*</span>}
          </Label>
          <div className="space-y-2">
            {!seatMapFile && !seatMapData ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                <input
                  id="seat_map"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="seat_map" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click để chọn file JSON
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    File JSON chứa cấu trúc sơ đồ ghế
                  </p>
                </label>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-100 rounded p-2">
                      <Upload className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {seatMapFile ? seatMapFile.name : 'Sơ đồ ghế hiện tại'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {seatMapFile ? `${(seatMapFile.size / 1024).toFixed(2)} KB` : 'Đã lưu trong database'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {seatMapData && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {seatMapFile && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {!seatMapFile && seatMapData && (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="replace-file"
                        />
                        <label htmlFor="replace-file">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById('replace-file')?.click()}
                          >
                            Thay đổi
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {showPreview && seatMapData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Xem trước:</p>
                    <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded border">
                      {JSON.stringify(seatMapData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            {jsonError && (
              <p className="text-sm text-red-600">{jsonError}</p>
            )}
          </div>
          
          {/* Example format */}
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
              Xem ví dụ format JSON hoàn chỉnh
            </summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded border text-xs overflow-auto max-h-96">
{`{
  "rows": ["A", "B", "C", "D", "E", "F"],
  "seatsPerRow": 10,
  "layout": [
    [
      { "id": "A1", "row": "A", "number": 1, "type": "standard" },
      { "id": "A2", "row": "A", "number": 2, "type": "standard" },
      { "id": "A3", "row": "A", "number": 3, "type": "standard" },
      { "id": "A4", "row": "A", "number": 4, "type": "standard" },
      { "id": "A5", "row": "A", "number": 5, "type": "standard" },
      { "id": "A6", "row": "A", "number": 6, "type": "standard" },
      { "id": "A7", "row": "A", "number": 7, "type": "standard" },
      { "id": "A8", "row": "A", "number": 8, "type": "standard" },
      { "id": "A9", "row": "A", "number": 9, "type": "standard" },
      { "id": "A10", "row": "A", "number": 10, "type": "standard" }
    ],
    [
      { "id": "B1", "row": "B", "number": 1, "type": "standard" },
      { "id": "B2", "row": "B", "number": 2, "type": "standard" },
      { "id": "B3", "row": "B", "number": 3, "type": "standard" },
      { "id": "B4", "row": "B", "number": 4, "type": "standard" },
      { "id": "B5", "row": "B", "number": 5, "type": "standard" },
      { "id": "B6", "row": "B", "number": 6, "type": "standard" },
      { "id": "B7", "row": "B", "number": 7, "type": "standard" },
      { "id": "B8", "row": "B", "number": 8, "type": "standard" },
      { "id": "B9", "row": "B", "number": 9, "type": "standard" },
      { "id": "B10", "row": "B", "number": 10, "type": "standard" }
    ],
    [
      { "id": "C1", "row": "C", "number": 1, "type": "standard" },
      { "id": "C2", "row": "C", "number": 2, "type": "standard" },
      { "id": "C3", "row": "C", "number": 3, "type": "standard" },
      { "id": "C4", "row": "C", "number": 4, "type": "standard" },
      { "id": "C5", "row": "C", "number": 5, "type": "standard" },
      { "id": "C6", "row": "C", "number": 6, "type": "standard" },
      { "id": "C7", "row": "C", "number": 7, "type": "standard" },
      { "id": "C8", "row": "C", "number": 8, "type": "standard" },
      { "id": "C9", "row": "C", "number": 9, "type": "standard" },
      { "id": "C10", "row": "C", "number": 10, "type": "standard" }
    ],
    [
      { "id": "D1", "row": "D", "number": 1, "type": "standard" },
      { "id": "D2", "row": "D", "number": 2, "type": "standard" },
      { "id": "D3", "row": "D", "number": 3, "type": "standard" },
      { "id": "D4", "row": "D", "number": 4, "type": "standard" },
      { "id": "D5", "row": "D", "number": 5, "type": "standard" },
      { "id": "D6", "row": "D", "number": 6, "type": "standard" },
      { "id": "D7", "row": "D", "number": 7, "type": "standard" },
      { "id": "D8", "row": "D", "number": 8, "type": "standard" },
      { "id": "D9", "row": "D", "number": 9, "type": "standard" },
      { "id": "D10", "row": "D", "number": 10, "type": "standard" }
    ],
    [
      { "id": "E1", "row": "E", "number": 1, "type": "vip" },
      { "id": "E2", "row": "E", "number": 2, "type": "vip" },
      { "id": "E3", "row": "E", "number": 3, "type": "vip" },
      { "id": "E4", "row": "E", "number": 4, "type": "vip" },
      { "id": "E5", "row": "E", "number": 5, "type": "vip" },
      { "id": "E6", "row": "E", "number": 6, "type": "vip" },
      { "id": "E7", "row": "E", "number": 7, "type": "vip" },
      { "id": "E8", "row": "E", "number": 8, "type": "vip" },
      { "id": "E9", "row": "E", "number": 9, "type": "vip" },
      { "id": "E10", "row": "E", "number": 10, "type": "vip" }
    ],
    [
      { "id": "F1", "row": "F", "number": 1, "type": "couple" },
      { "id": "F2", "row": "F", "number": 2, "type": "couple" },
      { "id": "F3", "row": "F", "number": 3, "type": "couple" },
      { "id": "F4", "row": "F", "number": 4, "type": "couple" },
      { "id": "F5", "row": "F", "number": 5, "type": "couple" }
    ]
  ],
  "pricing": {
    "standard": 1.0,
    "vip": 1.5,
    "couple": 2.0
  },
  "metadata": {
    "screen": "front",
    "aisles": [3, 7],
    "wheelchairAccessible": ["A1", "A10"]
  }
}`}
            </pre>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
              <p className="font-semibold mb-2">📋 Hướng dẫn:</p>
              <ul className="space-y-1">
                <li><strong>rows:</strong> Mảng các hàng ghế (A, B, C, ...)</li>
                <li><strong>layout:</strong> Mảng 2D, mỗi phần tử là một hàng ghế với danh sách ghế</li>
                <li><strong>id:</strong> Định danh ghế duy nhất (ROW + NUMBER, VD: A1, B5, F3)</li>
                <li><strong>type:</strong> standard (chuẩn), vip (cao cấp), couple (couple)</li>
                <li><strong>pricing:</strong> Hệ số giá theo loại ghế (bội số của giá suất chiếu)</li>
                <li><strong>metadata:</strong> Thông tin bổ sung (vị trí màn hình, lối đi, ghế dành cho người khuyết tật)</li>
              </ul>
              <p className="mt-2 pt-2 border-t border-blue-200">
                <strong>💰 Ví dụ tính giá:</strong> Nếu suất chiếu giá 80.000đ:
                <br/>• Ghế standard: 80.000 × 1.0 = <strong>80.000đ</strong>
                <br/>• Ghế vip: 80.000 × 1.5 = <strong>120.000đ</strong>
                <br/>• Ghế couple: 80.000 × 2.0 = <strong>160.000đ</strong>
              </p>
            </div>
          </details>
        </div>

        {/* Trạng thái */}
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái <span className="text-red-600">*</span></Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/theaters')}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
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
      </Dialog>    </div>
  );
}
