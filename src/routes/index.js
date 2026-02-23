/**
 * FILE FOR ADDING API ROUTES
 * Import and attach your route files below
 */
import express from 'express';

// Import the route file here
import authRoutes from './auth.routes.js';
import sessionRoutes from './session.routes.js';
import investmentsRoutes from './investments.routes.js';
import realEstateRoutes from './realEstate.routes.js';
import retirementRoutes from './retirement.routes.js';

const router = express.Router();

// Set the API endpoint for route here
router.use('/auth', authRoutes);
router.use('/session', sessionRoutes);
router.use('/investments', investmentsRoutes);
router.use('/realEstate',realEstateRoutes);
router.use('/retirement', retirementRoutes);

export default router;