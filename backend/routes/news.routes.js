import express from 'express';
import newsController from '../controllers/news.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', newsController.getAllNews);
router.get('/latest', newsController.getLatestNews);
router.get('/category/:category', newsController.getNewsByCategory);
router.post('/:id/views', newsController.incrementNewsViews);
router.get('/:slug', newsController.getNewsBySlug);

// Admin routes
router.post('/', verifyToken, isAdmin, newsController.createNews);
router.get('/admin/all', verifyToken, isAdmin, newsController.getAllNewsAdmin);
router.put('/:id', verifyToken, isAdmin, newsController.updateNews);
router.delete('/:id', verifyToken, isAdmin, newsController.deleteNews);
router.put('/:id/publish', verifyToken, isAdmin, newsController.publishNews);
router.put('/:id/unpublish', verifyToken, isAdmin, newsController.unpublishNews);

export default router;
