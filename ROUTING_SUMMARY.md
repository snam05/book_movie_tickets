# Tổng Kết Routing Logic

## Backend Routes (API v1)

### ✅ Auth Routes (`/api/v1/auth`)
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `GET /verify` - Xác thực session (⚠️ Cần đăng nhập)
- `PUT /update-profile` - Cập nhật thông tin user (⚠️ Cần đăng nhập)

### ✅ Movie Routes (`/api/v1/movies`)
- `GET /` - Lấy danh sách phim (filter, sort, pagination)
- `GET /now-showing` - Phim đang chiếu
- `GET /coming-soon` - Phim sắp chiếu
- `GET /:id` - Chi tiết phim
- `POST /` - Tạo phim mới (⚠️ Cần đăng nhập, upload poster)
- `PUT /:id` - Cập nhật phim (⚠️ Cần đăng nhập, upload poster)
- `DELETE /:id` - Xóa phim (⚠️ Cần đăng nhập)

### ✅ Showtime Routes (`/api/v1/showtimes`)
- `GET /:id` - Chi tiết suất chiếu (bao gồm movie + theater)

### ✅ Upload Routes (`/api/v1/upload`)
- `POST /poster` - Upload poster lên Cloudinary (⚠️ Cần đăng nhập)
- `DELETE /poster` - Xóa poster từ Cloudinary (⚠️ Cần đăng nhập)

### ✅ Booking Routes (`/api/v1/bookings`) - **MỚI**
- `GET /` - Lấy tất cả bookings của user (⚠️ Cần đăng nhập)
- `GET /:id` - Chi tiết booking (⚠️ Cần đăng nhập)
- `PUT /:id/cancel` - Hủy booking (⚠️ Cần đăng nhập)

---

## Frontend Routes

### Public Routes (Không cần đăng nhập)
- `/` - Trang chủ (danh sách phim)
- `/movie/[id]` - Chi tiết phim
- `/theaters` - Danh sách rạp (chưa tạo)
- `/news` - Tin tức (chưa tạo)

### Auth Routes (Redirect nếu đã đăng nhập)
- `/auth/signin` - Đăng nhập
- `/auth/signup` - Đăng ký

### Protected Routes (⚠️ Redirect về signin nếu chưa đăng nhập)
- `/profile` - Thông tin cá nhân
- `/my-bookings` - **MỚI** - Danh sách vé đã đặt
- `/booking/[id]` - Đặt vé cho suất chiếu
- `/checkout` - Thanh toán
- `/admin/*` - Admin pages (chưa tạo)

---

## Authentication Flow

### Session-Based Authentication
- Cookie name: `session_token`
- Backend verify: `/api/v1/auth/verify`
- Middleware: `verifyToken()` trong `auth.middleware.js`

### Frontend Protection
- **Middleware**: `frontend/middleware.ts`
  - Kiểm tra cookie `session_token`
  - Protected routes redirect về `/auth/signin`
  - Auth pages redirect về `/` nếu đã login
  
### Header Component
- Hiển thị avatar/username nếu đã đăng nhập
- Hiển thị nút Login/Register nếu chưa đăng nhập
- Sử dụng localStorage cache để tránh flicker
- useLayoutEffect + useSyncExternalStore để tránh hydration error

---

## ⚠️ Lưu Ý Bảo Mật

1. **Movie CRUD Routes** - Chưa có role check:
   - Hiện tại chỉ check đăng nhập (`verifyToken`)
   - Nên thêm `isAdmin` middleware để chỉ admin mới được CRUD phim

2. **Booking Routes** - Đã có user isolation:
   - Service check `user_id` để đảm bảo user chỉ xem/hủy booking của mình
   - Không thể xem/hủy booking của người khác

3. **Session Token** - Đang dùng httpOnly cookie:
   - Bảo mật tốt, không thể access từ JavaScript
   - Cần verify mỗi request qua backend

---

## 🎯 Đề Xuất Cải Tiến

1. **Admin Routes**
   - Tạo middleware `isAdmin` check `user.role === 'admin'`
   - Áp dụng cho movie CRUD, user management

2. **Booking Creation**
   - Chưa có API tạo booking mới
   - Cần thêm `POST /api/v1/bookings` để hoàn thiện flow đặt vé

3. **Payment Integration**
   - Checkout page chưa có logic thanh toán
   - Cần tích hợp VNPay/Momo/ZaloPay

4. **Real-time Seat Status**
   - WebSocket/SSE để sync trạng thái ghế real-time
   - Tránh 2 người đặt cùng ghế

5. **Error Handling**
   - Thêm global error handler
   - Unified response format
   - Better error messages for users
