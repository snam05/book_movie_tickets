// middleware/activity-logger.middleware.js

import * as activityService from '../services/activity.service.js';

/**
 * Middleware để ghi log hoạt động của user
 */
export const activityLogger = () => {
    return (req, res, next) => {
        const startTime = Date.now();

        // Override res.json để capture response
        const originalJson = res.json;
        
        res.json = function(data) {
            const responseTime = Date.now() - startTime;
            
            // Log vào background (không chờ)
            logRequestActivity(req, res, data, responseTime).catch(err => {
                console.error('Activity logging error:', err);
            });

            return originalJson.call(this, data);
        };

        next();
    };
};

/**
 * Hàm helper để log hoạt động
 */
const logRequestActivity = async (req, res, responseData, responseTime) => {
    try {
        // Chỉ log các hoạt động quan trọng
        const skipPaths = [
            '/health', 
            '/metrics', 
            '/activities',      // Bỏ qua tất cả activities endpoints
            '/auth/verify',
            '/count',           // Bỏ qua các endpoint count
            '/summary'          // Bỏ qua các endpoint summary
        ];
        
        const fullUrl = req.originalUrl || req.url || req.path;
        if (skipPaths.some(path => fullUrl.includes(path))) {
            return;
        }

        let userId = req.user?.id || null;
        const method = req.method;
        const endpoint = req.originalUrl || req.path;
        const statusCode = res.statusCode;

        // Parse full path ngay từ đầu
        const fullPath = req.originalUrl.split('?')[0]; // Bỏ query string
        const pathParts = fullPath.split('/').filter(p => p);

        // Chỉ log các hoạt động sau:
        // 1. Login/Logout/Register
        // 2. Truy cập trang quản lý admin (GET với resource chính: users, bookings, movies, theaters, showtimes, genres)
        // 3. Xem thống kê (GET với endpoint /stats, /statistics, /revenue)
        // 4. Các thao tác tạo/sửa/xóa (POST/PUT/PATCH/DELETE)
        
        const isAuthEndpoint = fullUrl.includes('/auth/signin') || fullUrl.includes('/auth/signout') || 
                               fullUrl.includes('/auth/logout') || fullUrl.includes('/auth/login') || 
                               fullUrl.includes('/auth/register') || fullUrl.includes('/auth/signup') ||
                               fullUrl.includes('/auth/change-password');
        
        // Chỉ log GET requests cho:
        // - Admin endpoints: /api/v1/admin/users, /api/v1/admin/bookings
        // - Resource endpoints chính: /api/v1/movies, /api/v1/genres, /api/v1/theaters, /api/v1/showtimes, /api/v1/bookings (không có admin prefix)
        // - Statistics endpoints: bất kỳ endpoint nào kết thúc bằng /stats, /statistics, /revenue
        const lastPart = pathParts[pathParts.length - 1];
        const isStatsEndpoint = ['stats', 'statistics', 'revenue'].includes(lastPart);
        
        // Xác định resource từ path
        let resourceName = null;
        if (pathParts[2] === 'admin' && pathParts.length >= 4) {
            resourceName = pathParts[3]; // /api/v1/admin/users → users
        } else if (pathParts.length >= 3) {
            resourceName = pathParts[2]; // /api/v1/movies → movies
        }
        
        const isResourceEndpoint = ['users', 'bookings', 'movies', 'theaters', 'showtimes', 'genres'].includes(resourceName);
        const isAdminEndpoint = fullUrl.includes('/api/v1/admin/');
        
        const isModifyingAction = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
        
        // Bỏ qua nếu không phải các hoạt động quan trọng
        if (!isAuthEndpoint && !isStatsEndpoint && !isResourceEndpoint && !isModifyingAction) {
            return;
        }
        
        // Với GET requests, chỉ log nếu có user đăng nhập
        if (method === 'GET' && !userId) {
            return;
        }

        // Xác định action và resource từ endpoint
        let action = 'VIEW';
        let resource = 'UNKNOWN';
        let resourceId = null;
        let description = '';
        let metadata = {};
        
        // Chuẩn hóa tên resource
        const resourceMap = {
            'bookings': 'Booking',
            'movies': 'Movie',
            'theaters': 'Theater',
            'showtimes': 'Showtime',
            'users': 'User',
            'genres': 'Genre',
            'auth': 'Auth'
        };
        
        // Xử lý login/logout/register
        if (isAuthEndpoint) {
            if (fullUrl.includes('/signin') || fullUrl.includes('/login')) {
                action = 'LOGIN';
                resource = 'Auth';
                // Lấy userId từ response data nếu login thành công
                if (statusCode === 200 && responseData?.data?.id) {
                    userId = responseData.data.id;
                    const userEmail = responseData.data.email || responseData.data.full_name || `ID: ${userId}`;
                    description = `Người dùng ${userEmail} đăng nhập`;
                } else {
                    description = `Đăng nhập không thành công`;
                }
                // KHÔNG gán metadata cho login để tránh log mật khẩu
            } else if (fullUrl.includes('/signout') || fullUrl.includes('/logout')) {
                action = 'LOGOUT';
                resource = 'Auth';
                // Lấy userId từ response data nếu logout thành công
                if (statusCode === 200 && responseData?.data?.id) {
                    userId = responseData.data.id;
                }
                // Sau đó check nếu có userId thì hiển thị
                if (userId) {
                    description = `Người dùng ID: ${userId} đăng xuất`;
                } else {
                    description = `Người dùng đăng xuất`;
                }
                // KHÔNG gán metadata cho logout
            } else if (fullUrl.includes('/register') || fullUrl.includes('/signup')) {
                action = 'CREATE';
                resource = 'Auth';
                // Lấy userId từ response data nếu đăng ký thành công
                if (statusCode === 201 && responseData?.data?.id) {
                    userId = responseData.data.id;
                    const userEmail = responseData.data.email || `ID: ${userId}`;
                    description = `Người dùng ${userEmail} đăng ký tài khoản`;
                } else {
                    description = `Đăng ký tài khoản`;
                }
                // KHÔNG gán metadata cho register để tránh log mật khẩu
            } else if (fullUrl.includes('/change-password')) {
                action = 'UPDATE_PASSWORD';
                resource = 'Auth';
                description = `Người dùng đổi mật khẩu`;
                // KHÔNG gán metadata để tránh log mật khẩu
            } else {
                resource = 'Auth';
            }
        } else if (pathParts.length >= 3) {
            // Xử lý các endpoint khác
            // Xác định resource name và base index
            let baseIndex = 2;
            if (pathParts[2] === 'admin' && pathParts.length >= 4) {
                resourceName = pathParts[3]; // /api/v1/admin/users → users
                baseIndex = 3;
            } else {
                resourceName = pathParts[2]; // /api/v1/movies → movies
            }
            
            resource = resourceMap[resourceName] || resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
            
            if (method === 'GET') {
                // Kiểm tra endpoint cuối cùng
                const lastPart = pathParts[pathParts.length - 1];
                const isStatsEndpoint = ['stats', 'statistics', 'revenue'].includes(lastPart);
                
                if (isStatsEndpoint) {
                    // Endpoint thống kê: /api/v1/admin/users/stats
                    // CHỈ log nếu KHÔNG có VIEW request gần đây (trong 5s)
                    // Vì thường frontend sẽ gọi cả list và stats cùng lúc
                    const viewKey = `view-${userId}-${resource}`;
                    const lastViewTime = global.recentViews?.get(viewKey);
                    const now = Date.now();
                    
                    // Nếu vừa có VIEW request trong 5s qua, bỏ qua stats request
                    if (lastViewTime && (now - lastViewTime) < 5000) {
                        return;
                    }
                    
                    // Nếu không có VIEW gần đây, log stats
                    action = 'VIEW_STATISTICS';
                    description = `Xem thống kê ${resource}`;
                    
                    // Debounce cho stats
                    const statsKey = `stats-${userId}-${resource}`;
                    const lastStatsTime = global.recentViews?.get(statsKey);
                    
                    if (lastStatsTime && (now - lastStatsTime) < 30000) {
                        return;
                    }
                    
                    if (!global.recentViews) global.recentViews = new Map();
                    global.recentViews.set(statsKey, now);
                    
                    // Cleanup
                    for (const [key, timestamp] of global.recentViews.entries()) {
                        if (now - timestamp > 60000) global.recentViews.delete(key);
                    }
                } else if (pathParts.length >= baseIndex + 2 && !isNaN(parseInt(pathParts[baseIndex + 1]))) {
                    // Endpoint chi tiết: /api/v1/movies/123
                    action = 'VIEW';
                    resourceId = parseInt(pathParts[baseIndex + 1]);
                    description = `Xem chi tiết ${resource} #${resourceId}`;
                } else {
                    // Endpoint danh sách: /api/v1/movies, /api/v1/admin/users
                    action = 'VIEW';
                    description = `Truy cập trang quản lý ${resource}`;
                    
                    // Debounce
                    const viewKey = `view-${userId}-${resource}`;
                    const lastViewTime = global.recentViews?.get(viewKey);
                    const now = Date.now();
                    
                    if (lastViewTime && (now - lastViewTime) < 30000) {
                        return;
                    }
                    
                    if (!global.recentViews) global.recentViews = new Map();
                    global.recentViews.set(viewKey, now);
                    
                    // Cleanup
                    for (const [key, timestamp] of global.recentViews.entries()) {
                        if (now - timestamp > 60000) global.recentViews.delete(key);
                    }
                }
            } else if (method === 'POST') {
                // Kiểm tra xem có phải là endpoint đặc biệt không
                if (pathParts[baseIndex + 2] === 'password') {
                    action = 'UPDATE_PASSWORD';
                    resourceId = parseInt(pathParts[baseIndex + 1]);
                    description = `Đặt lại mật khẩu cho ${resource} #${resourceId}`;
                } else {
                    action = 'CREATE';
                    description = `Tạo mới ${resource}`;
                }
                metadata = req.body || {};
            } else if (method === 'PUT' || method === 'PATCH') {
                // Kiểm tra các endpoint đặc biệt
                if (pathParts.length > baseIndex + 2 && pathParts[baseIndex + 2] === 'role') {
                    action = 'UPDATE_ROLE';
                    resourceId = parseInt(pathParts[baseIndex + 1]);
                    const newRole = req.body?.role || 'unknown';
                    description = `Thay đổi quyền của ${resource} #${resourceId} thành ${newRole}`;
                    metadata = { role: newRole, previous_role: req.body?.previous_role };
                } else if (pathParts.length >= baseIndex + 2 && !isNaN(parseInt(pathParts[baseIndex + 1]))) {
                    action = 'UPDATE';
                    resourceId = parseInt(pathParts[baseIndex + 1]);
                    description = `Cập nhật ${resource} #${resourceId}`;
                    metadata = req.body || {};
                } else {
                    action = 'UPDATE';
                    description = `Cập nhật ${resource}`;
                    metadata = req.body || {};
                }
            } else if (method === 'DELETE') {
                action = 'DELETE';
                if (pathParts.length >= baseIndex + 2 && !isNaN(parseInt(pathParts[baseIndex + 1]))) {
                    resourceId = parseInt(pathParts[baseIndex + 1]);
                    description = `Xóa ${resource} #${resourceId}`;
                } else {
                    description = `Xóa ${resource}`;
                }
            }
        }

        // Log hoạt động
        await activityService.logActivity({
            userId,
            action,
            resource,
            resourceId,
            description,
            metadata: Object.keys(metadata).length > 0 ? metadata : null,
            method,
            endpoint,
            statusCode,
            userAgent: req.headers['user-agent'],
            req,
            responseTime
        });
    } catch (error) {
        console.error('Error in logRequestActivity:', error);
    }
};

