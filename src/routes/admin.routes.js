import express from 'express';
import { dbCon } from '../db/database.js';
import requireAdmin from '../services/requireAdmin.js';

const router = express.Router();

router.get('/users', requireAdmin, (req, res) => {
    dbCon.query(
        "SELECT id, email, role, display_name, locked FROM users WHERE role = 'user'",
        (err, results) => {
            if (err) return res.status(500).send("Database error");
            res.json(results);
        }
    );
});

router.delete('/users/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;

    dbCon.query(
        "DELETE FROM users WHERE id = ? AND role = 'user'",
        [userId],
        (err, result) => {
            if (err) return res.status(500).send("Database error");
            res.json({ success: true });
        }
    );
});

router.put('/users/:id/lock', (req, res) => {
  const { id } = req.params;
  const { locked } = req.body;

  dbCon.query(
    "UPDATE users SET locked = ? WHERE id = ?",
    [locked ? 1 : 0, id],
    (err) => {
      if (err) {
        console.error("MYSQL UPDATE ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    }
  );
});


export default router;
