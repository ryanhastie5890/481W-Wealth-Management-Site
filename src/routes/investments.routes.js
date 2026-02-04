import express from 'express';
import {
    showStock
} from '../controllers/investments.controller.js';

const router = express.Router();

/**
 * POST /api/investments/show
 */
router.post('/show', showStock);

export default router;