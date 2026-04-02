import express from 'express';
import {
  sessionMessage,
  getSession
} from '../controllers/session.controller.js';

import { dbCon } from '../db/database.js';

const router = express.Router();

// GET /api/session/getSession
router.get('/getSession', getSession);

// GET /api/session/sessionMessage
router.get('/sessionMessage', sessionMessage);

// PUT /api/session/displayname
router.put('/displayname', (req, res) => {
  console.log("HIT /api/session/displayname"); // debug

  const { displayName } = req.body;

  if (!req.session.userId) {
    console.log("NO SESSION USER ID");
    return res.status(401).json({ error: "Not logged in" });
  }

  dbCon.query(
    "UPDATE users SET display_name = ? WHERE id = ?",
    [displayName, req.session.userId],
    (err) => {
      if (err) {
        console.error("MYSQL UPDATE ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      req.session.displayName = displayName;
      res.json({ success: true });
    }
  );
});

export default router;
