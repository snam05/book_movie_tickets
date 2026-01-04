# Cập Nhật Logic Trạng Thái Lịch Chiếu

## Tổng quan
Hệ thống trạng thái lịch chiếu đã được cập nhật để tính toán động dựa trên thời gian chiếu thực tế.

## Thay đổi Database

### Cột `status` trong bảng `showtimes`
**Trước:**
```sql
ENUM('scheduled', 'showing', 'finished', 'cancelled')
```

**Sau:**
```sql
ENUM('normal', 'canceled')
```

### Logic trạng thái mới

#### 1. Trạng thái Database (status column)
- `normal`: Lịch chiếu bình thường
- `canceled`: Lịch chiếu đã bị hủy (đánh dấu thủ công)

#### 2. Trạng thái hiển thị (display_status - tính động)
Backend tự động tính toán dựa trên thời gian:

```javascript
const now = new Date();
const showtimeDateTime = new Date(`${showtime_date} ${showtime_time}`);
const showtimeEndTime = showtimeDateTime + movie.duration (minutes);

if (status === 'canceled') {
    return 'canceled';  // Đã hủy
}
else if (now < showtimeDateTime) {
    return 'scheduled'; // Lên lịch (chưa chiếu)
}
else if (now >= showtimeDateTime && now <= showtimeEndTime) {
    return 'showing';   // Đang chiếu
}
else {
    return 'completed'; // Đã kết thúc
}
```

## Thay đổi Backend

### 1. Model (Showtime.model.js)
```javascript
status: {
    type: DataTypes.ENUM('normal', 'canceled'),
    defaultValue: 'normal',
    field: 'status'
}
```

### 2. Service (showtime.service.js)

**Hàm mới: `calculateDynamicStatus(showtime)`**
- Tính trạng thái hiển thị dựa trên thời gian
- Sử dụng `movie.duration` để xác định thời điểm kết thúc

**Cập nhật các hàm:**
- `getAllShowtimes()`: Thêm field `display_status` cho mỗi showtime
- `getShowtimeById()`: Thêm field `display_status`
- `createShowtime()`: Mặc định status = 'normal'

## Thay đổi Frontend

### 1. Trang tạo lịch chiếu (create/page.tsx)
**Trước:** Dropdown select với 4 trạng thái
```tsx
<Select value={formData.status}>
  <SelectItem value="scheduled">Lên Lịch</SelectItem>
  <SelectItem value="showing">Đang Chiếu</SelectItem>
  <SelectItem value="finished">Đã Kết Thúc</SelectItem>
  <SelectItem value="cancelled">Đã Hủy</SelectItem>
</Select>
```

**Sau:** Checkbox "Đã hủy"
```tsx
<input
  type="checkbox"
  id="is_canceled"
  checked={isCanceled}
  onChange={(e) => setIsCanceled(e.target.checked)}
/>
<Label htmlFor="is_canceled">
  Đánh dấu lịch chiếu này là đã hủy
</Label>
```

### 2. Trang sửa lịch chiếu (edit/[id]/page.tsx)
- Tương tự trang tạo
- Load trạng thái hiện tại: `setIsCanceled(showtime.status === 'canceled')`
- Submit: `status: isCanceled ? 'canceled' : 'normal'`

### 3. Danh sách lịch chiếu (page.tsx)
**Cập nhật badge mapping:**
```tsx
const statusMap = {
  'scheduled': { label: 'Lên Lịch', className: 'bg-blue-500' },
  'showing': { label: 'Đang Chiếu', className: 'bg-green-500' },
  'completed': { label: 'Đã Kết Thúc', className: 'bg-gray-500' },
  'canceled': { label: 'Đã Hủy', className: 'bg-red-500' }
};
```

**Hiển thị:**
```tsx
getStatusBadge(showtime.display_status || showtime.status)
```

## Script Migration

**File:** `database/scripts/update_showtime_status.sql`

```sql
-- Bước 1: Cập nhật dữ liệu cũ
UPDATE showtimes 
SET status = CASE 
    WHEN status = 'cancelled' THEN 'canceled'
    ELSE 'normal'
END;

-- Bước 2: Thay đổi ENUM
ALTER TABLE showtimes 
MODIFY COLUMN status ENUM('normal', 'canceled') DEFAULT 'normal';
```

## Lợi ích

1. **Tự động hóa**: Không cần cập nhật thủ công trạng thái scheduled/showing/completed
2. **Chính xác**: Trạng thái phản ánh đúng thời gian thực tế
3. **Đơn giản hóa**: UI chỉ cần 1 checkbox thay vì 4 options
4. **Linh hoạt**: Admin chỉ quản lý việc hủy, hệ thống quản lý trạng thái tự động

## Hướng dẫn triển khai

1. Chạy migration script:
   ```bash
   mysql -u root -p book_movie_tickets < database/scripts/update_showtime_status.sql
   ```

2. Restart backend server để load model mới

3. Clear frontend build cache:
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

## Testing

### Test Cases
1. ✅ Tạo lịch chiếu mới không tick "Đã hủy" → status = 'normal', display_status = 'scheduled'
2. ✅ Tạo lịch chiếu với tick "Đã hủy" → status = 'canceled', display_status = 'canceled'
3. ✅ Lịch chiếu trước giờ chiếu → display_status = 'scheduled'
4. ✅ Lịch chiếu trong khoảng [giờ chiếu, giờ chiếu + duration] → display_status = 'showing'
5. ✅ Lịch chiếu sau khi hết duration → display_status = 'completed'
6. ✅ Sửa lịch chiếu và tick "Đã hủy" → status = 'canceled'
