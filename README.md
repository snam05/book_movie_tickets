# 🎬 Book Movie Tickets - Hệ Thống Đặt Vé Xem Phim

Ứng dụng web toàn diện để đặt vé xem phim trực tuyến với giao diện hiện đại, tính năng quản lý admin và hệ thống thanh toán an toàn.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt & Setup](#-cài-đặt--setup)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Troubleshooting](#-troubleshooting)

## ✨ Tính Năng

### Cho Người Dùng
- ✅ Xem danh sách phim và thông tin chi tiết
- ✅ Tìm kiếm phim theo thể loại
- ✅ Xem suất chiếu và chọn ghế
- ✅ Đặt vé và thanh toán trực tuyến
- ✅ Xem lịch sử đặt vé
- ✅ Cập nhật thông tin cá nhân
- ✅ Đăng ký và đăng nhập tài khoản
- ✅ Xem tin tức điện ảnh

### Cho Admin
- 🔐 Quản lý người dùng
- 📽️ Quản lý phim (thêm, sửa, xóa)
- 🎭 Quản lý rạp và suất chiếu
- 💰 Quản lý giá vé
- 📊 Xem thống kê đặt vé
- 📰 Quản lý tin tức
- 📸 Upload hình ảnh via Cloudinary

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Next.js 16** - Framework React hiện đại
- **React 19** - Thư viện UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **JavaScript Cookies** - Cookie management

### Backend
- **Node.js & Express 5** - API server
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **BCrypt** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image hosting
- **CORS** - Cross-origin requests

## 📦 Cài Đặt & Setup

### Yêu Cầu Hệ Thống
- Node.js v16+ hoặc v20+
- MySQL 5.7+
- npm hoặc yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd book_movie_tickets
```

### 2. Cài Đặt Database

#### 2.1 Tạo Database
```sql
CREATE DATABASE IF NOT EXISTS book_movie_tickets;
```

#### 2.2 Import SQL Files
Vào phpMyAdmin hoặc MySQL CLI và import theo thứ tự:
1. `database/scripts/create_table.sql` - Tạo cấu trúc bảng
2. `database/scripts/data_dumb.sql` - Import dữ liệu mẫu

```bash
# Hoặc sử dụng command line:
mysql -u root book_movie_tickets < database/scripts/create_table.sql
mysql -u root book_movie_tickets < database/scripts/data_dumb.sql
```

### 3. Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
# Hoặc tạo mới với:
```

#### Cấu hình `.env`
```env
# Database Configuration
DB_NAME=book_movie_tickets
DB_USER=root
DB_PASS=          # Để trống nếu không có password
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

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Lưu ý**: Thay đổi các giá trị theo cấu hình của bạn, đặc biệt là `JWT_SECRET` cho production.

#### Chạy Backend

```bash
# Development mode (tự động reload)
npm run dev

# Production mode
npm start

# Tạo tài khoản Admin
npm run create-admin
```

Backend sẽ chạy tại: `http://localhost:8080`

### 4. Setup Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm build

# Start production server
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 5. Chạy Cả Frontend & Backend Cùng Lúc

Từ thư mục gốc:
```bash
npm install

# Chạy cả frontend và backend
npm run dev
```

## 📂 Cấu Trúc Dự Án

```
book_movie_tickets/
├── backend/                          # Express API Server
│   ├── controllers/                  # Xử lý HTTP requests
│   │   ├── auth.controller.js
│   │   ├── movie.controller.js
│   │   ├── booking.controller.js
│   │   ├── showtime.controller.js
│   │   ├── theater.controller.js
│   │   ├── user.controller.js
│   │   ├── price.controller.js
│   │   ├── genre.controller.js
│   │   ├── news.controller.js
│   │   └── upload.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT authentication
│   │   ├── upload.middleware.js      # File upload
│   │   └── activity-logger.middleware.js
│   ├── models/                       # Sequelize ORM models
│   │   ├── User.model.js
│   │   ├── Movie.model.js
│   │   ├── Theater.model.js
│   │   ├── Showtime.model.js
│   │   ├── Booking.model.js
│   │   ├── BookedSeat.model.js
│   │   ├── Genre.model.js
│   │   ├── Price.model.js
│   │   ├── News.model.js
│   │   └── Session.model.js
│   ├── routes/                       # API routes
│   │   ├── auth.routes.js
│   │   ├── movie.routes.js
│   │   ├── booking.routes.js
│   │   └── ...
│   ├── services/                     # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── movie.service.js
│   │   ├── booking.service.js
│   │   ├── cloudinary.service.js
│   │   └── ...
│   ├── utils/
│   │   └── logger.js
│   ├── db.config.js                  # Database configuration
│   ├── index.js                      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # Next.js Frontend
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── auth/                     # Authentication pages
│   │   ├── booking/                  # Booking pages
│   │   ├── admin/                    # Admin dashboard
│   │   ├── movie/                    # Movie details
│   │   ├── my-bookings/              # User bookings
│   │   └── ...
│   ├── components/                   # Reusable React components
│   ├── lib/                          # Utilities & helpers
│   ├── types/                        # TypeScript types
│   ├── public/                       # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── scripts/
│       ├── create_table.sql          # Database schema
│       └── data_dumb.sql             # Sample data
│
└── package.json                      # Root package.json (monorepo)
```

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Đăng Ký
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Đăng Nhập
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Movies Endpoints

#### Lấy Danh Sách Phim
```http
GET /movies?genre=1&page=1&limit=10
```

#### Lấy Chi Tiết Phim
```http
GET /movies/:movieId
```

#### Tạo Phim (Admin)
```http
POST /movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Phim Mới",
  "description": "Mô tả",
  "releaseDate": "2025-01-05",
  "rating": 8.5,
  "posterUrl": "url",
  "genres": [1, 2]
}
```

### Booking Endpoints

#### Lấy Suất Chiếu
```http
GET /showtimes?movieId=1&theaterId=1&date=2025-01-15
```

#### Tạo Đơn Đặt Vé
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "showtimeId": 1,
  "seats": [
    { "seatNumber": "A1", "price": 100000 },
    { "seatNumber": "A2", "price": 100000 }
  ],
  "totalPrice": 200000
}
```

#### Lấy Lịch Sử Đặt Vé
```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

