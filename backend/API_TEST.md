# 🧪 Test API Endpoints

## Base URL
```
http://localhost:8080/api/v1
```

## 1. Authentication APIs

### 1.1. Đăng ký (Register)
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "matKhau": "password123",
    "full_name": "Nguyễn Văn Mới",
    "cccd_number": "001234567990",
    "date_of_birth": "1995-06-15",
    "gender": "male"
  }'
```

### 1.2. Đăng nhập (Login)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nguyenvana@gmail.com",
    "matKhau": "password123"
  }'
```

### 1.3. Xác thực Token (Verify)
```bash
curl -X GET http://localhost:8080/api/v1/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 1.4. Cập nhật Profile
```bash
curl -X PUT http://localhost:8080/api/v1/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "full_name": "Nguyễn Văn A Updated",
    "date_of_birth": "1995-03-12"
  }'
```

### 1.5. Đăng xuất (Logout)
```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 2. Movie APIs

### 2.1. Lấy tất cả phim
```bash
curl http://localhost:8080/api/v1/movies
```

### 2.2. Lấy phim đang chiếu
```bash
curl http://localhost:8080/api/v1/movies/now-showing
```

### 2.3. Lấy phim sắp chiếu
```bash
curl http://localhost:8080/api/v1/movies/coming-soon
```

### 2.4. Lấy chi tiết phim theo ID
```bash
curl http://localhost:8080/api/v1/movies/1
```

### 2.5. Tìm kiếm phim
```bash
# Tìm theo tên
curl "http://localhost:8080/api/v1/movies?search=Avengers"

# Lọc theo trạng thái
curl "http://localhost:8080/api/v1/movies?status=now_showing"

# Lọc theo thể loại
curl "http://localhost:8080/api/v1/movies?genre=Hành động"

# Kết hợp nhiều filter
curl "http://localhost:8080/api/v1/movies?status=now_showing&limit=5"
```

## 3. Test với Browser hoặc Postman

### 3.1. Sử dụng trình duyệt
Mở trình duyệt và truy cập:
- http://localhost:8080/api/v1/movies
- http://localhost:8080/api/v1/movies/1
- http://localhost:8080/api/v1/movies/now-showing

### 3.2. Sử dụng Postman

#### Import Collection
1. Mở Postman
2. Tạo Collection mới: "Book Movie Tickets API"
3. Thêm các request theo template trên

#### Test Flow
1. **Đăng ký** → Lưu token
2. **Đăng nhập** → Cập nhật token mới
3. **Verify** → Test token có hoạt động không
4. **Get Movies** → Lấy danh sách phim
5. **Get Movie Detail** → Xem chi tiết phim có suất chiếu

## 4. Response Examples

### 4.1. Success Response (Register)
```json
{
  "message": "Đăng ký thành công!",
  "data": {
    "id": 11,
    "email": "newuser@example.com",
    "full_name": "Nguyễn Văn Mới",
    "member_code": "1234567890",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4.2. Success Response (Get Movies)
```json
{
  "message": "Lấy danh sách phim thành công",
  "data": [
    {
      "id": 1,
      "title": "Avengers: Endgame",
      "description": "Sau sự kiện tàn khốc...",
      "duration": 181,
      "rating": 8.4,
      "status": "now_showing",
      "genres": [
        { "id": 1, "name": "Hành động" },
        { "id": 5, "name": "Khoa học viễn tưởng" }
      ]
    }
  ],
  "count": 10
}
```

### 4.3. Success Response (Get Movie Detail)
```json
{
  "message": "Lấy chi tiết phim thành công",
  "data": {
    "id": 1,
    "title": "Avengers: Endgame",
    "description": "Sau sự kiện tàn khốc của Infinity War...",
    "duration": 181,
    "release_date": "2019-04-26",
    "poster_url": "/posters/avengers-endgame.jpg",
    "director": "Anthony Russo, Joe Russo",
    "actors": "Robert Downey Jr., Chris Evans...",
    "rating": 8.4,
    "age_rating": "T13",
    "status": "now_showing",
    "genres": [
      { "id": 1, "name": "Hành động" },
      { "id": 5, "name": "Khoa học viễn tưởng" }
    ],
    "showtimes": [
      {
        "id": 1,
        "showtime_date": "2025-12-24",
        "showtime_time": "10:00:00",
        "price": "80000.00",
        "available_seats": 120,
        "status": "scheduled",
        "theater": {
          "id": 1,
          "name": "Phòng 1 - Standard",
          "theater_type": "standard"
        }
      }
    ]
  }
}
```

### 4.4. Error Response
```json
{
  "message": "Email đã tồn tại trong hệ thống."
}
```

```json
{
  "message": "Không tìm thấy phim"
}
```

## 5. Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request thành công |
| 201 | Created - Tạo mới thành công (Register) |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa đăng nhập hoặc token không hợp lệ |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 500 | Internal Server Error - Lỗi server |
