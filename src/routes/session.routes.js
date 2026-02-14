import express from 'express';
import {
  sessionMessage,
  getSession
} from '../controllers/session.controller.js';

const router = express.Router();

router.get('/getSession', getSession);
router.get('/sessionMessage', sessionMessage);

export default router;
