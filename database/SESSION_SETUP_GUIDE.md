# Hướng dẫn cài đặt và sử dụng hệ thống Session

## 1. Cài đặt Database

Chạy file SQL để tạo bảng sessions:

```bash
mysql -u root -p BlueMoon < database/scripts/create_sessions_table.sql
```

Hoặc chạy từng câu lệnh trong MySQL Workbench hoặc phpMyAdmin.

## 2. Cài đặt package cookie-parser

Trong thư mục `backend`, chạy lệnh:

```bash
npm install
```

Lệnh này sẽ cài đặt `cookie-parser` và các dependencies khác.

## 3. Các thay đổi chính

### Backend:

1. **Model mới**: `Session.model.js` - Quản lý phiên đăng nhập
2. **Service mới**: `session.service.js` - Xử lý logic session
3. **Cập nhật**:
   - `auth.service.js`: Tạo session khi đăng nhập
   - `auth.controller.js`: Xử lý cookie, thêm endpoint logout
   - `auth.middleware.js`: Xác thực session từ cookie (ưu tiên) hoặc JWT (fallback)
   - `auth.routes.js`: Thêm route `/logout`
   - `index.js`: Thêm cookie-parser middleware và cấu hình CORS cho cookie

### Database:

1. **Bảng sessions**: Lưu thông tin phiên đăng nhập
2. **Trigger**: Tự động xóa session cũ khi tạo mới (đảm bảo 1 tài khoản chỉ đăng nhập 1 nơi)
3. **Stored Procedure**: Dọn dẹp session hết hạn
4. **Event**: Tự động chạy cleanup hàng ngày lúc 2:00 sáng

## 4. Cách hoạt động

### Đăng nhập:
1. User gửi email và password đến `/api/v1/auth/login`
2. Backend xác thực thông tin
3. Tạo session mới trong database (tự động xóa session cũ nếu có)
4. Trả về cookie `session_token` (httpOnly, secure trong production)
5. Trả về JWT token (để backward compatibility)

### Xác thực:
1. Middleware kiểm tra cookie `session_token` trước
2. Nếu có và hợp lệ → cho phép truy cập
3. Nếu không có cookie → kiểm tra JWT token trong header
4. Cập nhật `last_activity` mỗi lần request

### Đăng xuất:
1. User gọi `/api/v1/auth/logout`
2. Backend xóa session trong database
3. Xóa cookie `session_token`

## 5. Bảo mật

- **httpOnly cookie**: JavaScript không thể truy cập, chống XSS
- **secure flag**: Chỉ gửi qua HTTPS trong production
- **sameSite**: Chống CSRF attack
- **1 session/user**: Không thể đăng nhập nhiều nơi cùng lúc
- **Auto cleanup**: Tự động xóa session hết hạn

## 6. Testing

### Test đăng nhập:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","matKhau":"password123"}' \
  -c cookies.txt
```

### Test với cookie:
```bash
curl -X GET http://localhost:8080/api/v1/auth/verify \
  -b cookies.txt
```

### Test đăng xuất:
```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -b cookies.txt
```

## 7. Frontend Integration

Trong frontend (Next.js), bạn cần:

1. Cấu hình axios để gửi cookie:
```typescript
axios.defaults.withCredentials = true;
```

2. Đăng nhập:
```typescript
const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
  email: 'test@example.com',
  matKhau: 'password123'
}, {
  withCredentials: true // Cho phép nhận cookie
});
```

3. Request có xác thực:
```typescript
const response = await axios.get('http://localhost:8080/api/v1/auth/verify', {
  withCredentials: true // Tự động gửi cookie
});
```

4. Đăng xuất:
```typescript
await axios.post('http://localhost:8080/api/v1/auth/logout', {}, {
  withCredentials: true
});
```

## 8. Environment Variables

Đảm bảo có các biến môi trường sau trong file `.env`:

```
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
PORT=8080
```

## 9. Lưu ý

- Trong development, cookie sẽ hoạt động qua HTTP
- Trong production, cần cấu hình HTTPS để `secure` flag hoạt động
- Frontend và Backend cần cùng domain hoặc cấu hình CORS đúng để cookie hoạt động
- Session mặc định hết hạn sau 7 ngày, có thể thay đổi trong `session.service.js`
