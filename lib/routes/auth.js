import express from 'express';              // main web framework for HTML/CSS/JS, handling POST/GET requests.
import bcrypt from 'bcrypt';                // password hashing
import { dbCon } from '../../database.js';  // connect to DB to run queries

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    dbCon.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hash],
      (err) => {
        if (err) {
          console.error("MYSQL INSERT ERROR:", err);
          req.session.message = "User already exists";
          return res.redirect('/');
        }
        req.session.message = "Registration successful";
        return res.redirect('/');
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  dbCon.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) return res.status(401).send("Invalid credentials");

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        req.session.message = "Invalid credentials";
        return res.redirect('/');
      }
      req.session.userId = user.id; // store logged-in userid in session
      req.session.email = user.email;  // store logged-in user email in session
      req.session.message = "Login successful!";
      return res.redirect('/');
    }
  );
});

export default router;