### Thêm Header Authorization
Tất cả các endpoint cần authentication phải có header:
```
Authorization: Bearer <your-jwt-token>
```

Xem chi tiết API tại: [API_TEST.md](backend/API_TEST.md)

## 🚀 Hướng Dẫn Sử Dụng

### Trang Người Dùng

1. **Trang Chủ** (`/`)
   - Xem danh sách phim mới nhất
   - Xem khuyến mại hiện tại

2. **Trang Phim** (`/movie/[id]`)
   - Xem thông tin chi tiết phim
   - Xem suất chiếu
   - Đặt vé

3. **Đặt Vé** (`/booking`)
   - Chọn phim, rạp, ngày chiếu
   - Chọn ghế
   - Thanh toán

4. **Đơn Của Tôi** (`/my-bookings`)
   - Xem lịch sử đặt vé
   - In vé
   - Hủy đặt vé

5. **Tài Khoản** (`/profile`)
   - Cập nhật thông tin cá nhân
   - Đổi mật khẩu
   - Xem lịch sử hoạt động

### Admin Dashboard

Truy cập: `http://localhost:3000/admin`

#### Quản Lý Phim
- Thêm phim mới
- Sửa thông tin phim
- Xóa phim
- Upload poster

#### Quản Lý Rạp
- Thêm rạp mới
- Quản lý ghế
- Xóa rạp

#### Quản Lý Suất Chiếu
- Tạo suất chiếu mới
- Cập nhật thời gian
- Xóa suất chiếu

#### Quản Lý Người Dùng
- Xem danh sách người dùng
- Kích hoạt/vô hiệu hóa tài khoản

#### Quản Lý Giá Vé
- Cấu hình giá vé
- Áp dụng giá khác nhau cho các rạp/thời gian

#### Thống Kê
- Xem doanh thu
- Xem tỷ lệ đặt vé
- Xem phim phổ biến

## 🔐 Bảo Mật

### JWT Authentication
- Token hết hạn sau 7 ngày
- Lưu token trong HttpOnly cookie
- Refresh token hỗ trợ (nếu có)

### Password
- Mã hóa với BCrypt
- Độ mạnh: 10+ rounds

### CORS
- Cho phép frontend access backend
- Cấu hình trong [backend/index.js](backend/index.js)

## 📝 Logging & Monitoring

### Activity Logger
Hệ thống ghi lại các hoạt động:
- Đăng nhập/Đăng xuất
- Tạo/Sửa/Xóa dữ liệu
- Lỗi hệ thống

Xem logs: `backend/logs/`

## ⚙️ Environment Variables

### Backend (`.env`)
```env
DB_NAME=book_movie_tickets
DB_USER=root
DB_PASS=
DB_HOST=localhost
DB_DIALECT=mysql
DB_PORT=3306
PORT=8080
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
SESSION_EXPIRES_HOURS=168
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Giải pháp:**
- Kiểm tra MySQL đang chạy
- Kiểm tra credentials trong `.env`
- Kiểm tra database tồn tại

### Port Already in Use
```
Error: listen EADDRINUSE :::8080
```
**Giải pháp:**
- Tìm process chạy trên port: `netstat -ano | findstr :8080` (Windows)
- Kill process: `taskkill /PID <PID> /F`
- Hoặc thay đổi PORT trong `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Giải pháp:**
- Kiểm tra CORS config trong backend
- Kiểm tra frontend URL có trong whitelist

### Import Module Error
```
Error: Cannot find module
```
**Giải pháp:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Expired
```
Error: jwt expired
```
**Giải pháp:**
- Đăng nhập lại
- Token tự động refresh (nếu có)

## 📊 Database Schema

### Users Table
```sql
users (id, username, email, password, created_at)
```

### Movies Table
```sql
movies (id, title, description, releaseDate, rating, posterUrl, created_at)
```

### Bookings Table
```sql
bookings (id, userId, showtimeId, totalPrice, status, created_at)
```

### BookedSeats Table
```sql
booked_seats (id, bookingId, seatNumber, price)
```

Xem chi tiết schema: [database/scripts/create_table.sql](database/scripts/create_table.sql)

## 📚 Tài Liệu Thêm

- [Login Fix Summary](LOGIN_FIX_SUMMARY.md) - Giải pháp fix issue login
- [Cloudinary Guide](CLOUDINARY_GUIDE.md) - Hướng dẫn upload ảnh
- [Setup Complete](SETUP_COMPLETE.md) - Checklist setup
- [Routing Summary](ROUTING_SUMMARY.md) - Tóm tắt routing
- [Changelog](CHANGELOG_SESSION.md) - Lịch sử thay đổi
- [Showtime Status Update](SHOWTIME_STATUS_UPDATE.md) - Cập nhật suất chiếu

## 🤝 Contribution

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - xem [LICENSE](LICENSE) để chi tiết

## 👤 Author

- **Tên**: Nam Pham
- **Email**: nampham.name@gmail.com
- **GitHub**: [@snam05](https://github.com/snam05)

**Cập nhật lần cuối**: January 5, 2026

Cảm ơn đã sử dụng Book Movie Tickets! 🎬🍿