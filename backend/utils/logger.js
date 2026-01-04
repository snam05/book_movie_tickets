import { Activity } from '../models/index.js';

// Cache to prevent duplicate logs within a short time window
const recentLogs = new Map();
const DUPLICATE_WINDOW_MS = 1000; // 1 second

/**
 * Create activity log entry
 * @param {number} userId - ID of user performing action
 * @param {string} action - Action type (e.g., 'LOGIN', 'CREATE_MOVIE', 'UPDATE_BOOKING')
 * @param {string} resource - Type of resource (e.g., 'Movie', 'Booking', 'Theater')
 * @param {number|null} resourceId - ID of the resource being acted upon
 * @param {object} details - Additional details about the action
 * @param {object} req - Express request object for IP and user agent
 */
export const createLog = async (userId, action, resource, resourceId, details, req) => {
    try {
        // Create a unique key for this log entry
        const logKey = `${userId}-${action}-${resource}-${resourceId || 'null'}-${Date.now()}`;
        
        // Check if we recently created a similar log
        const lastLogTime = recentLogs.get(logKey);
        const now = Date.now();
        
        if (lastLogTime && (now - lastLogTime) < DUPLICATE_WINDOW_MS) {
            // Skip duplicate log within the time window
            console.log(`⚠️ Skipping duplicate log: ${logKey}`);
            return;
        }
        
        // Update the timestamp for this log type
        recentLogs.set(logKey, now);
        
        // Clean up old entries from cache (older than 5 seconds)
        for (const [key, timestamp] of recentLogs.entries()) {
            if (now - timestamp > 5000) {
                recentLogs.delete(key);
            }
        }
        
        // Extract IP address, checking for proxy headers
        let ipAddress = 'Unknown';
        
        if (req) {
            // Check for localhost first
            const host = req.headers?.host || req.get?.('host') || '';
            if (host.includes('localhost') || host.includes('127.0.0.1')) {
                ipAddress = '127.0.0.1';
            } else {
                // Check multiple headers for production/proxy scenarios
                ipAddress = req.headers?.['x-forwarded-for']?.split(',')[0].trim() ||
                           req.headers?.['x-real-ip'] ||
                           req.headers?.['cf-connecting-ip'] ||
                           req.headers?.['client-ip'] ||
                           req.headers?.['true-client-ip'] ||
                           req.socket?.remoteAddress ||
                           req.connection?.remoteAddress ||
                           'Unknown';
                
                // Handle IPv6-mapped IPv4 (::ffff:192.168.1.1 -> 192.168.1.1)
                if (ipAddress && ipAddress.startsWith('::ffff:')) {
                    ipAddress = ipAddress.substring(7);
                }
            }
        }
        
        // Extract user agent
        const userAgent = req?.headers?.['user-agent'] || req?.get?.('user-agent') || null;
        
        // Sanitize details to avoid storing raw passwords
        const sanitizeDetails = (input) => {
            if (!input) return null;

            let obj;
            if (typeof input === 'string') {
                try {
                    obj = JSON.parse(input);
                } catch (e) {
                    return '<encrypted>';
                }
            } else {
                obj = JSON.parse(JSON.stringify(input));
            }

            const passwordKeyRx = /password|pass|pwd|new_password|old_password|confirm_password/i;

            const walk = (o) => {
                if (Array.isArray(o)) {
                    o.forEach(walk);
                } else if (o && typeof o === 'object') {
                    for (const k of Object.keys(o)) {
                        try {
                            if (passwordKeyRx.test(k)) {
                                o[k] = '<encrypted>';
                            } else if (o[k] && typeof o[k] === 'object') {
                                walk(o[k]);
                            }
                        } catch (e) {}
                    }
                }
            };

            walk(obj);
            return obj;
        };

        const safeDetails = sanitizeDetails(details);

        await Activity.create({
            userId,
            action,
            resource,
            resourceId,
            metadata: safeDetails ? JSON.stringify(safeDetails) : null,
            ipAddress,
            userAgent,
            method: req?.method || 'UNKNOWN',
            endpoint: req?.originalUrl || req?.path || 'UNKNOWN'
        });
        
        console.log(`✅ Log created: ${action} ${resource} by user ${userId} from IP ${ipAddress}`);
    } catch (error) {
        // Don't throw - logging should not break the main operation
        console.error('Lỗi tạo log:', error);
    }
};

/**
 * Log action types constants for consistency
 */
export const LogActions = {
    // Auth actions
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    
    // Booking actions
    CREATE_BOOKING: 'CREATE_BOOKING',
    UPDATE_BOOKING: 'UPDATE_BOOKING',
    DELETE_BOOKING: 'DELETE_BOOKING',
    VIEW_BOOKING: 'VIEW_BOOKING',
    VIEW_ALL_BOOKINGS: 'VIEW_ALL_BOOKINGS',
    
    // Movie actions
    CREATE_MOVIE: 'CREATE_MOVIE',
    UPDATE_MOVIE: 'UPDATE_MOVIE',
    DELETE_MOVIE: 'DELETE_MOVIE',
    VIEW_MOVIE: 'VIEW_MOVIE',
    VIEW_ALL_MOVIES: 'VIEW_ALL_MOVIES',
    
    // Theater actions
    CREATE_THEATER: 'CREATE_THEATER',
    UPDATE_THEATER: 'UPDATE_THEATER',
    DELETE_THEATER: 'DELETE_THEATER',
    VIEW_THEATER: 'VIEW_THEATER',
    VIEW_ALL_THEATERS: 'VIEW_ALL_THEATERS',
    
    // Showtime actions
    CREATE_SHOWTIME: 'CREATE_SHOWTIME',
    UPDATE_SHOWTIME: 'UPDATE_SHOWTIME',
    DELETE_SHOWTIME: 'DELETE_SHOWTIME',
    VIEW_SHOWTIME: 'VIEW_SHOWTIME',
    VIEW_ALL_SHOWTIMES: 'VIEW_ALL_SHOWTIMES',
    
    // User actions
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    UPDATE_ROLE: 'UPDATE_ROLE',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD',
    DELETE_USER: 'DELETE_USER',
    VIEW_USER: 'VIEW_USER',
    VIEW_ALL_USERS: 'VIEW_ALL_USERS',
    
    // Genre actions
    CREATE_GENRE: 'CREATE_GENRE',
    UPDATE_GENRE: 'UPDATE_GENRE',
    DELETE_GENRE: 'DELETE_GENRE',
    VIEW_GENRE: 'VIEW_GENRE',
    VIEW_ALL_GENRES: 'VIEW_ALL_GENRES',
    
    // Seat actions
    BOOK_SEAT: 'BOOK_SEAT',
    
    // Statistics actions
    VIEW_STATISTICS: 'VIEW_STATISTICS',
    VIEW_STATS: 'VIEW_STATISTICS'
};

/**
 * Resource types constants
 */
export const ResourceTypes = {
    AUTH: 'Auth',
    BOOKING: 'Booking',
    MOVIE: 'Movie',
    THEATER: 'Theater',
    SHOWTIME: 'Showtime',
    USER: 'User',
    GENRE: 'Genre',
    ACTIVITY: 'Activity',
    SEAT: 'Seat'
};
