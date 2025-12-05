CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    cccd_number VARCHAR(20) UNIQUE NOT NULL COMMENT 'Số Căn cước công dân/ID',
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    member_code VARCHAR(10) UNIQUE COMMENT 'Mã thành viên 10 chữ số, tự sinh',
    role ENUM('customer', 'admin') DEFAULT 'customer'
);


CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT COMMENT 'Thời lượng phim tính bằng phút',
    rating DECIMAL(2, 1) COMMENT 'Điểm đánh giá (ví dụ: 8.5)',
    poster_url VARCHAR(255) COMMENT 'Đường dẫn đến ảnh poster',
    release_date DATE COMMENT 'Ngày công chiếu',
    director VARCHAR(100),
    actors TEXT COMMENT 'Danh sách diễn viên chính'
);


CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);


CREATE TABLE theaters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Tên rạp hoặc phòng chiếu',
    capacity INT COMMENT 'Sức chứa tối đa (số ghế)'
);


CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    theater_id INT NOT NULL,
    start_time DATETIME NOT NULL COMMENT 'Thời gian bắt đầu suất chiếu',
    price INT NOT NULL COMMENT 'Giá vé cơ bản',
    
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Bắt buộc phải có user_id (Đã đăng nhập)',
    showtime_id INT NOT NULL,
    total_amount INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);


CREATE TABLE booked_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_identifier VARCHAR(10) NOT NULL COMMENT 'Ví dụ: A5, VIP-D3',
    price_paid INT NOT NULL,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_seat_per_booking (booking_id, seat_identifier)
);