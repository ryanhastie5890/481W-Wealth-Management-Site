import express from 'express';
import { 
  addRetirementAccount, 
  getRetirementAccounts,
  updateRetirementAccount 
} from '../controllers/retirement.controller.js';

const router = express.Router();

// POST /api/retirement/add
router.post('/add', addRetirementAccount);
// GET /api/retirement
router.get('/', getRetirementAccounts);
// UPDATE /api/retirement/update
router.put('/update', updateRetirementAccount);

export default router;