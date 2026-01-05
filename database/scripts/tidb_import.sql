CREATE DATABASE IF NOT EXISTS book_movie_tickets;
USE book_movie_tickets;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    cccd_number VARCHAR(20) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    member_code VARCHAR(20) UNIQUE,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_status (is_active, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    duration INT NOT NULL,
    release_date DATE,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    director VARCHAR(100),
    actors TEXT,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    age_rating VARCHAR(10),
    status ENUM('coming_soon', 'now_showing', 'ended') DEFAULT 'coming_soon',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_movie_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE movie_genres (
    movie_id BIGINT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    CONSTRAINT fk_mg_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_mg_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE theaters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL DEFAULT 0,
    seat_map JSON,
    theater_type ENUM('standard', 'vip', 'imax', '3d', '4dx') DEFAULT 'standard',
    status ENUM('active', 'maintenance') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seat_type ENUM('standard', 'vip', 'couple', 'premium') NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE showtimes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    theater_id INT NOT NULL,
    showtime_date DATE NOT NULL,
    showtime_time TIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    status ENUM('normal', 'canceled') DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_st_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_st_theater FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE,
    INDEX idx_st_search (showtime_date, movie_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    showtime_id BIGINT NOT NULL,
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    total_seats INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    payment_method ENUM('cash', 'card', 'momo', 'zalopay', 'vnpay') NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_bk_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE booked_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    seat_row VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('standard', 'vip', 'couple') DEFAULT 'standard',
    price_at_booking DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ss_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_act_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    category ENUM('movie_news', 'events', 'promotions', 'reviews') DEFAULT 'movie_news',
    is_published BOOLEAN DEFAULT FALSE,
    published_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE sessions 
TTL = `expires_at` + INTERVAL 0 MINUTE;