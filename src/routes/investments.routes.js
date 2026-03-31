import express from 'express';
import {
    showStock,
    getPortfolio,
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
 * GET /api/investments/getPortfolioValue
 */
router.get('/getPortfolioValue', getPortfolioValue);

/**
 * GET /api/investments/getPortfolio
 */
router.get('/getPortfolio', getPortfolio);

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