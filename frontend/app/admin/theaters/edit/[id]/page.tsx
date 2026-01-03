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
      alert('Lỗi khi tải thông tin rạp chiếu');
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
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await updateTheater(parseInt(theaterId), formData);
      router.push('/admin/theaters');
    } catch (error: any) {
      console.error('Error updating theater:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật rạp chiếu');
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
            <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
              Xem ví dụ format JSON
            </summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded border text-xs overflow-auto">
{`{
  "rows": [
    {
      "row": "A",
      "seats": [
        { "seat": "A1", "type": "standard" },
        { "seat": "A2", "type": "standard" },
        { "seat": "A3", "type": "couple" },
        { "seat": "A4", "type": "couple" },
        { "seat": "A5", "type": "vip" },
        { "type": "empty" }
      ]
    },
    {
      "row": "B",
      "seats": [
        { "seat": "B1", "type": "standard" },
        { "seat": "B2", "type": "standard" }
      ]
    }
  ]
}`}
            </pre>
            <p className="mt-2 text-xs text-gray-500">
              • <strong>type</strong>: standard, vip, couple, empty<br />
              • <strong>empty</strong>: ô trống không có ghế
            </p>
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
    </div>
  );
}
