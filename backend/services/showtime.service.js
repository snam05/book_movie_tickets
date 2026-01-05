// services/showtime.service.js
import { Showtime, Movie, Theater, Booking, BookedSeat } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Tính trạng thái động của lịch chiếu dựa trên thời gian
 * @param {Object} showtime - Đối tượng showtime
 * @returns {string} Trạng thái: 'canceled', 'scheduled', 'showing', 'completed'
 */
const calculateDynamicStatus = (showtime) => {
    // Nếu đã bị hủy thì return canceled
    if (showtime.status === 'canceled') {
        return 'canceled';
    }

    const now = new Date();
    const showtimeDateTime = new Date(`${showtime.showtime_date} ${showtime.showtime_time}`);
    
    // Lấy thời gian phim (duration tính bằng phút)
    const movieDuration = showtime.movie?.duration || 0;
    const showtimeEndTime = new Date(showtimeDateTime.getTime() + movieDuration * 60000);

    // Trước giờ chiếu -> scheduled
    if (now < showtimeDateTime) {
        return 'scheduled';
    }
    // Từ giờ chiếu đến hết phim -> showing
    else if (now >= showtimeDateTime && now <= showtimeEndTime) {
        return 'showing';
    }
    // Sau khi hết phim -> completed
    else {
        return 'completed';
    }
};

/**
 * Tính số ghế trống dựa trên ghế đã đặt
 * Logic: 
 * - Lấy total_seats từ theaters ứng với rạp trong showtime
 * - Join Booking với BookedSeat theo showtime_id
 * - Count số ghế đã đặt (status = pending/confirmed)
 * - available_seats = total_seats - booked_count
 * 
 * @param {number} showtimeId - ID lịch chiếu
 * @param {number} totalSeats - Tổng số ghế của rạp
 * @returns {Promise<number>} Số ghế trống
 */
const calculateAvailableSeats = async (showtimeId, totalSeats) => {
    try {
        // Query: SELECT COUNT(*) FROM booked_seats 
        // JOIN bookings ON booked_seats.booking_id = bookings.id
        // WHERE bookings.showtime_id = ? AND bookings.booking_status IN ('pending', 'confirmed')
        
        const bookedCount = await BookedSeat.count({
            include: [{
                model: Booking,
                as: 'booking',
                where: {
                    showtime_id: showtimeId,
                    booking_status: {
                        [Op.in]: ['pending', 'confirmed']
                    }
                },
                attributes: [],
                required: true // INNER JOIN để đảm bảo chỉ count những ghế có booking
            }],
            distinct: true // Để đảm bảo count chính xác khi có multiple rows
        });

        const availableSeats = Math.max(0, totalSeats - bookedCount);
        return availableSeats;
    } catch (error) {
        console.error('Error calculating available seats:', error);
        return totalSeats; // Return total seats as fallback
    }
};

/**
 * Lấy danh sách tất cả suất chiếu
 * @returns {Promise<Array>} Danh sách showtimes
 */
export const getAllShowtimes = async () => {
    try {
        const showtimes = await Showtime.findAll({
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status', 'created_at', 'updated_at'],
            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'poster_url', 'duration']
                },
                {
                    model: Theater,
                    as: 'theater',
                    attributes: ['id', 'name', 'theater_type', 'total_seats']
                }
            ],
            order: [['showtime_date', 'DESC'], ['showtime_time', 'DESC']]
        });

        // Tính số ghế trống động và trạng thái cho mỗi showtime
        const showtimesWithSeats = await Promise.all(
            showtimes.map(async (showtime) => {
                const availableSeats = await calculateAvailableSeats(showtime.id, showtime.theater.total_seats);
                const showtimeJson = showtime.toJSON();
                const dynamicStatus = calculateDynamicStatus(showtimeJson);
                return {
                    ...showtimeJson,
                    available_seats: availableSeats,
                    display_status: dynamicStatus
                };
            })
        );

        return showtimesWithSeats;
    } catch (error) {
        console.error('Error getting all showtimes:', error);
        throw error;
    }
};

