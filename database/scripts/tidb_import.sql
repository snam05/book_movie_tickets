-- =============================================
-- HỆ THỐNG ĐẶT VÉ XEM PHIM - BOOK MOVIE TICKETS
-- Database: book_movie_tickets
-- Target System: TiDB / MySQL
-- =============================================

CREATE DATABASE IF NOT EXISTS book_movie_tickets;
USE book_movie_tickets;

-- 1. BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    cccd_number VARCHAR(20) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    member_code VARCHAR(10) UNIQUE,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Trạng thái kích hoạt tài khoản',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_cccd (cccd_number),
    INDEX idx_member_code (member_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG THỂ LOẠI PHIM (GENRES)
CREATE TABLE IF NOT EXISTS genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG PHIM (MOVIES)
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL COMMENT 'Thời lượng phim (phút)',
    release_date DATE,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    director VARCHAR(100),
    actors TEXT,
    rating DECIMAL(3, 1) DEFAULT 0.0 COMMENT 'Đánh giá 0.0 - 10.0',
    age_rating VARCHAR(10) COMMENT 'P, K, T13, T16, T18, C',
    status ENUM('coming_soon', 'now_showing', 'ended') DEFAULT 'coming_soon',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_status (status),
    INDEX idx_release_date (release_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG LIÊN KẾT PHIM - THỂ LOẠI (MOVIE_GENRES)
CREATE TABLE IF NOT EXISTS movie_genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE,
    UNIQUE KEY unique_movie_genre (movie_id, genre_id),
    INDEX idx_movie_id (movie_id),
    INDEX idx_genre_id (genre_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG RẠP CHIẾU PHIM (THEATERS)
CREATE TABLE IF NOT EXISTS theaters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Tên phòng chiếu: Phòng 1, Phòng 2, VIP 1',
    total_seats INT NOT NULL DEFAULT 0,
    seat_map JSON COMMENT 'Cấu trúc sơ đồ ghế (rows, columns)',
    theater_type ENUM('standard', 'vip', 'imax', '3d') DEFAULT 'standard',
    status ENUM('active', 'maintenance') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG SUẤT CHIẾU (SHOWTIMES)
CREATE TABLE IF NOT EXISTS showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    theater_id INT NOT NULL,
    showtime_date DATE NOT NULL,
    showtime_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL COMMENT 'Giá vé cho suất chiếu này',
    status ENUM('normal', 'canceled') DEFAULT 'normal' COMMENT 'normal: bình thường, canceled: đã hủy',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE,
    INDEX idx_movie_id (movie_id),
    INDEX idx_theater_id (theater_id),
    INDEX idx_showtime_date (showtime_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG ĐẶT VÉ (BOOKINGS)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    booking_code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Mã đặt vé duy nhất',
    total_seats INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    payment_method ENUM('cash', 'card', 'momo', 'zalopay', 'vnpay') NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_date DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_showtime_id (showtime_id),
    INDEX idx_booking_code (booking_code),
    INDEX idx_booking_status (booking_status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG GHẾ ĐÃ ĐẶT (BOOKED_SEATS)
CREATE TABLE IF NOT EXISTS booked_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_row VARCHAR(5) NOT NULL COMMENT 'Hàng ghế: A, B, C, ...',
    seat_number INT NOT NULL COMMENT 'Số ghế: 1, 2, 3, ...',
    seat_type ENUM('standard', 'vip', 'couple') DEFAULT 'standard',
    seat_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_seat_location (seat_row, seat_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BẢNG PHIÊN ĐĂNG NHẬP (SESSIONS) với TiDB TTL
-- Thay vì dùng Stored Procedure, ta dùng tính năng TTL của TiDB để tự động dọn dẹp
CREATE TABLE IF NOT EXISTS sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
TTL = `expires_at` + INTERVAL 0 MINUTE;

-- 10. BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITIES)
CREATE TABLE IF NOT EXISTS activities (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL COMMENT 'Hành động thực hiện (CREATE, READ, UPDATE, DELETE, etc)',
    resource VARCHAR(100) NOT NULL COMMENT 'Loại tài nguyên bị tác động (User, Movie, etc)',
    resource_id INT NULL COMMENT 'ID của tài nguyên bị tác động',
    description TEXT NULL COMMENT 'Mô tả chi tiết',
    metadata JSON NULL COMMENT 'Dữ liệu bổ sung',
    method VARCHAR(10) NOT NULL COMMENT 'HTTP method',
    endpoint VARCHAR(255) NOT NULL COMMENT 'API endpoint',
    status_code INT NULL COMMENT 'HTTP response status code',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    browser VARCHAR(100) NULL,
    os VARCHAR(100) NULL,
    response_time INT NULL COMMENT 'Thời gian phản hồi (ms)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource),
    INDEX idx_created_at (created_at DESC),
    CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. BẢNG GIÁ VÉ THEO LOẠI GHẾ (PRICES)
CREATE TABLE IF NOT EXISTS prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seat_type ENUM('standard', 'premium', 'vip') NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seat_type (seat_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BẢNG TIN TỨC (NEWS)
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    summary TEXT,
    image VARCHAR(500),
    category ENUM('movie_news', 'events', 'promotions', 'reviews', 'interviews', 'behind_the_scenes') DEFAULT 'movie_news',
    is_published BOOLEAN DEFAULT FALSE,
    published_at DATETIME NULL,
    views INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_is_published (is_published),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INDEXES BỔ SUNG ĐỂ TỐI ƯU HIỆU SUẤT
-- =============================================
CREATE INDEX idx_showtime_search ON showtimes(movie_id, showtime_date, theater_id);
CREATE INDEX idx_booking_date_status ON bookings(booking_date, booking_status);