import express from 'express';
import { addRetirementAccount } from '../controllers/retirement.controller.js';

const router = express.Router();

router.post('/add', addRetirementAccount);

export default router;