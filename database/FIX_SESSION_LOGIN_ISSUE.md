# Fix Session Login Issue - December 25, 2025

## 🐛 Vấn đề (Issue)

Hệ thống đăng nhập gặp lỗi khi mật khẩu đúng, dù có thể phát hiện được khi mật khẩu sai.

### Triệu chứng
- ❌ Đăng nhập với mật khẩu sai: Hoạt động bình thường (trả về lỗi đúng)
- ❌ Đăng nhập với mật khẩu đúng: Lỗi 500 Internal Server Error

### Thông báo lỗi
```
{
  message: 'Đã xảy ra lỗi bên trong máy chủ',
  error: 'Không thể tạo phiên đăng nhập'
}
```

### Lỗi chi tiết trong database
```
ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG
Can't update table 'sessions' in stored function/trigger because 
it is already used by statement which invoked this stored function/trigger
```

## 🔍 Nguyên nhân (Root Cause)

Trong file `database/scripts/create_table.sql`, có một trigger `before_session_insert` được tạo:

```sql
CREATE TRIGGER before_session_insert
BEFORE INSERT ON sessions
FOR EACH ROW
BEGIN
    DELETE FROM sessions WHERE user_id = NEW.user_id;
END$$
```

**Vấn đề:** MySQL không cho phép trigger thực hiện DELETE/UPDATE trên cùng một bảng mà nó đang xử lý (bảng `sessions`). Khi insert một session mới, trigger cố gắng DELETE các session cũ của cùng user, dẫn đến lỗi trên.

## ✅ Giải pháp (Solution)

### 1. Xóa trigger gây lỗi
```sql
DROP TRIGGER IF EXISTS before_session_insert;
```

### 2. Logic xóa session cũ đã có sẵn trong code
File `backend/services/session.service.js` đã có logic xử lý việc này:

```javascript
export const createSession = async (userId, ipAddress, userAgent, expiresInDays = 7) => {
    try {
        // Xóa tất cả session cũ của user (đảm bảo chỉ đăng nhập 1 nơi)
        await Session.destroy({ where: { user_id: userId } });
        
        // Tạo session token mới
        const sessionToken = generateSessionToken();
        // ... rest of code
    }
}
```

### 3. Scripts đã tạo để fix

#### `backend/check-and-drop-trigger.js`
Script để kiểm tra và xóa trigger:
```bash
node check-and-drop-trigger.js
```

#### `database/scripts/fix_session_trigger.sql`
File SQL để xóa trigger (nếu cần chạy trực tiếp trong MySQL):
```sql
DROP TRIGGER IF EXISTS before_session_insert;
```

## 🧪 Kiểm tra (Testing)

### Test 1: Kiểm tra session
```bash
cd backend
node test-db-sessions.js
```

**Kết quả mong đợi:**
```
✅ Kết nối database thành công!
✅ Bảng sessions tồn tại!
✅ Tạo session test thành công!
```

### Test 2: Kiểm tra đăng nhập
```bash
cd backend
node test-login.js
```

**Kết quả mong đợi:**
```
✅ Login successful!
Response: {
  message: 'Đăng nhập thành công!',
  data: { ... },
  token: '...'
}
```

## 📝 Files đã thay đổi

1. `database/scripts/create_table.sql` - Comment out trigger gây lỗi
2. `database/scripts/fix_session_trigger.sql` - Script SQL để fix
3. `backend/check-and-drop-trigger.js` - Script Node.js để xóa trigger
4. `backend/fix-session-trigger.js` - Script tự động fix
5. `backend/test-db-sessions.js` - Script test session

## 🎯 Kết quả

✅ Hệ thống đăng nhập hoạt động bình thường
✅ Session được tạo thành công
✅ Logic xóa session cũ hoạt động trong code, không cần trigger
✅ Không có lỗi khi đăng nhập với mật khẩu đúng

## 📚 Bài học (Lessons Learned)

1. **Tránh sử dụng trigger để modify chính bảng đang thao tác**: MySQL không cho phép điều này
2. **Ưu tiên xử lý logic trong application code**: Dễ debug, dễ maintain hơn trigger
3. **Test kỹ các trigger trước khi deploy**: Trigger có thể gây lỗi khó debug

## 🔗 Tham khảo (References)

- MySQL Error: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG
- MySQL Trigger Limitations: https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html
