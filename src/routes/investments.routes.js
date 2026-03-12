import express from 'express';
import {
    showStock,
    getPortfolioValue,
    buyStock,
    sellStock
} from '../controllers/investments.controller.js';

const router = express.Router();

/**
 * GET /api/investments/show?symbol=AAPL
 */
router.get('/show', showStock);

/**
 * GET /api/investments/getPortfolio
 */
router.get('/getPortfolio', getPortfolioValue);

/**
 * POST /api/investments/buy
 * body {
 *  "symbol": "AAPL",
 *  "shares": 5
 * }
 */
router.post('/buy', buyStock);

/**
 * POST /api/investments/buy
 * body {
 *  "symbol": "AAPL",
 *  "shares": 5
 * }
 */
router.post('/sell', sellStock);

export default router;