'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Armchair, Crown, Star } from 'lucide-react';

interface Price {
  id: number;
  seatType: string;
  price: number;
  description: string;
  isActive: boolean;
}

const seatTypeConfig = {
  standard: {
    label: 'Ghế Thường',
    icon: Armchair,
    color: 'bg-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  premium: {
    label: 'Ghế Premium',
    icon: Star,
    color: 'bg-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  vip: {
    label: 'Ghế VIP',
    icon: Crown,
    color: 'bg-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/prices');
        setPrices(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải giá vé');
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Đang tải giá vé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng Giá Vé</h1>
          <p className="text-lg text-gray-600">
            Trải nghiệm xem phim đẳng cấp với mức giá hợp lý
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Price Cards Grid */}
        {prices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prices.map((price) => {
              const config = seatTypeConfig[price.seatType as keyof typeof seatTypeConfig];
              const Icon = config?.icon || Armchair;
              
              return (
                <Card
                  key={price.id}
                  className={`hover:shadow-xl transition-all duration-300 border-2 ${config?.borderColor || 'border-gray-200'} overflow-hidden`}
                >
                  {/* Header với icon */}
                  <CardHeader className={`${config?.bgColor || 'bg-gray-50'} p-6`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className={`${config?.color || 'bg-gray-500'} p-4 rounded-full`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <Badge className={`${config?.color || 'bg-gray-500'} w-full justify-center text-white hover:opacity-90`}>
                      {config?.label || price.seatType}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {price.price.toLocaleString('vi-VN')}₫
                      </div>
                      {price.description && (
                        <p className="text-gray-600 text-sm mt-2">{price.description}</p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="pt-4 border-t border-gray-200">
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Màn hình chiếu cao cấp
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Ghế ngồi thoải mái
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Âm thanh Dolby Digital
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">Không có giá vé nào</p>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin bổ sung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Chính sách giá</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Giá có thể thay đổi theo ngày và giờ chiếu</li>
                <li>• Áp dụng giảm giá cho nhóm từ 10 vé trở lên</li>
                <li>• Giá đã bao gồm thuế VAT</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Ưu đãi đặc biệt</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Giảm 10% cho học sinh, sinh viên</li>
                <li>• Giảm 15% cho người cao tuổi</li>
                <li>• Giảm 20% vào các ngày thứ Ba</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
