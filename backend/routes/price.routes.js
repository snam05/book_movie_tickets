import express from 'express';
import priceController from '../controllers/price.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', priceController.getAllPrices);
router.get('/seat-type/:seatType', priceController.getPriceBySeatType);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, priceController.getAllPricesAdmin);
router.get('/:id', verifyToken, isAdmin, priceController.getPriceById);
router.post('/', verifyToken, isAdmin, priceController.createPrice);
router.put('/:id', verifyToken, isAdmin, priceController.updatePrice);
router.delete('/:id', verifyToken, isAdmin, priceController.deletePrice);

export default router;
