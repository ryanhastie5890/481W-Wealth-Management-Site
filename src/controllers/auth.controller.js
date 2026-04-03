import bcrypt from 'bcrypt';                // password hashing
import { dbCon } from '../db/database.js';     // connect to DB to run queries

/*
*   register new user in the database, error if the user already exists
*   FIX ME: password restrictions? 2-factor?
*/
export async function registerUser(req, res) {
    const { email, password, role, displayName } = req.body;   // <-- added role here

    // basic role validation (only allow 'admin' or 'user')
    const safeRole = role === 'admin' ? 'admin' : 'user';   // <-- added

    try {
        const hash = await bcrypt.hash(password, 10);
        dbCon.query(
            "INSERT INTO users (email, password_hash, role, display_name) VALUES (?, ?, ?, ?)",   // updated query
            [email, hash, safeRole, displayName],                                             // added safeRole and displayName
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

/*
*   if user exists in the database, log them in and store user.id & user.email
*   otherwise respond with an error message.
*/
export async function loginUser(req, res) {
    const { email, password } = req.body;
    dbCon.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err || results.length === 0) {
              req.session.message = "Invalid credentials";
              return res.redirect('/');
            }

            const user = results[0];

            if (user.locked === 1) {
                req.session.message = "Your account is locked. Contact an administrator.";
                return res.redirect('/');
            }

            const match = await bcrypt.compare(password, user.password_hash);

            if (!match) {
                req.session.message = "Invalid credentials";
                return res.redirect('/');
            }

            req.session.userId = user.id; // store logged-in userid in session
            req.session.email = user.email;  // store logged-in user email in session
            req.session.role = user.role;    // store role in session
            req.session.displayName = user.display_name; // store display name in session
            req.session.message = "Login successful!";
            return res.redirect('/index.html');
        }
    );
}


/*
*   log user out destroying the currrent session and user cookie information
*/ 
export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    res.json({ success: true });
  })
}
