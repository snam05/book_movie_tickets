# 📚 Hướng Dẫn Setup Database & Backend

## 🎯 Bước 1: Cài đặt Database

### 1.1. Import Database vào phpMyAdmin

1. Mở phpMyAdmin
2. Tạo database mới tên `book_movie_tickets` (hoặc sử dụng SQL):
```sql
CREATE DATABASE IF NOT EXISTS book_movie_tickets;
```

3. Import các file SQL theo thứ tự:
   - **Bước 1**: Import `database/scripts/create_table.sql` (tạo cấu trúc bảng)
   - **Bước 2**: Import `database/scripts/data_dumb.sql` (import dữ liệu mẫu)

### 1.2. Kiểm tra Database

Sau khi import, kiểm tra xem các bảng sau đã được tạo:
- ✅ users
- ✅ sessions
- ✅ genres
- ✅ movies
- ✅ movie_genres
- ✅ theaters
- ✅ showtimes
- ✅ bookings
- ✅ booked_seats

## 🎯 Bước 2: Cấu hình Backend

### 2.1. Cài đặt Dependencies

```bash
cd backend
npm install
```

### 2.2. Cấu hình Environment Variables

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Hoặc tạo file `.env` mới với nội dung:

```env
# Database Configuration
DB_NAME=book_movie_tickets
DB_USER=root
DB_PASS=
DB_HOST=localhost
DB_DIALECT=mysql
DB_PORT=3306

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_EXPIRES_HOURS=168
```

**Lưu ý**: 
- Thay đổi `DB_PASS` nếu MySQL của bạn có mật khẩu
- Thay đổi `JWT_SECRET` thành chuỗi ngẫu nhiên bảo mật cho production

### 2.3. Cấu trúc thư mục Backend

```
backend/
├── controllers/       # Xử lý HTTP requests
│   └── auth.controller.js
├── middleware/        # Middleware cho authentication
│   └── auth.middleware.js
├── models/           # Sequelize models (ORM)
│   ├── User.model.js
│   ├── Session.model.js
│   ├── Genre.model.js
│   ├── Movie.model.js
│   ├── MovieGenre.model.js
│   ├── Theater.model.js
│   ├── Showtime.model.js
│   ├── Booking.model.js
│   ├── BookedSeat.model.js
│   └── index.js
├── routes/           # API routes
│   └── auth.routes.js
├── services/         # Business logic
│   ├── auth.service.js
│   ├── session.service.js
│   └── user.service.js
├── db.config.js      # Database configuration
├── index.js          # Entry point
├── .env              # Environment variables (không commit)
└── package.json
```

## 🎯 Bước 3: Khởi động Backend

### 3.1. Development Mode (với nodemon)

```bash
npm run dev
```

### 3.2. Production Mode

```bash
npm start
```

Nếu kết nối thành công, bạn sẽ thấy:

```
✅ Kết nối MySQL (Sequelize) thành công! Host: localhost, Database: book_movie_tickets
✅ Kết nối CSDL thành công!
🚀 Server đang chạy trên cổng 8080
🌐 Truy cập: http://localhost:8080
```

## 🎯 Bước 4: Test API

### 4.1. Kiểm tra Server

```bash
curl http://localhost:8080
```

Hoặc mở trình duyệt: http://localhost:8080

Kết quả mong đợi:
```json
{
  "message": "Chào mừng đến với API V1!",
  "status": "Server đang chạy ổn định"
}
```

### 4.2. Test Đăng ký (Register)

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "matKhau": "password123",
    "full_name": "Nguyễn Văn Test",
    "cccd_number": "001234567999",
    "date_of_birth": "1995-01-01",
    "gender": "male"
  }'
```

### 4.3. Test Đăng nhập (Login)

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nguyenvana@gmail.com",
    "matKhau": "$2b$10$hashedpassword1"
  }'
```

**Lưu ý**: Mật khẩu trong database đã được hash. Để test, bạn cần:
1. Đăng ký tài khoản mới (API sẽ tự động hash)
2. Hoặc sử dụng tài khoản có sẵn và biết mật khẩu gốc

### 4.4. Test Verify Token

```bash
curl -X GET http://localhost:8080/api/v1/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔍 Troubleshooting

### Lỗi kết nối Database

**Lỗi**: `❌ Lỗi kết nối MySQL: Access denied`

**Giải pháp**:
- Kiểm tra lại `DB_USER` và `DB_PASS` trong file `.env`
- Đảm bảo MySQL service đang chạy
- Kiểm tra quyền truy cập của user MySQL

---

**Lỗi**: `❌ Lỗi kết nối MySQL: Unknown database 'book_movie_tickets'`

**Giải pháp**:
- Tạo database bằng lệnh: `CREATE DATABASE book_movie_tickets;`
- Hoặc import lại file `create_table.sql`

---

**Lỗi**: `ECONNREFUSED 127.0.0.1:3306`

**Giải pháp**:
- Kiểm tra MySQL service có đang chạy không
- Windows: Mở Services và start MySQL
- Hoặc khởi động XAMPP/WAMP/MAMP

### Lỗi Foreign Key

**Lỗi**: `Cannot add foreign key constraint`

**Giải pháp**:
- Đảm bảo import `create_table.sql` trước `data_dumb.sql`
- Drop database và import lại từ đầu:
```sql
DROP DATABASE book_movie_tickets;
CREATE DATABASE book_movie_tickets;
```

### Lỗi JWT

**Lỗi**: `jwt malformed` hoặc `invalid token`

**Giải pháp**:
- Đảm bảo đã set `JWT_SECRET` trong file `.env`
- Token phải được gửi trong header: `Authorization: Bearer YOUR_TOKEN`

## 📝 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/v1/auth/login` | Đăng nhập | ❌ |
| GET | `/api/v1/auth/verify` | Xác thực token | ✅ |
| PUT | `/api/v1/auth/profile` | Cập nhật profile | ✅ |
| POST | `/api/v1/auth/logout` | Đăng xuất | ✅ |

## 🎉 Hoàn thành!

Backend của bạn đã sẵn sàng! Tiếp theo bạn có thể:
1. ✅ Kết nối Frontend với Backend
2. ✅ Tạo thêm API endpoints cho Movies, Bookings, Showtimes
3. ✅ Implement payment gateway
4. ✅ Deploy lên server production
