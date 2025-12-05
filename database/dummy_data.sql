INSERT INTO genres (name) VALUES
('Hành Động'), ('Kinh Dị'), ('Tâm Lý'), ('Giật Gân'), 
('Lãng Mạn'), ('Khoa Học Viễn Tưởng'), ('Hài Hước'), ('Phiêu Lưu'),
('Tội Phạm'), ('Gia Đình'), ('Hoạt Hình'), ('Tài Liệu');


INSERT INTO users (email, password_hash, full_name, cccd_number, date_of_birth, gender, member_code, role) VALUES
('nguyenvanh@example.com', 'hash_1', 'Nguyễn Văn Hưng', '001122334401', '1995-05-15', 'male', '0000000001', 'customer'),
('tranthithu@example.com', 'hash_2', 'Trần Thị Thu', '001122334402', '1998-11-20', 'female', '0000000002', 'customer'),
('admin@app.com', 'admin_hash', 'Quản Trị Viên', '999999999999', '1980-01-01', 'other', '0000000003', 'admin'),
('lephong@example.com', 'hash_4', 'Lê Văn Phong', '001122334404', '2000-03-08', 'male', '0000000004', 'customer'),
('phamhai@example.com', 'hash_5', 'Phạm Hải Yến', '001122334405', '1993-07-25', 'female', '0000000005', 'customer'),
('hoangnam@example.com', 'hash_6', 'Hoàng Nam', '001122334406', '1997-02-10', 'male', '0000000006', 'customer'),
('vuthu@example.com', 'hash_7', 'Vũ Thu Hà', '001122334407', '1996-09-01', 'female', '0000000007', 'customer'),
('mainam@example.com', 'hash_8', 'Mai Xuân Nam', '001122334408', '2001-04-12', 'male', '0000000008', 'customer'),
('doanhuong@example.com', 'hash_9', 'Đoàn Hương', '001122334409', '1994-06-30', 'female', '0000000009', 'customer'),
('nguyenquang@example.com', 'hash_10', 'Nguyễn Quang', '001122334410', '1999-12-19', 'male', '0000000010', 'customer'),
('tranthuy@example.com', 'hash_11', 'Trần Thúy', '001122334411', '1992-01-28', 'female', '0000000011', 'customer'),
('leanh@example.com', 'hash_12', 'Lê Văn Anh', '001122334412', '1990-10-05', 'male', '0000000012', 'customer'),
('ngohai@example.com', 'hash_13', 'Ngô Hải', '001122334413', '1988-08-17', 'male', '0000000013', 'customer'),
('dieuanh@example.com', 'hash_14', 'Diệu Anh', '001122334414', '1991-04-22', 'female', '0000000014', 'customer'),
('vantam@example.com', 'hash_15', 'Văn Tâm', '001122334415', '2003-01-01', 'male', '0000000015', 'customer'),
('thanhmai@example.com', 'hash_16', 'Thanh Mai', '001122334416', '1996-03-03', 'female', '0000000016', 'customer'),
('phuongnam@example.com', 'hash_17', 'Phương Nam', '001122334417', '1994-07-07', 'other', '0000000017', 'customer'),
('kimanh@example.com', 'hash_18', 'Kim Anh', '001122334418', '2002-11-11', 'female', '0000000018', 'customer'),
('duclong@example.com', 'hash_19', 'Đức Long', '001122334419', '1993-10-25', 'male', '0000000019', 'customer'),
('linhnga@example.com', 'hash_20', 'Linh Nga', '001122334420', '1997-08-08', 'female', '0000000020', 'customer');


INSERT INTO theaters (name, capacity) VALUES
('Phòng 1 (2D Thường)', 100), ('Phòng 2 (3D VIP)', 80), ('Phòng 3 (IMAX)', 150), ('Phòng 4 (SweetBox)', 60),
('Phòng 5 (2D Thường)', 100), ('Phòng 6 (3D VIP)', 80), ('Phòng 7 (IMAX)', 150), ('Phòng 8 (SweetBox)', 60),
('Phòng 9 (2D Thường)', 100), ('Phòng 10 (3D VIP)', 80), ('Phòng 11 (2D Thường)', 100), ('Phòng 12 (3D VIP)', 80),
('Phòng 13 (IMAX)', 150), ('Phòng 14 (SweetBox)', 60), ('Phòng 15 (2D Thường)', 100), ('Phòng 16 (3D VIP)', 80),
('Phòng 17 (IMAX)', 150), ('Phòng 18 (SweetBox)', 60), ('Phòng 19 (2D Thường)', 100), ('Phòng 20 (3D VIP)', 80);


