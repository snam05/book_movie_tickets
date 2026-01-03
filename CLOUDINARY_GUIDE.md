# Hướng dẫn sử dụng Cloudinary trong dự án

## Tổng quan
Dự án đã được tích hợp **Cloudinary** để quản lý và lưu trữ hình ảnh poster phim trên cloud. Điều này giúp:
- Tối ưu hóa hiệu suất (tự động resize, compress, format conversion)
- Dễ dàng quản lý và backup
- Không cần lưu trữ file ảnh trên server
- CDN tự động cho tốc độ tải nhanh

---

## 1. Cấu hình Cloudinary

### Bước 1: Đăng ký tài khoản Cloudinary
1. Truy cập [cloudinary.com](https://cloudinary.com/) và đăng ký tài khoản miễn phí
2. Sau khi đăng nhập, vào **Dashboard** để lấy thông tin:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Bước 2: Cập nhật file `.env`
Mở file `backend/.env` và cập nhật các giá trị sau:

```env
# =============================================
# CẤU HÌNH CLOUDINARY
# =============================================
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_FOLDER=movie_posters
```

**Lưu ý:** Thay `your_cloud_name_here`, `your_api_key_here`, `your_api_secret_here` bằng thông tin thực tế từ Cloudinary Dashboard.

---

## 2. Cấu trúc API

### API Upload Poster (Admin only)
**Endpoint:** `POST /api/v1/upload/poster`

**Headers:**
```
Cookie: session_token=<your_session_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `poster`: File ảnh (JPEG, PNG, WebP, GIF - tối đa 5MB)

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Upload ảnh thành công",
  "data": {
    "url": "https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/movie_posters/abc123.jpg",
    "publicId": "movie_posters/abc123"
  }
}
```

### API Xóa Poster (Admin only)
**Endpoint:** `DELETE /api/v1/upload/poster`

**Headers:**
```
Cookie: session_token=<your_session_token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "url": "https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/movie_posters/abc123.jpg"
}
```
hoặc
```json
{
  "publicId": "movie_posters/abc123"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Xóa ảnh thành công"
}
```

---

## 3. API quản lý phim (Movie CRUD)

### Tạo phim mới (Admin only)
**Endpoint:** `POST /api/v1/movies`

**Headers:**
```
Cookie: session_token=<your_session_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `poster`: File ảnh poster (optional)
- `title`: Tên phim (required)
- `duration`: Thời lượng phim (phút) (required)
- `description`: Mô tả phim
- `release_date`: Ngày phát hành (YYYY-MM-DD)
- `director`: Đạo diễn
- `actors`: Diễn viên
- `rating`: Đánh giá (0.0 - 10.0)
- `age_rating`: Phân loại độ tuổi (P, K, T13, T16, T18, C)
- `status`: Trạng thái (coming_soon, now_showing, ended)
- `genres`: Array ID thể loại (ví dụ: [1, 3, 5])

**Response thành công (201):**
```json
{
  "message": "Tạo phim mới thành công",
  "data": {
    "id": 1,
    "title": "Movie Title",
    "poster_url": "https://res.cloudinary.com/.../movie_posters/xyz.jpg",
    "duration": 120,
    ...
  }
}
```

### Cập nhật phim (Admin only)
**Endpoint:** `PUT /api/v1/movies/:id`

**Headers:**
```
Cookie: session_token=<your_session_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Tương tự như tạo phim, nhưng tất cả các trường đều optional
- Nếu upload `poster` mới, poster cũ sẽ tự động bị xóa từ Cloudinary

### Xóa phim (Admin only)
**Endpoint:** `DELETE /api/v1/movies/:id`

**Headers:**
```
Cookie: session_token=<your_session_token>
```

**Response thành công (200):**
```json
{
  "message": "Xóa phim thành công"
}
```

**Lưu ý:** Khi xóa phim, poster sẽ tự động bị xóa khỏi Cloudinary.

---

## 4. Ví dụ sử dụng với Postman/cURL

### Upload poster riêng lẻ
```bash
curl -X POST http://localhost:8080/api/v1/upload/poster \
  -H "Cookie: session_token=your_token" \
  -F "poster=@/path/to/image.jpg"
```

### Tạo phim mới kèm poster
```bash
curl -X POST http://localhost:8080/api/v1/movies \
  -H "Cookie: session_token=your_token" \
  -F "poster=@/path/to/poster.jpg" \
  -F "title=Avengers: Endgame" \
  -F "duration=181" \
  -F "description=Epic Marvel movie" \
  -F "release_date=2019-04-26" \
  -F "director=Anthony Russo, Joe Russo" \
  -F "status=now_showing" \
  -F "genres=[1,2,3]"
```

### Cập nhật poster của phim
```bash
curl -X PUT http://localhost:8080/api/v1/movies/1 \
  -H "Cookie: session_token=your_token" \
  -F "poster=@/path/to/new_poster.jpg"
```

---

## 5. Tối ưu hóa ảnh tự động

Cloudinary đã được cấu hình để tự động:
- **Resize**: Giới hạn kích thước tối đa 800x1200px
- **Quality**: Tự động điều chỉnh chất lượng tốt nhất
- **Format**: Chuyển đổi sang định dạng tối ưu (WebP cho trình duyệt hỗ trợ)

Bạn có thể tùy chỉnh trong file `backend/services/cloudinary.service.js`:

```javascript
transformation: [
    { width: 800, height: 1200, crop: 'limit' },
    { quality: 'auto:good' },
    { fetch_format: 'auto' }
]
```

---

## 6. Lưu ý quan trọng

### Bảo mật
- ✅ Chỉ Admin mới được phép upload/delete ảnh
- ✅ File size giới hạn 5MB
- ✅ Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)
- ✅ Credentials (API Key, Secret) được lưu trong `.env`, không commit lên Git

### Quản lý ảnh
- Khi xóa phim, poster sẽ tự động bị xóa khỏi Cloudinary
- Khi cập nhật poster, poster cũ sẽ tự động bị xóa
- Tất cả poster được lưu trong folder `movie_posters` trên Cloudinary

### Frontend
- Next.js đã được cấu hình để cho phép hiển thị ảnh từ `res.cloudinary.com`
- Ảnh từ Cloudinary sẽ tự động tối ưu khi load

---

## 7. Troubleshooting

### Lỗi "Upload failed"
- Kiểm tra `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` trong `.env`
- Đảm bảo file ảnh không quá 5MB
- Kiểm tra format file (chỉ chấp nhận JPEG, PNG, WebP, GIF)

### Ảnh không hiển thị trên frontend
- Kiểm tra `next.config.ts` đã thêm `res.cloudinary.com` vào `remotePatterns`
- Restart frontend: `npm run dev`

### Lỗi "Unauthorized" khi upload
- Đảm bảo đã đăng nhập và có session_token
- Kiểm tra user có role `admin`

---

## 8. File cấu trúc liên quan

```
backend/
├── cloudinary.config.js          # Cấu hình Cloudinary
├── services/
│   └── cloudinary.service.js     # Upload/Delete ảnh
├── middleware/
│   └── upload.middleware.js      # Multer config
├── controllers/
│   ├── upload.controller.js      # Upload/Delete API
│   └── movie.controller.js       # CRUD phim với poster
├── routes/
│   ├── upload.routes.js          # Routes upload
│   └── movie.routes.js           # Routes movie (với poster)
└── .env                          # Credentials

frontend/
└── next.config.ts                # Config cho Cloudinary domain
```

---

**Chúc bạn triển khai thành công! 🎬✨**
