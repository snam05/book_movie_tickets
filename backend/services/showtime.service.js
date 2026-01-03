// services/showtime.service.js
import { Showtime, Movie, Theater, Booking, BookedSeat } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Lấy thông tin chi tiết suất chiếu kèm seat_map và ghế đã đặt
 * @param {number} showtimeId - ID suất chiếu
 * @returns {Promise<Object>} Thông tin showtime kèm movie, theater và seat_map với trạng thái ghế
 */
export const getShowtimeById = async (showtimeId) => {
    try {
        const showtime = await Showtime.findByPk(showtimeId, {
            include: [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'poster_url', 'duration', 'age_rating']
                },
                {
                    model: Theater,
                    as: 'theater',
                    attributes: ['id', 'name', 'theater_type', 'total_seats', 'seat_map']
                }
            ]
        });

        if (!showtime) {
            throw new Error('Không tìm thấy suất chiếu');
        }

        // Lấy tất cả ghế đã đặt cho suất chiếu này (chỉ booking pending/confirmed)
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
                attributes: []
            }],
            attributes: ['seat_row', 'seat_number', 'seat_type']
        });

        // Tạo Set các ghế đã đặt
        const bookedSeatsSet = new Set();
        bookedSeats.forEach(seat => {
            bookedSeatsSet.add(`${seat.seat_row}${seat.seat_number}`);
        });

        // Parse seat_map và đánh dấu ghế đã đặt
        let seatMap = showtime.theater.seat_map;
        if (seatMap && seatMap.layout) {
            seatMap = {
                ...seatMap,
                layout: seatMap.layout.map(row => 
                    row.map(seat => ({
                        ...seat,
                        isBooked: bookedSeatsSet.has(seat.id)
                    }))
                )
            };
        }

        return {
            ...showtime.toJSON(),
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
