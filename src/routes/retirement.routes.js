import express from 'express';
import { testRetirement } from '../controllers/retirement.controller.js';

const router = express.Router();

router.post('/test', testRetirement);

export default router;