'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllGenres, Genre } from '@/lib/api/genres';
import { createMovie } from '@/lib/api/movies';
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
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateMoviePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    release_date: '',
    trailer_url: '',
    director: '',
    actors: '',
    rating: '',
    age_rating: '13',
    status: 'coming_soon',
    genres: [] as number[]
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [genresLoading, setGenresLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const data = await getAllGenres();
      setGenres(data);
    } catch (error) {
      console.error('Error loading genres:', error);
      alert('Lỗi khi tải danh sách thể loại');
    } finally {
      setGenresLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPosterFile(null);
    setPosterPreview('');
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.duration) {
      alert('Vui lòng điền tất cả thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('duration', formData.duration);
      formDataObj.append('release_date', formData.release_date);
      formDataObj.append('trailer_url', formData.trailer_url);
      formDataObj.append('director', formData.director);
      formDataObj.append('actors', formData.actors);
      formDataObj.append('rating', formData.rating || '0');
      formDataObj.append('age_rating', formData.age_rating);
      formDataObj.append('status', formData.status);
      
      if (selectedGenres.length > 0) {
        formDataObj.append('genres', JSON.stringify(selectedGenres));
      }

      if (posterFile) {
        formDataObj.append('poster', posterFile);
      }

      await createMovie(formDataObj);

      router.push('/admin/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      let errorMessage = 'Lỗi khi tạo phim';
      if (error instanceof Error) {
        const axiosError = error as unknown as { response: { data: { message: string } } };
        errorMessage = axiosError?.response?.data?.message || error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/movies">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Thêm Phim Mới</h1>
        <p className="text-gray-600 mt-1">Tạo phim mới trong hệ thống</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Poster */}
          <div className="space-y-3">
            <Label>Poster Phim</Label>
            <div className="space-y-3">
              {posterPreview && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Poster sẽ được upload:</p>
                  <div className="relative inline-block">
                    <img 
                      src={posterPreview} 
                      alt="Preview"
                      className="h-48 w-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      title="Xóa ảnh"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click để chọn hoặc kéo thả ảnh</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF (tối đa 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tên Phim <span className="text-red-600">*</span></Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tên phim"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả phim"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Thời Lượng (phút) <span className="text-red-600">*</span></Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Nhập thời lượng"
              min="1"
              required
            />
          </div>

          {/* Release Date */}
          <div className="space-y-2">
            <Label htmlFor="release_date">Ngày Phát Hành</Label>
            <Input
              id="release_date"
              name="release_date"
              type="date"
              value={formData.release_date}
              onChange={handleInputChange}
            />
          </div>

          {/* Director */}
          <div className="space-y-2">
            <Label htmlFor="director">Đạo Diễn</Label>
            <Input
              id="director"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              placeholder="Nhập tên đạo diễn"
            />
          </div>

          {/* Actors */}
          <div className="space-y-2">
            <Label htmlFor="actors">Diễn Viên</Label>
            <Input
              id="actors"
              name="actors"
              value={formData.actors}
              onChange={handleInputChange}
              placeholder="Nhập tên diễn viên (cách nhau bằng dấu phẩy)"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Đánh Giá (0-10)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              max="10"
              step="0.1"
            />
          </div>

          {/* Age Rating */}
          <div className="space-y-2">
            <Label htmlFor="age_rating">Phân Loại Tuổi</Label>
            <Select value={formData.age_rating} onValueChange={(value) => handleSelectChange('age_rating', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6+</SelectItem>
                <SelectItem value="13">13+</SelectItem>
                <SelectItem value="16">16+</SelectItem>
                <SelectItem value="18">18+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng Thái</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coming_soon">Sắp Chiếu</SelectItem>
                <SelectItem value="now_showing">Đang Chiếu</SelectItem>
                <SelectItem value="ended">Đã Kết Thúc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trailer URL */}
          <div className="space-y-2">
            <Label htmlFor="trailer_url">Trailer URL</Label>
            <Input
              id="trailer_url"
              name="trailer_url"
              value={formData.trailer_url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/..."
            />
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label>Thể Loại</Label>
            {genresLoading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {genres.map(genre => (
                  <label key={genre.id} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-accent transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => toggleGenre(genre.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{genre.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/admin/movies" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang Tạo...
                </>
              ) : (
                'Tạo Phim'
              )}
            </Button>
          </div>
        </form>
    </div>
  );
}