/**
 * Lấy thông tin chi tiết suất chiếu kèm seat_map và ghế đã đặt
 * @param {number} showtimeId - ID suất chiếu
 * @returns {Promise<Object>} Thông tin showtime kèm movie, theater và seat_map với trạng thái ghế
 */
export const getShowtimeById = async (showtimeId) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status', 'created_at', 'updated_at'],
            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'poster_url', 'duration', 'age_rating']
                },
                {
                    model: Theater,
                    as: 'theater',
                    attributes: ['id', 'name', 'theater_type', 'total_seats', 'seat_map', 'status']
                }
            ]
        });

        if (!showtime) {
            throw new Error('Không tìm thấy suất chiếu');
        }

        // Kiểm tra nếu rạp đang bảo trì
        if (showtime.theater.status === 'maintenance') {
            throw new Error('Rạp chiếu đang trong quá trình bảo trì');
        }

        // Lấy tất cả ghế đã đặt cho suất chiếu này (chỉ booking pending/confirmed)
        // Query: SELECT seat_row, seat_number FROM booked_seats
        // JOIN bookings ON booked_seats.booking_id = bookings.id
        // WHERE bookings.showtime_id = ? AND bookings.booking_status IN ('pending', 'confirmed')
        const bookedSeats = await BookedSeat.findAll({
            include: [{
                model: Booking,
                as: 'booking',
                where: {
                    showtime_id: showtimeId,
                    booking_status: {
                        [Op.in]: ['pending', 'confirmed']
                    }
                },
                attributes: [],
                required: true // INNER JOIN - chỉ lấy ghế có booking hợp lệ
            }],
            attributes: ['seat_row', 'seat_number', 'seat_type'],
            raw: true
        });

        // Tạo Set các ghế đã đặt với multiple key formats
        // Formats: "A1", "A1_standard", số index trong layout, etc.
        const bookedSeatsSet = new Set();
        bookedSeats.forEach(seat => {
            // Format 1: Row + Number (e.g., "A1", "A2")
            bookedSeatsSet.add(`${seat.seat_row}${seat.seat_number}`);
            // Format 2: Just the concat (fallback)
            bookedSeatsSet.add(`${seat.seat_row}${seat.seat_number}`.toUpperCase());
            bookedSeatsSet.add(`${seat.seat_row?.toUpperCase()}${seat.seat_number}`);
        });

        console.log(`[Showtime ${showtimeId}] Booked seats:`, Array.from(bookedSeatsSet));

        // Parse seat_map và đánh dấu ghế đã đặt
        let seatMap = showtime.theater.seat_map;
        
        if (seatMap && seatMap.layout && Array.isArray(seatMap.layout)) {
            seatMap = {
                ...seatMap,
                layout: seatMap.layout.map(row => {
                    if (!Array.isArray(row)) return row;
                    return row.map(seat => {
                        if (!seat || typeof seat !== 'object') return seat;
                        const isBooked = bookedSeatsSet.has(seat.id);
                        return {
                            ...seat,
                            isBooked
                        };
                    });
                })
            };
        }

        // Tính số ghế trống động
        const availableSeats = await calculateAvailableSeats(showtimeId, showtime.theater.total_seats);

        // Tính trạng thái động
        const showtimeJson = showtime.toJSON();
        const dynamicStatus = calculateDynamicStatus(showtimeJson);

        return {
            ...showtimeJson,
            available_seats: availableSeats,
            display_status: dynamicStatus,
            theater: {
                ...showtime.theater.toJSON(),
                seat_map: seatMap
            }
        };
    } catch (error) {
        console.error('Error getting showtime:', error);
        throw error;
    }
};

