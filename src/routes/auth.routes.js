import express from 'express';
import {
  registerUser,
  loginUser,
  logout,
  verify2FA,
  get2FAStatus,
  set2FAStatus
} from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/register
router.post('/register', registerUser);
// POST /api/login
router.post('/login', loginUser);
// POST /api/logout
router.post('/logout', logout);
// POST /api/verify-2fa
router.post('/verify-2fa', verify2FA);


router.get("/get-2fa-status", get2FAStatus);
router.post("/set-2fa-status", set2FAStatus);

export default router;