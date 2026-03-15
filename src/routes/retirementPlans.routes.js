import express from 'express';
import {
  createPlan,
  getPlans,
  deletePlan
} from '../controllers/retirementPlans.controller.js';

const router = express.Router();

// POST /api/retirementPlans/add
router.post('/add', createPlan);
// GET /api/retirementPlans
router.get('/', getPlans);
// POST /api/retirementPlans/delete
router.delete('/:id', deletePlan);

export default router;