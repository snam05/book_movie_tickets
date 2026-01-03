-- =============================================
-- HỆ THỐNG ĐẶT VÉ XEM PHIM - DỮ LIỆU MẪU
-- =============================================
-- Database: book_movie_tickets
-- Created: December 2025
-- =============================================

USE book_movie_tickets;

-- =============================================
-- 1. INSERT DATA: USERS (Người dùng)
-- =============================================

INSERT INTO users (email, password_hash, full_name, cccd_number, date_of_birth, gender, member_code, role) VALUES
-- Admin accounts
('ad@abc.com', '$2b$10$QTU/xrmH0hbcV0AHQ9804u7fFvyGAyTgYlDX4GZtQmg4AlwpHHqf6', 'Nguyễn Văn Admin', '001234567890', '1990-01-15', 'male', 'ADM001', 'admin'),
('manager@bookmovie.vn', '$2b$10$abcdefghijklmnopqrstuvwxyz123457', 'Trần Thị Quản Lý', '001234567891', '1992-05-20', 'female', 'ADM002', 'admin'),
('nguyenvana@gmail.com', '$2b$10$hashedpassword1', 'Nguyễn Văn A', '001234567892', '1995-03-12', 'male', 'MEM001', 'customer'),
('tranthib@gmail.com', '$2b$10$hashedpassword2', 'Trần Thị B', '001234567893', '1998-07-25', 'female', 'MEM002', 'customer'),
('levanc@gmail.com', '$2b$10$hashedpassword3', 'Lê Văn C', '001234567894', '1997-11-08', 'male', 'MEM003', 'customer'),
('phamthid@gmail.com', '$2b$10$hashedpassword4', 'Phạm Thị D', '001234567895', '1999-02-14', 'female', 'MEM004', 'customer'),
('hoangvane@gmail.com', '$2b$10$hashedpassword5', 'Hoàng Văn E', '001234567896', '1996-09-30', 'male', 'MEM005', 'customer'),
('vothif@gmail.com', '$2b$10$hashedpassword6', 'Võ Thị F', '001234567897', '2000-04-18', 'female', 'MEM006', 'customer'),
('dovanh@gmail.com', '$2b$10$hashedpassword7', 'Đỗ Văn H', '001234567898', '1994-12-05', 'male', 'MEM007', 'customer'),
('buithik@gmail.com', '$2b$10$hashedpassword8', 'Bùi Thị K', '001234567899', '2001-06-22', 'female', 'MEM008', 'customer');

-- =============================================
-- 2. INSERT DATA: GENRES (Thể loại phim)
-- =============================================

INSERT INTO genres (name, description) VALUES
('Hành động', 'Phim hành động, võ thuật, phiêu lưu'),
('Kinh dị', 'Phim kinh dị, ma quái, rùng rợn'),
('Hài', 'Phim hài hước, vui nhộn'),
('Tình cảm', 'Phim tình cảm, lãng mạn'),
('Khoa học viễn tưởng', 'Phim sci-fi, công nghệ tương lai'),
('Hoạt hình', 'Phim hoạt hình,애니메이션'),
('Tâm lý', 'Phim tâm lý, drama'),
('Hình sự', 'Phim hình sự, trinh thám'),
('Phiêu lưu', 'Phim phiêu lưu, thám hiểm'),
('Chiến tranh', 'Phim chiến tranh, lịch sử');

-- =============================================
-- 3. INSERT DATA: MOVIES (Phim)
-- =============================================

