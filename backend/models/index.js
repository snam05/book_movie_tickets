// models/index.js
// Export tất cả models để dễ dàng import

import User from './User.model.js';
import Session from './Session.model.js';
import Genre from './Genre.model.js';
import Movie from './Movie.model.js';
import MovieGenre from './MovieGenre.model.js';
import Theater from './Theater.model.js';
import Showtime from './Showtime.model.js';
import Booking from './Booking.model.js';
import BookedSeat from './BookedSeat.model.js';
import Activity from './Activity.model.js';
import Price from './Price.model.js';
import News from './News.model.js';

// Export tất cả models
export {
    User,
    Session,
    Genre,
    Movie,
    MovieGenre,
    Theater,
    Showtime,
    Booking,
    BookedSeat,
    Activity,
    Price,
    News
};

// Export default object chứa tất cả models
export default {
    User,
    Session,
    Genre,
    Movie,
    MovieGenre,
    Theater,
    Showtime,
    Booking,
    BookedSeat,
    Activity,
    Price,
    News
};