/**
 * Middleware để log các action cụ thể
 */
export const logActivityAction = (action, resource, getResourceId = null, getDescription = null, getMetadata = null) => {
    return async (req, res, next) => {
        // Lưu thông tin để dùng sau khi request hoàn thành
        req.activityLog = {
            action,
            resource,
            getResourceId,
            getDescription,
            getMetadata
        };
        
        const originalJson = res.json;
        
        res.json = function(data) {
            const resourceId = req.activityLog.getResourceId ? req.activityLog.getResourceId(req, res, data) : null;
            const description = req.activityLog.getDescription ? req.activityLog.getDescription(req, res, data) : `${action} ${resource}`;
            const metadata = req.activityLog.getMetadata ? req.activityLog.getMetadata(req, res, data) : data;

            // Log hoạt động
            activityService.logActivity({
                userId: req.user?.id || null,
                action,
                resource,
                resourceId,
                description,
                metadata,
                method: req.method,
                endpoint: req.originalUrl || req.path,
                statusCode: res.statusCode,
                userAgent: req.headers['user-agent'],
                req,
                responseTime: Date.now() - (req.activityStartTime || 0)
            }).catch(err => {
                console.error('Activity logging error:', err);
            });

            return originalJson.call(this, data);
        };

        // Record start time
        req.activityStartTime = Date.now();
        next();
    };
};
