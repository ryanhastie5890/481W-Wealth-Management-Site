import express from 'express';
import {
  registerUser,
  loginUser,
  logout
} from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/register
router.post('/register', registerUser);
// POST /api/login
router.post('/login', loginUser);
// POST /api/logout
router.post('/logout', logout);

export default router;