/**
 * Kiểm tra xung đột lịch chiếu
 * @param {number} theaterId - ID rạp chiếu
 * @param {string} showtimeDate - Ngày chiếu
 * @param {string} showtimeTime - Giờ chiếu
 * @param {number} duration - Thời lượng phim (phút)
 * @param {number} excludeShowtimeId - ID suất chiếu cần loại trừ (khi update)
 * @returns {Promise<Object|null>} Trả về thông tin suất chiếu bị trùng hoặc null
 */
const checkShowtimeConflict = async (theaterId, showtimeDate, showtimeTime, duration, excludeShowtimeId = null) => {
    try {
        // Tính thời gian bắt đầu và kết thúc của suất chiếu mới
        const newStart = new Date(`${showtimeDate}T${showtimeTime}`);
        const newEnd = new Date(newStart.getTime() + duration * 60000);

        // Lấy tất cả suất chiếu trong cùng rạp và cùng ngày
        const existingShowtimes = await Showtime.findAll({
            attributes: ['id', 'movie_id', 'showtime_date', 'showtime_time'],
            where: {
                theater_id: theaterId,
                showtime_date: showtimeDate,
                status: 'normal',
                ...(excludeShowtimeId && { id: { [Op.ne]: excludeShowtimeId } })
            },
            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'duration']
                }
            ]
        });

        // Kiểm tra xung đột với từng suất chiếu hiện có
        for (const existingShowtime of existingShowtimes) {
            const existingStart = new Date(`${existingShowtime.showtime_date}T${existingShowtime.showtime_time}`);
            const existingEnd = new Date(existingStart.getTime() + existingShowtime.movie.duration * 60000);

            // Kiểm tra overlap:
            // 1. Suất mới bắt đầu trong khoảng suất cũ: newStart >= existingStart && newStart < existingEnd
            // 2. Suất mới kết thúc trong khoảng suất cũ: newEnd > existingStart && newEnd <= existingEnd
            // 3. Suất mới bao trùm suất cũ: newStart <= existingStart && newEnd >= existingEnd
            const hasConflict = 
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd);

            if (hasConflict) {
                return {
                    conflictShowtime: existingShowtime,
                    conflictMovie: existingShowtime.movie
                };
            }
        }

        return null; // Không có xung đột
    } catch (error) {
        console.error('Error checking showtime conflict:', error);
        throw error;
    }
};

/**
 * Tạo lịch chiếu mới
 * @param {Object} showtimeData - Dữ liệu lịch chiếu
 * @returns {Promise<Object>} Lịch chiếu đã tạo
 */
export const createShowtime = async (showtimeData) => {
    try {
        const { movie_id, theater_id, showtime_date, showtime_time, price, status } = showtimeData;

        // Validate dữ liệu
        if (!movie_id || !theater_id || !showtime_date || !showtime_time || !price) {
            throw new Error('Thiếu thông tin bắt buộc');
        }

        // Kiểm tra phim có tồn tại
        const movie = await Movie.findByPk(movie_id);
        if (!movie) {
            throw new Error('Không tìm thấy phim');
        }

        // Kiểm tra rạp có tồn tại
        const theater = await Theater.findByPk(theater_id);
        if (!theater) {
            throw new Error('Không tìm thấy rạp chiếu');
        }

        // Kiểm tra xung đột lịch chiếu
        const conflict = await checkShowtimeConflict(
            theater_id,
            showtime_date,
            showtime_time,
            movie.duration
        );

        if (conflict) {
            const conflictTime = conflict.conflictShowtime.showtime_time.substring(0, 5);
            throw new Error(
                `Xung đột lịch chiếu! Rạp đã có suất chiếu phim "${conflict.conflictMovie.title}" ` +
                `vào lúc ${conflictTime} cùng ngày. Vui lòng chọn thời gian khác.`
            );
        }

        // Tạo lịch chiếu mới
        const newShowtime = await Showtime.create({
            movie_id,
            theater_id,
            showtime_date,
            showtime_time,
            price,
            status: status || 'normal'
        });

        // Lấy dữ liệu đầy đủ
        const showtime = await Showtime.findByPk(newShowtime.id, {            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status', 'created_at', 'updated_at'],            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'poster_url', 'duration']
                },
                {
                    model: Theater,
                    as: 'theater',
                    attributes: ['id', 'name', 'theater_type']
                }
            ]
        });

        return showtime;
    } catch (error) {
        console.error('Error creating showtime:', error);
        throw error;
    }
};

