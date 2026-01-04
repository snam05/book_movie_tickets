// controllers/activity.controller.js

import * as activityService from '../services/activity.service.js';

/**
 * GET /api/v1/activities
 * Lấy danh sách hoạt động với pagination
 */
export const getActivities = async (req, res) => {
    try {
        const { page = 1, limit = 20, userId, action, resource, startDate, endDate } = req.query;

        const filters = {};
        if (userId) filters.userId = parseInt(userId);
        if (action) filters.action = action;
        if (resource) filters.resource = resource;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const result = await activityService.getActivities(
            parseInt(page),
            parseInt(limit),
            filters
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getActivities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activities',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/activities/:id
 * Lấy chi tiết một hoạt động
 */
export const getActivityById = async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await activityService.getActivityById(id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Error in getActivityById:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/activities/statistics/summary
 * Lấy thống kê hoạt động
 */
export const getActivityStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const statistics = await activityService.getActivityStatistics(startDate, endDate);

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        console.error('Error in getActivityStatistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity statistics',
            error: error.message
        });
    }
};

/**
 * DELETE /api/v1/activities/cleanup/old
 * Xóa hoạt động cũ
 */
export const deleteOldActivities = async (req, res) => {
    try {
        const { daysOld = 30 } = req.body;

        const deletedCount = await activityService.deleteOldActivities(parseInt(daysOld));

        res.status(200).json({
            success: true,
            message: `Deleted ${deletedCount} old activities`,
            deletedCount
        });
    } catch (error) {
        console.error('Error in deleteOldActivities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete old activities',
            error: error.message
        });
    }
};
