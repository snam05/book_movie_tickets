// routes/activity.routes.js

import express from 'express';
import * as activityController from '../controllers/activity.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes yêu cầu authentication
router.use(verifyToken);

// GET /api/v1/activities - Lấy danh sách hoạt động
router.get('/', activityController.getActivities);

// GET /api/v1/activities/statistics/summary - Lấy thống kê hoạt động
router.get('/statistics/summary', activityController.getActivityStatistics);

// GET /api/v1/activities/:id - Lấy chi tiết hoạt động
router.get('/:id', activityController.getActivityById);

// DELETE /api/v1/activities/cleanup/old - Xóa hoạt động cũ
router.delete('/cleanup/old', activityController.deleteOldActivities);

export default router;