INSERT INTO movies (title, description, duration, release_date, poster_url, trailer_url, director, actors, rating, age_rating, status) VALUES
('Avengers: Endgame', 'Sau sự kiện tàn khốc của Infinity War, các siêu anh hùng còn lại tập hợp lại để đảo ngược hành động của Thanos và khôi phục lại trật tự vũ trụ.', 181, '2019-04-26', '/posters/avengers-endgame.jpg', 'https://youtube.com/watch?v=TcMBFSGVi1c', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth', 8.4, 'T13', 'now_showing'),

('Spider-Man: No Way Home', 'Peter Parker phải đối mặt với hậu quả khi danh tính Spider-Man bị lộ. Anh nhờ Doctor Strange giúp đỡ nhưng lại vô tình mở ra đa vũ trụ.', 148, '2021-12-17', '/posters/spiderman-nwh.jpg', 'https://youtube.com/watch?v=JfVOs4VSpmA', 'Jon Watts', 'Tom Holland, Zendaya, Benedict Cumberbatch', 8.2, 'T13', 'now_showing'),

('The Conjuring 3', 'Ed và Lorraine Warren điều tra một vụ án giết người liên quan đến hiện tượng quỷ ám, lần đầu tiên trong lịch sử Mỹ, nghi phạm sử dụng lý do quỷ ám để bào chữa.', 112, '2021-06-04', '/posters/conjuring3.jpg', 'https://youtube.com/watch?v=h9Q4zZS2v1k', 'Michael Chaves', 'Patrick Wilson, Vera Farmiga, Ruairi O''Connor', 6.3, 'T18', 'now_showing'),

('Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời', 'Nobita và hội bạn thân khám phá một vùng đất lý tưởng trên bầu trời nơi mọi người đều hạnh phúc. Nhưng liệu nơi đó có thực sự hoàn hảo?', 107, '2023-06-02', '/posters/doraemon-sky.jpg', 'https://youtube.com/watch?v=xyz123', 'Takumi Doyama', 'Wasabi Mizuta, Megumi Oohara, Yumi Kakazu', 7.8, 'P', 'now_showing'),

('Mai', 'Câu chuyện về Mai - một người phụ nữ có quá khứ bí ẩn, phải đối mặt với những khó khăn trong cuộc sống và tình yêu tại Sài Gòn những năm 90.', 131, '2024-02-10', '/posters/mai.jpg', 'https://youtube.com/watch?v=mai2024', 'Trấn Thành', 'Phương Anh Đào, Tuấn Trần, Hồng Đào', 7.5, 'T16', 'now_showing'),

('Inception', 'Một tên trộm chuyên đánh cắp bí mật từ tiềm thức được giao nhiệm vụ cấy một ý tưởng vào tâm trí người khác.', 148, '2010-07-16', '/posters/inception.jpg', 'https://youtube.com/watch?v=inception', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page', 8.8, 'T13', 'now_showing'),

('Parasite', 'Gia đình nghèo Ki-taek len lỏi vào cuộc sống của gia đình giàu có Park bằng cách trở thành gia sư và gia nhân của họ.', 132, '2019-05-30', '/posters/parasite.jpg', 'https://youtube.com/watch?v=parasite', 'Bong Joon-ho', 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong', 8.5, 'T16', 'now_showing'),

('Frozen 2', 'Elsa, Anna, Kristoff và Olaf lên đường đến một khu rừng bị phù phép để tìm nguồn gốc sức mạnh của Elsa và cứu vương quốc Arendelle.', 103, '2019-11-22', '/posters/frozen2.jpg', 'https://youtube.com/watch?v=frozen2', 'Chris Buck, Jennifer Lee', 'Kristen Bell, Idina Menzel, Josh Gad', 6.8, 'P', 'coming_soon'),

('Dune: Part Two', 'Paul Atreides hợp tác với Chani và người Fremen để trả thù những kẻ đã phá hủy gia đình mình, đối mặt với lựa chọn giữa tình yêu và số phận vũ trụ.', 166, '2024-03-01', '/posters/dune2.jpg', 'https://youtube.com/watch?v=dune2', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya, Austin Butler', 8.7, 'T13', 'coming_soon'),

('Godzilla x Kong: The New Empire', 'Kong và Godzilla phải hợp tác để đối phó với một mối đe dọa mới nổi lên từ sâu thẳm bên trong Trái Đất.', 115, '2024-03-29', '/posters/godzilla-kong.jpg', 'https://youtube.com/watch?v=gxk', 'Adam Wingard', 'Rebecca Hall, Brian Tyree Henry, Dan Stevens', 6.5, 'T13', 'coming_soon');

-- =============================================
-- 4. INSERT DATA: MOVIE_GENRES (Liên kết phim - thể loại)
-- =============================================

INSERT INTO movie_genres (movie_id, genre_id) VALUES
-- Avengers: Endgame
(1, 1), (1, 5), (1, 9),
-- Spider-Man: No Way Home
(2, 1), (2, 5), (2, 9),
-- The Conjuring 3
(3, 2),
-- Doraemon
(4, 6), (4, 9),
-- Mai
(5, 4), (5, 7),
-- Inception
(6, 5), (6, 7), (6, 8),
-- Parasite
(7, 7), (7, 8),
-- Frozen 2
(8, 6), (8, 9),
-- Dune: Part Two
(9, 1), (9, 5), (9, 9),
-- Godzilla x Kong
(10, 1), (10, 5);

-- =============================================
-- 5. INSERT DATA: THEATERS (Phòng chiếu)
-- =============================================

-- Theater 1: Standard (8 rows x 10 seats = 80 seats)
INSERT INTO theaters (name, total_seats, theater_type, status, seat_map) VALUES
('Phòng 1 - Standard', 80, 'standard', 'active', 
'{"rows":["A","B","C","D","E","F","G","H"],"seatsPerRow":10,"layout":[[{"id":"A1","row":"A","number":1,"type":"standard"},{"id":"A2","row":"A","number":2,"type":"standard"},{"id":"A3","row":"A","number":3,"type":"standard"},{"id":"A4","row":"A","number":4,"type":"standard"},{"id":"A5","row":"A","number":5,"type":"standard"},{"id":"A6","row":"A","number":6,"type":"standard"},{"id":"A7","row":"A","number":7,"type":"standard"},{"id":"A8","row":"A","number":8,"type":"standard"},{"id":"A9","row":"A","number":9,"type":"standard"},{"id":"A10","row":"A","number":10,"type":"standard"}],[{"id":"B1","row":"B","number":1,"type":"standard"},{"id":"B2","row":"B","number":2,"type":"standard"},{"id":"B3","row":"B","number":3,"type":"standard"},{"id":"B4","row":"B","number":4,"type":"standard"},{"id":"B5","row":"B","number":5,"type":"standard"},{"id":"B6","row":"B","number":6,"type":"standard"},{"id":"B7","row":"B","number":7,"type":"standard"},{"id":"B8","row":"B","number":8,"type":"standard"},{"id":"B9","row":"B","number":9,"type":"standard"},{"id":"B10","row":"B","number":10,"type":"standard"}],[{"id":"C1","row":"C","number":1,"type":"standard"},{"id":"C2","row":"C","number":2,"type":"standard"},{"id":"C3","row":"C","number":3,"type":"standard"},{"id":"C4","row":"C","number":4,"type":"standard"},{"id":"C5","row":"C","number":5,"type":"standard"},{"id":"C6","row":"C","number":6,"type":"standard"},{"id":"C7","row":"C","number":7,"type":"standard"},{"id":"C8","row":"C","number":8,"type":"standard"},{"id":"C9","row":"C","number":9,"type":"standard"},{"id":"C10","row":"C","number":10,"type":"standard"}],[{"id":"D1","row":"D","number":1,"type":"standard"},{"id":"D2","row":"D","number":2,"type":"standard"},{"id":"D3","row":"D","number":3,"type":"standard"},{"id":"D4","row":"D","number":4,"type":"standard"},{"id":"D5","row":"D","number":5,"type":"standard"},{"id":"D6","row":"D","number":6,"type":"standard"},{"id":"D7","row":"D","number":7,"type":"standard"},{"id":"D8","row":"D","number":8,"type":"standard"},{"id":"D9","row":"D","number":9,"type":"standard"},{"id":"D10","row":"D","number":10,"type":"standard"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"},{"id":"E9","row":"E","number":9,"type":"vip"},{"id":"E10","row":"E","number":10,"type":"vip"}],[{"id":"F1","row":"F","number":1,"type":"vip"},{"id":"F2","row":"F","number":2,"type":"vip"},{"id":"F3","row":"F","number":3,"type":"vip"},{"id":"F4","row":"F","number":4,"type":"vip"},{"id":"F5","row":"F","number":5,"type":"vip"},{"id":"F6","row":"F","number":6,"type":"vip"},{"id":"F7","row":"F","number":7,"type":"vip"},{"id":"F8","row":"F","number":8,"type":"vip"},{"id":"F9","row":"F","number":9,"type":"vip"},{"id":"F10","row":"F","number":10,"type":"vip"}],[{"id":"G1","row":"G","number":1,"type":"couple","pairWith":"G2"},{"id":"G2","row":"G","number":2,"type":"couple","pairWith":"G1"},{"id":"G3","row":"G","number":3,"type":"couple","pairWith":"G4"},{"id":"G4","row":"G","number":4,"type":"couple","pairWith":"G3"},{"id":"G5","row":"G","number":5,"type":"couple","pairWith":"G6"},{"id":"G6","row":"G","number":6,"type":"couple","pairWith":"G5"},{"id":"G7","row":"G","number":7,"type":"couple","pairWith":"G8"},{"id":"G8","row":"G","number":8,"type":"couple","pairWith":"G7"},{"id":"G9","row":"G","number":9,"type":"couple","pairWith":"G10"},{"id":"G10","row":"G","number":10,"type":"couple","pairWith":"G9"}],[{"id":"H1","row":"H","number":1,"type":"couple","pairWith":"H2"},{"id":"H2","row":"H","number":2,"type":"couple","pairWith":"H1"},{"id":"H3","row":"H","number":3,"type":"couple","pairWith":"H4"},{"id":"H4","row":"H","number":4,"type":"couple","pairWith":"H3"},{"id":"H5","row":"H","number":5,"type":"couple","pairWith":"H6"},{"id":"H6","row":"H","number":6,"type":"couple","pairWith":"H5"},{"id":"H7","row":"H","number":7,"type":"couple","pairWith":"H8"},{"id":"H8","row":"H","number":8,"type":"couple","pairWith":"H7"},{"id":"H9","row":"H","number":9,"type":"couple","pairWith":"H10"},{"id":"H10","row":"H","number":10,"type":"couple","pairWith":"H9"}]],"pricing":{"standard":1.0,"vip":1.5,"couple":2.0},"metadata":{"screen":"front","aisles":[3,7],"wheelchairAccessible":["A1","A10"]}}'),

-- Theater 2: Standard (8 rows x 10 seats = 80 seats)
('Phòng 2 - Standard', 80, 'standard', 'active',
'{"rows":["A","B","C","D","E","F","G","H"],"seatsPerRow":10,"layout":[[{"id":"A1","row":"A","number":1,"type":"standard"},{"id":"A2","row":"A","number":2,"type":"standard"},{"id":"A3","row":"A","number":3,"type":"standard"},{"id":"A4","row":"A","number":4,"type":"standard"},{"id":"A5","row":"A","number":5,"type":"standard"},{"id":"A6","row":"A","number":6,"type":"standard"},{"id":"A7","row":"A","number":7,"type":"standard"},{"id":"A8","row":"A","number":8,"type":"standard"},{"id":"A9","row":"A","number":9,"type":"standard"},{"id":"A10","row":"A","number":10,"type":"standard"}],[{"id":"B1","row":"B","number":1,"type":"standard"},{"id":"B2","row":"B","number":2,"type":"standard"},{"id":"B3","row":"B","number":3,"type":"standard"},{"id":"B4","row":"B","number":4,"type":"standard"},{"id":"B5","row":"B","number":5,"type":"standard"},{"id":"B6","row":"B","number":6,"type":"standard"},{"id":"B7","row":"B","number":7,"type":"standard"},{"id":"B8","row":"B","number":8,"type":"standard"},{"id":"B9","row":"B","number":9,"type":"standard"},{"id":"B10","row":"B","number":10,"type":"standard"}],[{"id":"C1","row":"C","number":1,"type":"standard"},{"id":"C2","row":"C","number":2,"type":"standard"},{"id":"C3","row":"C","number":3,"type":"standard"},{"id":"C4","row":"C","number":4,"type":"standard"},{"id":"C5","row":"C","number":5,"type":"standard"},{"id":"C6","row":"C","number":6,"type":"standard"},{"id":"C7","row":"C","number":7,"type":"standard"},{"id":"C8","row":"C","number":8,"type":"standard"},{"id":"C9","row":"C","number":9,"type":"standard"},{"id":"C10","row":"C","number":10,"type":"standard"}],[{"id":"D1","row":"D","number":1,"type":"standard"},{"id":"D2","row":"D","number":2,"type":"standard"},{"id":"D3","row":"D","number":3,"type":"standard"},{"id":"D4","row":"D","number":4,"type":"standard"},{"id":"D5","row":"D","number":5,"type":"standard"},{"id":"D6","row":"D","number":6,"type":"standard"},{"id":"D7","row":"D","number":7,"type":"standard"},{"id":"D8","row":"D","number":8,"type":"standard"},{"id":"D9","row":"D","number":9,"type":"standard"},{"id":"D10","row":"D","number":10,"type":"standard"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"},{"id":"E9","row":"E","number":9,"type":"vip"},{"id":"E10","row":"E","number":10,"type":"vip"}],[{"id":"F1","row":"F","number":1,"type":"vip"},{"id":"F2","row":"F","number":2,"type":"vip"},{"id":"F3","row":"F","number":3,"type":"vip"},{"id":"F4","row":"F","number":4,"type":"vip"},{"id":"F5","row":"F","number":5,"type":"vip"},{"id":"F6","row":"F","number":6,"type":"vip"},{"id":"F7","row":"F","number":7,"type":"vip"},{"id":"F8","row":"F","number":8,"type":"vip"},{"id":"F9","row":"F","number":9,"type":"vip"},{"id":"F10","row":"F","number":10,"type":"vip"}],[{"id":"G1","row":"G","number":1,"type":"couple","pairWith":"G2"},{"id":"G2","row":"G","number":2,"type":"couple","pairWith":"G1"},{"id":"G3","row":"G","number":3,"type":"couple","pairWith":"G4"},{"id":"G4","row":"G","number":4,"type":"couple","pairWith":"G3"},{"id":"G5","row":"G","number":5,"type":"couple","pairWith":"G6"},{"id":"G6","row":"G","number":6,"type":"couple","pairWith":"G5"},{"id":"G7","row":"G","number":7,"type":"couple","pairWith":"G8"},{"id":"G8","row":"G","number":8,"type":"couple","pairWith":"G7"},{"id":"G9","row":"G","number":9,"type":"couple","pairWith":"G10"},{"id":"G10","row":"G","number":10,"type":"couple","pairWith":"G9"}],[{"id":"H1","row":"H","number":1,"type":"couple","pairWith":"H2"},{"id":"H2","row":"H","number":2,"type":"couple","pairWith":"H1"},{"id":"H3","row":"H","number":3,"type":"couple","pairWith":"H4"},{"id":"H4","row":"H","number":4,"type":"couple","pairWith":"H3"},{"id":"H5","row":"H","number":5,"type":"couple","pairWith":"H6"},{"id":"H6","row":"H","number":6,"type":"couple","pairWith":"H5"},{"id":"H7","row":"H","number":7,"type":"couple","pairWith":"H8"},{"id":"H8","row":"H","number":8,"type":"couple","pairWith":"H7"},{"id":"H9","row":"H","number":9,"type":"couple","pairWith":"H10"},{"id":"H10","row":"H","number":10,"type":"couple","pairWith":"H9"}]],"pricing":{"standard":1.0,"vip":1.5,"couple":2.0},"metadata":{"screen":"front","aisles":[3,7],"wheelchairAccessible":["A1","A10"]}}'),

-- Theater 3: VIP (5 rows x 8 seats = 40 seats, all VIP)
('Phòng 3 - VIP', 40, 'vip', 'active',
'{"rows":["A","B","C","D","E"],"seatsPerRow":8,"layout":[[{"id":"A1","row":"A","number":1,"type":"vip"},{"id":"A2","row":"A","number":2,"type":"vip"},{"id":"A3","row":"A","number":3,"type":"vip"},{"id":"A4","row":"A","number":4,"type":"vip"},{"id":"A5","row":"A","number":5,"type":"vip"},{"id":"A6","row":"A","number":6,"type":"vip"},{"id":"A7","row":"A","number":7,"type":"vip"},{"id":"A8","row":"A","number":8,"type":"vip"}],[{"id":"B1","row":"B","number":1,"type":"vip"},{"id":"B2","row":"B","number":2,"type":"vip"},{"id":"B3","row":"B","number":3,"type":"vip"},{"id":"B4","row":"B","number":4,"type":"vip"},{"id":"B5","row":"B","number":5,"type":"vip"},{"id":"B6","row":"B","number":6,"type":"vip"},{"id":"B7","row":"B","number":7,"type":"vip"},{"id":"B8","row":"B","number":8,"type":"vip"}],[{"id":"C1","row":"C","number":1,"type":"vip"},{"id":"C2","row":"C","number":2,"type":"vip"},{"id":"C3","row":"C","number":3,"type":"vip"},{"id":"C4","row":"C","number":4,"type":"vip"},{"id":"C5","row":"C","number":5,"type":"vip"},{"id":"C6","row":"C","number":6,"type":"vip"},{"id":"C7","row":"C","number":7,"type":"vip"},{"id":"C8","row":"C","number":8,"type":"vip"}],[{"id":"D1","row":"D","number":1,"type":"vip"},{"id":"D2","row":"D","number":2,"type":"vip"},{"id":"D3","row":"D","number":3,"type":"vip"},{"id":"D4","row":"D","number":4,"type":"vip"},{"id":"D5","row":"D","number":5,"type":"vip"},{"id":"D6","row":"D","number":6,"type":"vip"},{"id":"D7","row":"D","number":7,"type":"vip"},{"id":"D8","row":"D","number":8,"type":"vip"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"}]],"pricing":{"vip":1.0},"metadata":{"screen":"front","recliners":true}}'),

-- Theater 4: IMAX (10 rows x 12 seats = 120 seats)
('Phòng 4 - IMAX', 120, 'imax', 'active',
'{"rows":["A","B","C","D","E","F","G","H","I","J"],"seatsPerRow":12,"layout":[[{"id":"A1","row":"A","number":1,"type":"standard"},{"id":"A2","row":"A","number":2,"type":"standard"},{"id":"A3","row":"A","number":3,"type":"standard"},{"id":"A4","row":"A","number":4,"type":"standard"},{"id":"A5","row":"A","number":5,"type":"standard"},{"id":"A6","row":"A","number":6,"type":"standard"},{"id":"A7","row":"A","number":7,"type":"standard"},{"id":"A8","row":"A","number":8,"type":"standard"},{"id":"A9","row":"A","number":9,"type":"standard"},{"id":"A10","row":"A","number":10,"type":"standard"},{"id":"A11","row":"A","number":11,"type":"standard"},{"id":"A12","row":"A","number":12,"type":"standard"}],[{"id":"B1","row":"B","number":1,"type":"standard"},{"id":"B2","row":"B","number":2,"type":"standard"},{"id":"B3","row":"B","number":3,"type":"standard"},{"id":"B4","row":"B","number":4,"type":"standard"},{"id":"B5","row":"B","number":5,"type":"standard"},{"id":"B6","row":"B","number":6,"type":"standard"},{"id":"B7","row":"B","number":7,"type":"standard"},{"id":"B8","row":"B","number":8,"type":"standard"},{"id":"B9","row":"B","number":9,"type":"standard"},{"id":"B10","row":"B","number":10,"type":"standard"},{"id":"B11","row":"B","number":11,"type":"standard"},{"id":"B12","row":"B","number":12,"type":"standard"}],[{"id":"C1","row":"C","number":1,"type":"standard"},{"id":"C2","row":"C","number":2,"type":"standard"},{"id":"C3","row":"C","number":3,"type":"standard"},{"id":"C4","row":"C","number":4,"type":"standard"},{"id":"C5","row":"C","number":5,"type":"standard"},{"id":"C6","row":"C","number":6,"type":"standard"},{"id":"C7","row":"C","number":7,"type":"standard"},{"id":"C8","row":"C","number":8,"type":"standard"},{"id":"C9","row":"C","number":9,"type":"standard"},{"id":"C10","row":"C","number":10,"type":"standard"},{"id":"C11","row":"C","number":11,"type":"standard"},{"id":"C12","row":"C","number":12,"type":"standard"}],[{"id":"D1","row":"D","number":1,"type":"vip"},{"id":"D2","row":"D","number":2,"type":"vip"},{"id":"D3","row":"D","number":3,"type":"vip"},{"id":"D4","row":"D","number":4,"type":"vip"},{"id":"D5","row":"D","number":5,"type":"vip"},{"id":"D6","row":"D","number":6,"type":"vip"},{"id":"D7","row":"D","number":7,"type":"vip"},{"id":"D8","row":"D","number":8,"type":"vip"},{"id":"D9","row":"D","number":9,"type":"vip"},{"id":"D10","row":"D","number":10,"type":"vip"},{"id":"D11","row":"D","number":11,"type":"vip"},{"id":"D12","row":"D","number":12,"type":"vip"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"},{"id":"E9","row":"E","number":9,"type":"vip"},{"id":"E10","row":"E","number":10,"type":"vip"},{"id":"E11","row":"E","number":11,"type":"vip"},{"id":"E12","row":"E","number":12,"type":"vip"}],[{"id":"F1","row":"F","number":1,"type":"vip"},{"id":"F2","row":"F","number":2,"type":"vip"},{"id":"F3","row":"F","number":3,"type":"vip"},{"id":"F4","row":"F","number":4,"type":"vip"},{"id":"F5","row":"F","number":5,"type":"vip"},{"id":"F6","row":"F","number":6,"type":"vip"},{"id":"F7","row":"F","number":7,"type":"vip"},{"id":"F8","row":"F","number":8,"type":"vip"},{"id":"F9","row":"F","number":9,"type":"vip"},{"id":"F10","row":"F","number":10,"type":"vip"},{"id":"F11","row":"F","number":11,"type":"vip"},{"id":"F12","row":"F","number":12,"type":"vip"}],[{"id":"G1","row":"G","number":1,"type":"vip"},{"id":"G2","row":"G","number":2,"type":"vip"},{"id":"G3","row":"G","number":3,"type":"vip"},{"id":"G4","row":"G","number":4,"type":"vip"},{"id":"G5","row":"G","number":5,"type":"vip"},{"id":"G6","row":"G","number":6,"type":"vip"},{"id":"G7","row":"G","number":7,"type":"vip"},{"id":"G8","row":"G","number":8,"type":"vip"},{"id":"G9","row":"G","number":9,"type":"vip"},{"id":"G10","row":"G","number":10,"type":"vip"},{"id":"G11","row":"G","number":11,"type":"vip"},{"id":"G12","row":"G","number":12,"type":"vip"}],[{"id":"H1","row":"H","number":1,"type":"standard"},{"id":"H2","row":"H","number":2,"type":"standard"},{"id":"H3","row":"H","number":3,"type":"standard"},{"id":"H4","row":"H","number":4,"type":"standard"},{"id":"H5","row":"H","number":5,"type":"standard"},{"id":"H6","row":"H","number":6,"type":"standard"},{"id":"H7","row":"H","number":7,"type":"standard"},{"id":"H8","row":"H","number":8,"type":"standard"},{"id":"H9","row":"H","number":9,"type":"standard"},{"id":"H10","row":"H","number":10,"type":"standard"},{"id":"H11","row":"H","number":11,"type":"standard"},{"id":"H12","row":"H","number":12,"type":"standard"}],[{"id":"I1","row":"I","number":1,"type":"standard"},{"id":"I2","row":"I","number":2,"type":"standard"},{"id":"I3","row":"I","number":3,"type":"standard"},{"id":"I4","row":"I","number":4,"type":"standard"},{"id":"I5","row":"I","number":5,"type":"standard"},{"id":"I6","row":"I","number":6,"type":"standard"},{"id":"I7","row":"I","number":7,"type":"standard"},{"id":"I8","row":"I","number":8,"type":"standard"},{"id":"I9","row":"I","number":9,"type":"standard"},{"id":"I10","row":"I","number":10,"type":"standard"},{"id":"I11","row":"I","number":11,"type":"standard"},{"id":"I12","row":"I","number":12,"type":"standard"}],[{"id":"J1","row":"J","number":1,"type":"standard"},{"id":"J2","row":"J","number":2,"type":"standard"},{"id":"J3","row":"J","number":3,"type":"standard"},{"id":"J4","row":"J","number":4,"type":"standard"},{"id":"J5","row":"J","number":5,"type":"standard"},{"id":"J6","row":"J","number":6,"type":"standard"},{"id":"J7","row":"J","number":7,"type":"standard"},{"id":"J8","row":"J","number":8,"type":"standard"},{"id":"J9","row":"J","number":9,"type":"standard"},{"id":"J10","row":"J","number":10,"type":"standard"},{"id":"J11","row":"J","number":11,"type":"standard"},{"id":"J12","row":"J","number":12,"type":"standard"}]],"pricing":{"standard":1.0,"vip":1.8},"metadata":{"screen":"large","screenType":"IMAX","aisles":[4,8]}}'),

-- Theater 5: 3D (8 rows x 10 seats = 80 seats, same as standard)
('Phòng 5 - 3D', 80, '3d', 'active',
'{"rows":["A","B","C","D","E","F","G","H"],"seatsPerRow":10,"layout":[[{"id":"A1","row":"A","number":1,"type":"standard"},{"id":"A2","row":"A","number":2,"type":"standard"},{"id":"A3","row":"A","number":3,"type":"standard"},{"id":"A4","row":"A","number":4,"type":"standard"},{"id":"A5","row":"A","number":5,"type":"standard"},{"id":"A6","row":"A","number":6,"type":"standard"},{"id":"A7","row":"A","number":7,"type":"standard"},{"id":"A8","row":"A","number":8,"type":"standard"},{"id":"A9","row":"A","number":9,"type":"standard"},{"id":"A10","row":"A","number":10,"type":"standard"}],[{"id":"B1","row":"B","number":1,"type":"standard"},{"id":"B2","row":"B","number":2,"type":"standard"},{"id":"B3","row":"B","number":3,"type":"standard"},{"id":"B4","row":"B","number":4,"type":"standard"},{"id":"B5","row":"B","number":5,"type":"standard"},{"id":"B6","row":"B","number":6,"type":"standard"},{"id":"B7","row":"B","number":7,"type":"standard"},{"id":"B8","row":"B","number":8,"type":"standard"},{"id":"B9","row":"B","number":9,"type":"standard"},{"id":"B10","row":"B","number":10,"type":"standard"}],[{"id":"C1","row":"C","number":1,"type":"standard"},{"id":"C2","row":"C","number":2,"type":"standard"},{"id":"C3","row":"C","number":3,"type":"standard"},{"id":"C4","row":"C","number":4,"type":"standard"},{"id":"C5","row":"C","number":5,"type":"standard"},{"id":"C6","row":"C","number":6,"type":"standard"},{"id":"C7","row":"C","number":7,"type":"standard"},{"id":"C8","row":"C","number":8,"type":"standard"},{"id":"C9","row":"C","number":9,"type":"standard"},{"id":"C10","row":"C","number":10,"type":"standard"}],[{"id":"D1","row":"D","number":1,"type":"standard"},{"id":"D2","row":"D","number":2,"type":"standard"},{"id":"D3","row":"D","number":3,"type":"standard"},{"id":"D4","row":"D","number":4,"type":"standard"},{"id":"D5","row":"D","number":5,"type":"standard"},{"id":"D6","row":"D","number":6,"type":"standard"},{"id":"D7","row":"D","number":7,"type":"standard"},{"id":"D8","row":"D","number":8,"type":"standard"},{"id":"D9","row":"D","number":9,"type":"standard"},{"id":"D10","row":"D","number":10,"type":"standard"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"},{"id":"E9","row":"E","number":9,"type":"vip"},{"id":"E10","row":"E","number":10,"type":"vip"}],[{"id":"F1","row":"F","number":1,"type":"vip"},{"id":"F2","row":"F","number":2,"type":"vip"},{"id":"F3","row":"F","number":3,"type":"vip"},{"id":"F4","row":"F","number":4,"type":"vip"},{"id":"F5","row":"F","number":5,"type":"vip"},{"id":"F6","row":"F","number":6,"type":"vip"},{"id":"F7","row":"F","number":7,"type":"vip"},{"id":"F8","row":"F","number":8,"type":"vip"},{"id":"F9","row":"F","number":9,"type":"vip"},{"id":"F10","row":"F","number":10,"type":"vip"}],[{"id":"G1","row":"G","number":1,"type":"couple","pairWith":"G2"},{"id":"G2","row":"G","number":2,"type":"couple","pairWith":"G1"},{"id":"G3","row":"G","number":3,"type":"couple","pairWith":"G4"},{"id":"G4","row":"G","number":4,"type":"couple","pairWith":"G3"},{"id":"G5","row":"G","number":5,"type":"couple","pairWith":"G6"},{"id":"G6","row":"G","number":6,"type":"couple","pairWith":"G5"},{"id":"G7","row":"G","number":7,"type":"couple","pairWith":"G8"},{"id":"G8","row":"G","number":8,"type":"couple","pairWith":"G7"},{"id":"G9","row":"G","number":9,"type":"couple","pairWith":"G10"},{"id":"G10","row":"G","number":10,"type":"couple","pairWith":"G9"}],[{"id":"H1","row":"H","number":1,"type":"couple","pairWith":"H2"},{"id":"H2","row":"H","number":2,"type":"couple","pairWith":"H1"},{"id":"H3","row":"H","number":3,"type":"couple","pairWith":"H4"},{"id":"H4","row":"H","number":4,"type":"couple","pairWith":"H3"},{"id":"H5","row":"H","number":5,"type":"couple","pairWith":"H6"},{"id":"H6","row":"H","number":6,"type":"couple","pairWith":"H5"},{"id":"H7","row":"H","number":7,"type":"couple","pairWith":"H8"},{"id":"H8","row":"H","number":8,"type":"couple","pairWith":"H7"},{"id":"H9","row":"H","number":9,"type":"couple","pairWith":"H10"},{"id":"H10","row":"H","number":10,"type":"couple","pairWith":"H9"}]],"pricing":{"standard":1.0,"vip":1.5,"couple":2.0},"metadata":{"screen":"front","aisles":[3,7],"wheelchairAccessible":["A1","A10"]}}'),

-- Theater 6: Standard Small (6 rows x 8 seats = 48 seats)
('Phòng 6 - Standard', 48, 'standard', 'active',
'{"rows":["A","B","C","D","E","F"],"seatsPerRow":8,"layout":[[{"id":"A1","row":"A","number":1,"type":"standard"},{"id":"A2","row":"A","number":2,"type":"standard"},{"id":"A3","row":"A","number":3,"type":"standard"},{"id":"A4","row":"A","number":4,"type":"standard"},{"id":"A5","row":"A","number":5,"type":"standard"},{"id":"A6","row":"A","number":6,"type":"standard"},{"id":"A7","row":"A","number":7,"type":"standard"},{"id":"A8","row":"A","number":8,"type":"standard"}],[{"id":"B1","row":"B","number":1,"type":"standard"},{"id":"B2","row":"B","number":2,"type":"standard"},{"id":"B3","row":"B","number":3,"type":"standard"},{"id":"B4","row":"B","number":4,"type":"standard"},{"id":"B5","row":"B","number":5,"type":"standard"},{"id":"B6","row":"B","number":6,"type":"standard"},{"id":"B7","row":"B","number":7,"type":"standard"},{"id":"B8","row":"B","number":8,"type":"standard"}],[{"id":"C1","row":"C","number":1,"type":"standard"},{"id":"C2","row":"C","number":2,"type":"standard"},{"id":"C3","row":"C","number":3,"type":"standard"},{"id":"C4","row":"C","number":4,"type":"standard"},{"id":"C5","row":"C","number":5,"type":"standard"},{"id":"C6","row":"C","number":6,"type":"standard"},{"id":"C7","row":"C","number":7,"type":"standard"},{"id":"C8","row":"C","number":8,"type":"standard"}],[{"id":"D1","row":"D","number":1,"type":"standard"},{"id":"D2","row":"D","number":2,"type":"standard"},{"id":"D3","row":"D","number":3,"type":"standard"},{"id":"D4","row":"D","number":4,"type":"standard"},{"id":"D5","row":"D","number":5,"type":"standard"},{"id":"D6","row":"D","number":6,"type":"standard"},{"id":"D7","row":"D","number":7,"type":"standard"},{"id":"D8","row":"D","number":8,"type":"standard"}],[{"id":"E1","row":"E","number":1,"type":"vip"},{"id":"E2","row":"E","number":2,"type":"vip"},{"id":"E3","row":"E","number":3,"type":"vip"},{"id":"E4","row":"E","number":4,"type":"vip"},{"id":"E5","row":"E","number":5,"type":"vip"},{"id":"E6","row":"E","number":6,"type":"vip"},{"id":"E7","row":"E","number":7,"type":"vip"},{"id":"E8","row":"E","number":8,"type":"vip"}],[{"id":"F1","row":"F","number":1,"type":"vip"},{"id":"F2","row":"F","number":2,"type":"vip"},{"id":"F3","row":"F","number":3,"type":"vip"},{"id":"F4","row":"F","number":4,"type":"vip"},{"id":"F5","row":"F","number":5,"type":"vip"},{"id":"F6","row":"F","number":6,"type":"vip"},{"id":"F7","row":"F","number":7,"type":"vip"},{"id":"F8","row":"F","number":8,"type":"vip"}]],"pricing":{"standard":1.0,"vip":1.5},"metadata":{"screen":"front","aisles":[4],"wheelchairAccessible":["A1","A8"]}}');

-- =============================================
-- 6. INSERT DATA: SHOWTIMES (Suất chiếu)
-- =============================================

INSERT INTO showtimes (movie_id, theater_id, showtime_date, showtime_time, price, available_seats, status) VALUES
-- Avengers: Endgame
(1, 1, '2026-01-05', '10:00:00', 80000, 80, 'scheduled'),
(1, 2, '2026-01-05', '14:00:00', 80000, 80, 'scheduled'),
(1, 4, '2026-01-05', '20:00:00', 150000, 120, 'scheduled'),
(1, 1, '2026-01-06', '10:00:00', 80000, 80, 'scheduled'),
(1, 4, '2026-01-06', '20:00:00', 150000, 120, 'scheduled'),

-- Spider-Man: No Way Home
(2, 2, '2026-01-05', '10:30:00', 85000, 80, 'scheduled'),
(2, 5, '2026-01-05', '15:00:00', 120000, 80, 'scheduled'),
(2, 3, '2026-01-05', '21:00:00', 130000, 40, 'scheduled'),
(2, 2, '2026-01-06', '10:30:00', 85000, 80, 'scheduled'),

-- The Conjuring 3
(3, 1, '2026-01-05', '22:00:00', 90000, 80, 'scheduled'),
(3, 2, '2026-01-06', '22:00:00', 90000, 80, 'scheduled'),

-- Doraemon
(4, 6, '2026-01-05', '09:00:00', 70000, 48, 'scheduled'),
(4, 6, '2026-01-05', '11:00:00', 70000, 48, 'scheduled'),
(4, 6, '2026-01-05', '14:00:00', 70000, 48, 'scheduled'),
(4, 6, '2026-01-06', '09:00:00', 70000, 48, 'scheduled'),

-- Mai
(5, 3, '2026-01-05', '18:00:00', 120000, 40, 'scheduled'),
(5, 3, '2026-01-06', '18:00:00', 120000, 40, 'scheduled'),

-- Inception
(6, 4, '2026-01-05', '16:00:00', 150000, 120, 'scheduled'),
(6, 5, '2026-01-06', '16:00:00', 120000, 80, 'scheduled'),

-- Parasite
(7, 1, '2026-01-05', '18:30:00', 75000, 80, 'scheduled');

-- =============================================
-- 7. INSERT DATA: BOOKINGS (Đặt vé mẫu)
-- =============================================

INSERT INTO bookings (user_id, showtime_id, booking_code, total_seats, total_price, booking_status, payment_status, payment_method, payment_date) VALUES
(3, 1, 'BK20251224001', 2, 160000, 'confirmed', 'paid', 'momo', '2025-12-23 14:30:00'),
(4, 2, 'BK20251224002', 3, 240000, 'confirmed', 'paid', 'vnpay', '2025-12-23 15:45:00'),
(5, 7, 'BK20251224003', 2, 240000, 'confirmed', 'paid', 'card', '2025-12-23 16:20:00'),
(6, 12, 'BK20251224004', 4, 280000, 'pending', 'unpaid', NULL, NULL),
(7, 3, 'BK20251224005', 2, 300000, 'confirmed', 'paid', 'zalopay', '2025-12-24 09:15:00');

-- =============================================
-- 8. INSERT DATA: BOOKED_SEATS (Ghế đã đặt)
-- =============================================

INSERT INTO booked_seats (booking_id, seat_row, seat_number, seat_type, seat_price) VALUES
-- Booking 1 (BK20251224001) - 2 ghế
(1, 'E', 5, 'standard', 80000),
(1, 'E', 6, 'standard', 80000),

-- Booking 2 (BK20251224002) - 3 ghế
(2, 'F', 7, 'standard', 80000),
(2, 'F', 8, 'standard', 80000),
(2, 'F', 9, 'standard', 80000),

-- Booking 3 (BK20251224003) - 2 ghế VIP
(3, 'D', 10, 'vip', 120000),
(3, 'D', 11, 'vip', 120000),

-- Booking 4 (BK20251224004) - 4 ghế
(4, 'C', 3, 'standard', 70000),
(4, 'C', 4, 'standard', 70000),
(4, 'C', 5, 'standard', 70000),
(4, 'C', 6, 'standard', 70000),

-- Booking 5 (BK20251224005) - 2 ghế IMAX
(5, 'G', 15, 'standard', 150000),
(5, 'G', 16, 'standard', 150000);

-- =============================================
-- HOÀN THÀNH - DỮ LIỆU MẪU ĐÃ ĐƯỢC THÊM VÀO
-- =============================================
