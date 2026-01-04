// services/activity.service.js

import Activity from '../models/Activity.model.js';
import User from '../models/User.model.js';
import { UAParser } from 'ua-parser-js';

/**
 * Parse user agent to get browser and OS info
 */
const parseUserAgent = (userAgent) => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    return {
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown'
    };
};

/**
 * Extract IPv4 address from request
 */
const getIPAddress = (req) => {
    if (!req) return 'Unknown';
    
    // Nếu là localhost, trả về 127.0.0.1 hoặc tên host
    const host = req.headers.host || '';
    if (host.includes('localhost') || host.startsWith('127.') || host === 'localhost:8080') {
        return '127.0.0.1';
    }
    
    // Cố gắng lấy IP từ các header khác nhau (cho production/vercel)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        // x-forwarded-for có thể chứa nhiều IP, lấy cái đầu tiên
        const ips = forwardedFor.split(',');
        const ipv4 = ips[0].trim();
        // Kiểm tra nếu là IPv4
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ipv4)) {
            return ipv4;
        }
    }
    
    // Thử các header khác từ reverse proxy
    const headerIps = [
        req.headers['x-real-ip'],
        req.headers['cf-connecting-ip'],
        req.headers['client-ip'],
        req.headers['true-client-ip']
    ];
    
    for (const ip of headerIps) {
        if (ip && /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
            return ip;
        }
    }
    
    // Thử socket remoteAddress
    const remoteAddress = req.socket?.remoteAddress || req.connection?.remoteAddress;
    if (remoteAddress) {
        // Bỏ "::ffff:" prefix nếu có (IPv4-mapped IPv6)
        let ip = remoteAddress;
        if (ip.startsWith('::ffff:')) {
            ip = ip.substring(7);
        }
        // Kiểm tra nếu là IPv4
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
            return ip;
        }
        // Nếu là IPv6 localhost
        if (ip === '::1' || ip === '127.0.0.1') {
            return '127.0.0.1';
        }
    }
    
    return 'Unknown';
};

/**
 * Ghi log hoạt động
 */
export const logActivity = async ({
    userId,
    action,
    resource,
    resourceId,
    description,
    metadata,
    method,
    endpoint,
    statusCode,
    ipAddress,
    userAgent,
    responseTime,
    req
}) => {
    try {
        let finalIpAddress = ipAddress || (req ? getIPAddress(req) : null);
        let finalUserAgent = userAgent || (req ? req.headers['user-agent'] : null);
        let finalResource = resource;
        
        // If resource is UNKNOWN, try to extract from endpoint
        if (!finalResource || finalResource === 'UNKNOWN') {
            const resourceMap = {
                '/bookings': 'Booking',
                '/movies': 'Movie',
                '/theaters': 'Theater',
                '/showtimes': 'Showtime',
                '/users': 'User',
                '/genres': 'Genre',
                '/auth': 'Auth',
                '/activities': 'Activity',
                '/admin': 'Admin'
            };
            
            // Try to find matching endpoint pattern
            for (const [pattern, resourceName] of Object.entries(resourceMap)) {
                if (endpoint && endpoint.includes(pattern)) {
                    finalResource = resourceName;
                    break;
                }
            }
        }
        
        // Final fallback
        if (!finalResource || finalResource === 'UNKNOWN') {
            finalResource = 'Unknown';
        }
        
        const { browser, os } = parseUserAgent(finalUserAgent || '');

        // Sanitize metadata: never store raw passwords in metadata
        const sanitizeMetadata = (input) => {
            if (!input) return null;

            // Ensure we operate on an object
            let obj;
            if (typeof input === 'string') {
                try {
                    obj = JSON.parse(input);
                } catch (e) {
                    // If not JSON, return placeholder
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
                        } catch (e) {
                            // ignore traversal errors
                        }
                    }
                }
            };

            walk(obj);
            return obj;
        };

        const safeMetadataObj = sanitizeMetadata(metadata);

        const activity = await Activity.create({
            user_id: userId,
            action,
            resource: finalResource,
            resource_id: resourceId,
            description,
            metadata: safeMetadataObj ? JSON.stringify(safeMetadataObj) : null,
            method,
            endpoint,
            status_code: statusCode,
            ip_address: finalIpAddress,
            user_agent: finalUserAgent,
            browser,
            os,
            response_time: responseTime,
            created_at: new Date()
        });

        return activity;
    } catch (error) {
        console.error('Error logging activity:', error);
        // Không throw error để không ảnh hưởng đến request chính
    }
};

/**
 * Lấy tất cả activities với pagination
 */
export const getActivities = async (page = 1, limit = 20, filters = {}) => {
    try {
        const offset = (page - 1) * limit;
        
        const where = {};
        
        if (filters.userId) {
            where.user_id = filters.userId;
        }
        if (filters.action) {
            where.action = filters.action;
        }
        if (filters.resource) {
            where.resource = filters.resource;
        }
        if (filters.startDate || filters.endDate) {
            where.created_at = {};
            if (filters.startDate) {
                const start = new Date(filters.startDate);
                where.created_at.$gte = start;
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.created_at.$lte = end;
            }
        }

        const { count, rows } = await Activity.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'full_name', 'role']
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    } catch (error) {
        console.error('Error in getActivities:', error);
        throw error;
    }
};

/**
 * Lấy chi tiết một activity
 */
export const getActivityById = async (id) => {
    try {
        const activity = await Activity.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'full_name', 'role']
                }
            ]
        });

        return activity;
    } catch (error) {
        console.error('Error in getActivityById:', error);
        throw error;
    }
};

/**
 * Lấy thống kê hoạt động
 */
export const getActivityStatistics = async (startDate, endDate) => {
    try {
        const where = {};
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            
            where.created_at = {
                $gte: start,
                $lte: end
            };
        }

        // Đếm theo action
        const actionStats = await Activity.findAll({
            attributes: ['action', [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']],
            where,
            group: ['action'],
            raw: true
        });

        // Đếm theo resource
        const resourceStats = await Activity.findAll({
            attributes: ['resource', [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']],
            where,
            group: ['resource'],
            raw: true
        });

        // Đếm theo user
        const userStats = await Activity.findAll({
            attributes: ['user_id', [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']],
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'full_name'],
                    required: false
                }
            ],
            group: ['user_id'],
            raw: false,
            subQuery: false
        });

        return {
            actionStats,
            resourceStats,
            userStats,
            totalActivities: await Activity.count({ where })
        };
    } catch (error) {
        console.error('Error in getActivityStatistics:', error);
        throw error;
    }
};

/**
 * Xóa activities cũ (cleanup)
 */
export const deleteOldActivities = async (daysOld = 30) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - daysOld);

        const result = await Activity.destroy({
            where: {
                created_at: {
                    $lt: date
                }
            }
        });

        return result;
    } catch (error) {
        console.error('Error in deleteOldActivities:', error);
        throw error;
    }
};