/**
 * Cập nhật lịch chiếu
 * @param {number} showtimeId - ID lịch chiếu
 * @param {Object} showtimeData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Lịch chiếu đã cập nhật
 */
export const updateShowtime = async (showtimeId, showtimeData) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status']
        });

        if (!showtime) {
            throw new Error('Không tìm thấy lịch chiếu');
        }

        // Kiểm tra phim nếu có thay đổi
        if (showtimeData.movie_id && showtimeData.movie_id !== showtime.movie_id) {
            const movie = await Movie.findByPk(showtimeData.movie_id);
            if (!movie) {
                throw new Error('Không tìm thấy phim');
            }
        }

        // Kiểm tra rạp nếu có thay đổi
        let theater = null;
        if (showtimeData.theater_id && showtimeData.theater_id !== showtime.theater_id) {
            theater = await Theater.findByPk(showtimeData.theater_id);
            if (!theater) {
                throw new Error('Không tìm thấy rạp chiếu');
            }
        } else if (showtimeData.theater_id) {
            theater = await Theater.findByPk(showtimeData.theater_id);
        }

        // Kiểm tra xung đột lịch chiếu nếu có thay đổi về thời gian, rạp hoặc phim
        const hasTimeChange = showtimeData.showtime_date || showtimeData.showtime_time;
        const hasTheaterChange = showtimeData.theater_id && showtimeData.theater_id !== showtime.theater_id;
        const hasMovieChange = showtimeData.movie_id && showtimeData.movie_id !== showtime.movie_id;

        if (hasTimeChange || hasTheaterChange || hasMovieChange) {
            // Lấy thông tin phim để biết duration
            const movieId = showtimeData.movie_id || showtime.movie_id;
            const movie = await Movie.findByPk(movieId, {
                attributes: ['id', 'title', 'duration']
            });

            if (!movie) {
                throw new Error('Không tìm thấy phim');
            }

            const theaterId = showtimeData.theater_id || showtime.theater_id;
            const showtimeDate = showtimeData.showtime_date || showtime.showtime_date;
            const showtimeTime = showtimeData.showtime_time || showtime.showtime_time;

            // Kiểm tra xung đột (loại trừ chính suất chiếu đang sửa)
            const conflict = await checkShowtimeConflict(
                theaterId,
                showtimeDate,
                showtimeTime,
                movie.duration,
                showtimeId
            );

            if (conflict) {
                const conflictTime = conflict.conflictShowtime.showtime_time.substring(0, 5);
                throw new Error(
                    `Xung đột lịch chiếu! Rạp đã có suất chiếu phim "${conflict.conflictMovie.title}" ` +
                    `vào lúc ${conflictTime} cùng ngày. Vui lòng chọn thời gian khác.`
                );
            }
        }

        // Cập nhật các trường
        if (showtimeData.movie_id) showtime.movie_id = showtimeData.movie_id;
        if (showtimeData.theater_id) showtime.theater_id = showtimeData.theater_id;
        if (showtimeData.showtime_date) showtime.showtime_date = showtimeData.showtime_date;
        if (showtimeData.showtime_time) showtime.showtime_time = showtimeData.showtime_time;
        if (showtimeData.price) showtime.price = showtimeData.price;
        if (showtimeData.status) showtime.status = showtimeData.status;

        showtime.updated_at = new Date();
        await showtime.save();

        // Lấy dữ liệu đầy đủ
        const updatedShowtime = await Showtime.findByPk(showtimeId, {            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status', 'created_at', 'updated_at'],            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'poster_url', 'duration']
                },
                {
                    model: Theater,
                    as: 'theater',
                    attributes: ['id', 'name', 'theater_type']
                }
            ]
        });

        return updatedShowtime;
    } catch (error) {
        console.error('Error updating showtime:', error);
        throw error;
    }
};

