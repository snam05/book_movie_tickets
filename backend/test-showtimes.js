// test-showtimes.js
// Test script to verify showtimes data from database

import { Movie, Showtime, Theater } from './models/index.js';
import { Op } from 'sequelize';

async function testShowtimes() {
    try {
        console.log('🎬 Testing showtimes retrieval...\n');
        
        // Lấy một phim bất kỳ
        const movie = await Movie.findOne({
            where: { status: 'now_showing' },
            include: [
                {
                    model: Showtime,
                    as: 'showtimes',
                    attributes: ['id', 'showtime_date', 'showtime_time', 'price', 'available_seats', 'status'],
                    include: [
                        {
                            model: Theater,
                            as: 'theater',
                            attributes: ['id', 'name', 'theater_type']
                        }
                    ],
                    where: {
                        status: { [Op.in]: ['scheduled', 'showing'] }
                    },
                    required: false
                }
            ]
        });
        
        if (!movie) {
            console.log('❌ Không tìm thấy phim đang chiếu');
            return;
        }
        
        console.log(`✅ Phim: ${movie.title}`);
        console.log(`   Status: ${movie.status}`);
        console.log(`   Số lịch chiếu: ${movie.showtimes?.length || 0}\n`);
        
        if (movie.showtimes && movie.showtimes.length > 0) {
            console.log('📅 Danh sách lịch chiếu:');
            movie.showtimes.forEach((showtime, index) => {
                console.log(`\n   ${index + 1}. ${showtime.showtime_date} - ${showtime.showtime_time}`);
                console.log(`      Rạp: ${showtime.theater.name} (${showtime.theater.theater_type})`);
                console.log(`      Giá: ${showtime.price}đ`);
                console.log(`      Ghế trống: ${showtime.available_seats}`);
                console.log(`      Trạng thái: ${showtime.status}`);
            });
        } else {
            console.log('⚠️  Phim này chưa có lịch chiếu');
        }
        
        console.log('\n✅ Test completed!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        process.exit(0);
    }
}

testShowtimes();
