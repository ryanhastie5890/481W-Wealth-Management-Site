import bcrypt from 'bcrypt';                // password hashing
import { dbCon } from '../db/database.js';     // connect to DB to run queries

export async function registerUser(req, res) {
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
}

export async function loginUser(req, res) {
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
}