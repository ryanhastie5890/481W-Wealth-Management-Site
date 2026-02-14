import express from 'express';
import {
    showStock,
    buyStock
} from '../controllers/investments.controller.js';

const router = express.Router();

/**
 * GET /api/investments/show?symbol=AAPL
 */
router.get('/show', showStock);

/**
 * POST /api/investments/buy
 * body {
 *  "userId": 12,
 *  "symbol": "AAPL",
 *  "shares": 5
 * }
 */
router.post('/buy', buyStock);

export default router;