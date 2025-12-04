// frontend/components/movies/MovieFilter.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function MovieFilter() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white border-b border-gray-200">
      
      {/* Tabs (Bộ lọc Trạng thái Chính: Đang chiếu / Sắp chiếu) */}
      <div className="flex-grow">
        <Tabs defaultValue="now_showing" className="w-full sm:w-[400px]">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-0.5 h-auto">
            <TabsTrigger 
              value="now_showing" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
            >
              🍿 Phim Đang Chiếu
            </TabsTrigger>
            <TabsTrigger 
              value="coming_soon" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
            >
              🎬 Phim Sắp Chiếu
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bộ lọc Phụ (Lọc theo Thể loại) */}
      <div className="flex items-center space-x-3">
        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
        
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn Thể loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Thể loại</SelectItem>
            <SelectItem value="action">Hành Động</SelectItem>
            <SelectItem value="horror">Kinh Dị</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white font-semibold">
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}