-- fix_session_trigger.sql
-- Script để xóa trigger gây lỗi và để logic xóa session cũ trong code

USE book_movie_tickets;

-- Xóa trigger before_session_insert
DROP TRIGGER IF EXISTS before_session_insert;

-- Thông báo
SELECT 'Trigger before_session_insert đã được xóa. Logic xóa session cũ sẽ được xử lý trong code.' AS message;