INSERT INTO movies (title, description, duration, rating, poster_url, release_date, director, actors) VALUES
('Vùng Đất Quỷ Dữ', 'Phim hành động kinh dị về virus bí ẩn.', 115, 7.8, '/p/1.jpg', '2025-01-01', 'Đạo Diễn A', 'Diễn Viên X, Y, Z'), -- ID 1
('Chuyến Tàu Định Mệnh', 'Một chuyến tàu kỳ lạ bắt đầu hành trình không lối thoát.', 140, 8.5, '/p/2.jpg', '2024-12-15', 'Đạo Diễn B', 'Diễn Viên M, N'), -- ID 2
('Tình Yêu Sao Băng', 'Phim lãng mạn khoa học viễn tưởng.', 105, 7.2, '/p/3.jpg', '2025-02-14', 'Đạo Diễn C', 'Diễn Viên P, Q'), -- ID 3
('Bí Mật Rừng Sâu', 'Phim phiêu lưu thám hiểm.', 95, 6.9, '/p/4.jpg', '2025-03-20', 'Đạo Diễn D', 'Diễn Viên R, S'), -- ID 4
('Thợ Săn Thành Phố', 'Phim hành động truy đuổi.', 130, 8.1, '/p/5.jpg', '2025-04-10', 'Đạo Diễn E', 'Diễn Viên T, U'), -- ID 5
('Kẻ Nổi Loạn', 'Phim tâm lý tội phạm.', 120, 8.3, '/p/6.jpg', '2025-05-05', 'Đạo Diễn F', 'Diễn Viên V, W'), -- ID 6
('Ánh Sáng Cuối Đường', 'Phim chiến tranh lịch sử.', 160, 9.0, '/p/7.jpg', '2025-06-01', 'Đạo Diễn G', 'Diễn Viên H, I'), -- ID 7
('Lưới Tình', 'Phim chính kịch gia đình.', 110, 7.5, '/p/8.jpg', '2025-07-15', 'Đạo Diễn H', 'Diễn Viên J, K'), -- ID 8
('Mặt Nạ Đỏ', 'Phim kinh dị giật gân.', 90, 6.5, '/p/9.jpg', '2025-08-30', 'Đạo Diễn I', 'Diễn Viên L, M'), -- ID 9
('Thám Tử Tư', 'Phim hài hước điều tra.', 100, 7.9, '/p/10.jpg', '2025-09-10', 'Đạo Diễn J', 'Diễn Viên N, O'), -- ID 10
('Bóng Đêm', 'Phim siêu anh hùng.', 145, 8.8, '/p/11.jpg', '2025-10-25', 'Đạo Diễn K', 'Diễn Viên P, Q'), -- ID 11
('Hòn Đảo Mất Tích', 'Phim giả tưởng sinh tồn.', 125, 7.1, '/p/12.jpg', '2025-11-11', 'Đạo Diễn L', 'Diễn Viên R, S'), -- ID 12
('Chạy Trốn', 'Phim hành trình xuyên quốc gia.', 118, 7.4, '/p/13.jpg', '2025-12-01', 'Đạo Diễn M', 'Diễn Viên T, U'), -- ID 13
('Mùa Hè Năm Ấy', 'Phim thanh xuân vườn trường.', 98, 8.0, '/p/14.jpg', '2026-01-05', 'Đạo Diễn N', 'Diễn Viên V, W'), -- ID 14
('Cánh Cổng Thời Gian', 'Phim du hành thời gian.', 135, 8.6, '/p/15.jpg', '2026-02-20', 'Đạo Diễn O', 'Diễn Viên X, Y'), -- ID 15
('Vụ Án Thế Kỷ', 'Phim pháp luật hình sự.', 150, 9.2, '/p/16.jpg', '2026-03-15', 'Đạo Diễn P', 'Diễn Viên Z, A'), -- ID 16
('Người Lính Cuối Cùng', 'Phim hành động quân sự.', 122, 7.6, '/p/17.jpg', '2026-04-04', 'Đạo Diễn Q', 'Diễn Viên B, C'), -- ID 17
('Kẻ Thống Trị', 'Phim viễn tưởng dystopia.', 138, 8.4, '/p/18.jpg', '2026-05-20', 'Đạo Diễn R', 'Diễn Viên D, E'), -- ID 18
('Trái Tim Lạnh', 'Phim tâm lý xã hội.', 108, 7.0, '/p/19.jpg', '2026-06-12', 'Đạo Diễn S', 'Diễn Viên F, G'), -- ID 19
('Thiên Hà', 'Phim khoa học khám phá vũ trụ.', 158, 8.9, '/p/20.jpg', '2026-07-07', 'Đạo Diễn T', 'Diễn Viên H, I'); -- ID 20


INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1), (1, 2), -- Vùng Đất Quỷ Dữ: Hành Động, Kinh Dị
(2, 3), (2, 4), -- Chuyến Tàu Định Mệnh: Tâm Lý, Giật Gân
(3, 5), (3, 6), -- Tình Yêu Sao Băng: Lãng Mạn, K.H.V.T
(4, 8), (4, 3), -- Bí Mật Rừng Sâu: Phiêu Lưu, Tâm Lý
(5, 1), (5, 9), -- Thợ Săn Thành Phố: Hành Động, Tội Phạm
(6, 3), (6, 9), -- Kẻ Nổi Loạn: Tâm Lý, Tội Phạm
(7, 1), (7, 3), -- Ánh Sáng Cuối Đường: Hành Động, Tâm Lý
(8, 10), (8, 5), -- Lưới Tình: Gia Đình, Lãng Mạn
(9, 2), (9, 4), -- Mặt Nạ Đỏ: Kinh Dị, Giật Gân
(10, 7), (10, 9), -- Thám Tử Tư: Hài Hước, Tội Phạm
(11, 6), (11, 1), -- Bóng Đêm: K.H.V.T, Hành Động
(12, 8), (12, 6), -- Hòn Đảo Mất Tích: Phiêu Lưu, K.H.V.T
(13, 1), (13, 8), -- Chạy Trốn: Hành Động, Phiêu Lưu
(14, 5), (14, 10), -- Mùa Hè Năm Ấy: Lãng Mạn, Gia Đình
(15, 6), (15, 8), -- Cánh Cổng Thời Gian: K.H.V.T, Phiêu Lưu
(16, 9), (16, 3), -- Vụ Án Thế Kỷ: Tội Phạm, Tâm Lý
(17, 1), (17, 3), -- Người Lính Cuối Cùng: Hành Động, Tâm Lý
(18, 6), (18, 1), -- Kẻ Thống Trị: K.H.V.T, Hành Động
(19, 3), (19, 5), -- Trái Tim Lạnh: Tâm Lý, Lãng Mạn
(20, 6), (20, 8); -- Thiên Hà: K.H.V.T, Phiêu Lưu


INSERT INTO showtimes (movie_id, theater_id, start_time, price) VALUES
(1, 1, '2025-12-05 18:30:00', 95000), (2, 2, '2025-12-05 20:00:00', 120000),
(3, 3, '2025-12-05 15:45:00', 110000), (4, 4, '2025-12-05 22:15:00', 105000),
(5, 5, '2025-12-06 10:00:00', 90000), (6, 6, '2025-12-06 13:30:00', 125000),
(7, 7, '2025-12-06 16:00:00', 140000), (8, 8, '2025-12-06 19:15:00', 110000),
(9, 9, '2025-12-07 14:00:00', 100000), (10, 10, '2025-12-07 21:00:00', 130000),
(11, 11, '2025-12-08 18:45:00', 115000), (12, 12, '2025-12-08 17:30:00', 105000),
(13, 13, '2025-12-09 20:30:00', 120000), (14, 14, '2025-12-09 14:45:00', 95000),
(15, 15, '2025-12-10 19:50:00', 135000), (16, 16, '2025-12-10 11:00:00', 100000),
(17, 17, '2025-12-11 17:00:00', 110000), (18, 18, '2025-12-11 21:15:00', 145000),
(19, 19, '2025-12-12 15:30:00', 90000), (20, 20, '2025-12-12 18:30:00', 120000);


-- Dữ liệu mẫu (Giả định mỗi đơn hàng đặt 2-3 ghế)
INSERT INTO bookings (user_id, showtime_id, total_amount, status) VALUES
(1, 1, 190000, 'confirmed'), (2, 2, 360000, 'confirmed'), (3, 3, 220000, 'confirmed'), (4, 4, 105000, 'confirmed'),
(5, 5, 270000, 'confirmed'), (6, 6, 250000, 'confirmed'), (7, 7, 140000, 'confirmed'), (8, 8, 330000, 'confirmed'),
(9, 9, 200000, 'confirmed'), (10, 10, 130000, 'confirmed'), (11, 11, 230000, 'confirmed'), (12, 12, 210000, 'confirmed'),
(13, 13, 120000, 'confirmed'), (14, 14, 95000, 'confirmed'), (15, 15, 270000, 'confirmed'), (16, 16, 200000, 'confirmed'),
(17, 17, 330000, 'confirmed'), (18, 18, 290000, 'confirmed'), (19, 19, 180000, 'confirmed'), (20, 20, 120000, 'confirmed');

-- Ghế đã đặt (Tổng 20 bản ghi)
INSERT INTO booked_seats (booking_id, seat_identifier, price_paid) VALUES
(1, 'A5', 95000), (2, 'VIP-B1', 120000), (3, 'IMAX-C1', 110000), (4, 'S-D1', 105000),
(5, 'A1', 90000), (6, 'B5', 125000), (7, 'IMAX-D5', 140000), (8, 'S-E1', 110000),
(9, 'A4', 100000), (10, 'VIP-C7', 130000), (11, 'A7', 115000), (12, 'B7', 105000),
(13, 'C3', 120000), (14, 'D1', 95000), (15, 'E5', 135000), (16, 'F1', 100000),
(17, 'G1', 110000), (18, 'H1', 145000), (19, 'I1', 90000), (20, 'J1', 120000);