/**
 * Xóa lịch chiếu
 * @param {number} showtimeId - ID lịch chiếu
 * @returns {Promise<Object>} Thông báo xóa thành công
 */
export const deleteShowtime = async (showtimeId) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status']
        });

        if (!showtime) {
            throw new Error('Không tìm thấy lịch chiếu');
        }

        // Kiểm tra xem có booking nào không
        const bookings = await Booking.findAll({
            where: { showtime_id: showtimeId }
        });

        if (bookings.length > 0) {
            throw new Error('Không thể xóa lịch chiếu vì có booking liên quan');
        }

        await showtime.destroy();

        return { message: 'Đã xóa lịch chiếu thành công' };
    } catch (error) {
        console.error('Error deleting showtime:', error);
        throw error;
    }
};

/**
 * Hủy lịch chiếu và gửi thông báo cho người mua vé
 * @param {number} showtimeId - ID lịch chiếu
 * @returns {Promise<Object>}
 */
export const cancelShowtime = async (showtimeId) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            attributes: ['id', 'movie_id', 'theater_id', 'showtime_date', 'showtime_time', 'price', 'status']
        });

        if (!showtime) {
            throw new Error('Không tìm thấy lịch chiếu');
        }

        // Update status thành 'canceled'
        showtime.status = 'canceled';
        await showtime.save();

        // Lấy danh sách các booking liên quan
        const bookings = await Booking.findAll({
            where: { showtime_id: showtimeId },
            attributes: ['id', 'user_id'],
            raw: true
        });

        // Import Activity service để ghi log thông báo
        const { createActivity } = await import('./activity.service.js');

        // Tạo thông báo cho mỗi user có booking
        if (bookings.length > 0) {
            for (const booking of bookings) {
                try {
                    await createActivity({
                        user_id: booking.user_id,
                        action: 'NOTIFICATION',
                        resource: 'Showtime',
                        resource_id: showtimeId,
                        description: `Lịch chiếu phim đã bị hủy. Vui lòng liên hệ nhân viên để được hỗ trợ hoàn lại tiền.`,
                        metadata: {
                            booking_id: booking.id,
                            showtime_date: showtime.showtime_date,
                            showtime_time: showtime.showtime_time,
                            notification_type: 'SHOWTIME_CANCELLED'
                        }
                    });
                } catch (err) {
                    console.error('Error creating notification for user:', booking.user_id, err);
                    // Tiếp tục với booking tiếp theo nếu có lỗi
                }
            }
        }

        return { 
            message: 'Đã hủy lịch chiếu thành công. Những khách hàng có booking sẽ nhận được thông báo.',
            affected_bookings: bookings.length
        };
    } catch (error) {
        console.error('Error cancelling showtime:', error);
        throw error;
    }
};

/**
 * Lấy số ghế trống động của suất chiếu
 * @param {number} showtimeId - ID suất chiếu
 * @returns {Promise<number>} Số ghế trống
 */
export const getShowtimeAvailableSeats = async (showtimeId) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            include: [{
                model: Theater,
                as: 'theater',
                attributes: ['id', 'total_seats']
            }]
        });

        if (!showtime) {
            throw new Error('Không tìm thấy suất chiếu');
        }

        const availableSeats = await calculateAvailableSeats(showtimeId, showtime.theater.total_seats);
        return availableSeats;
    } catch (error) {
        console.error('Error getting available seats:', error);
        throw error;
    }
};
