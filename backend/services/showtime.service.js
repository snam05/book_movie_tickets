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
