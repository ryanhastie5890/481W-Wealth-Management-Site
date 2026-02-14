import express from 'express';
import { dbCon } from '../db/database.js';
import requireAdmin from '../services/requireAdmin.js';

const router = express.Router();

router.get('/users', requireAdmin, (req, res) => {
    dbCon.query(
        "SELECT id, email, role FROM users WHERE role = 'user'",
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

export default router;
