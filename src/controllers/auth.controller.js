import bcrypt from 'bcrypt';                // password hashing
import { dbCon } from '../db/database.js';     // connect to DB to run queries
import { send2FACode } from '../services/emailService.js';

/*
*   register new user in the database, error if the user already exists
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
              return res.json({ success: false, error: "Invalid credentials" });
            }

            const user = results[0];

            if (user.locked === 1) {
                return res.json({ success: false, error: "Your account is locked. Contact an administrator." });
            }

            const match = await bcrypt.compare(password, user.password_hash);

            if (!match) {
                return res.json({ success: false, error: "Invalid credentials" });
            }

            // If 2FA is not enabled, do normal login
            if (!user.two_factor_enabled) {
                req.session.userId = user.id;
                req.session.email = user.email;
                req.session.role = user.role;
                req.session.displayName = user.display_name;
                return res.json({ success: true });
            }

            // 2FA enabled: generate code, email it, store it
            const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
            const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

            dbCon.query(
              "UPDATE users SET two_factor_code = ?, two_factor_expires = ? WHERE id = ?",
              [code, expires, user.id],
              async (updateErr) => {
                if (updateErr) {
                  console.error(updateErr);
                  return res.json({ success: false, error: "Error generating 2FA code" });
                }

                try {
                  await send2FACode(user.email, code);
                } catch (mailErr) {
                  console.error(mailErr);
                  return res.json({ success: false, error: "Error sending 2FA code" });
                }

                // Store user id in session for 2FA step, but don't fully log in yet
                req.session.pending2FAUserId = user.id;
                return res.json({ requires2FA: true });
              }
            );
        }
    );
}

export async function verify2FA(req, res) {
    const { code } = req.body;
    const pendingId = req.session.pending2FAUserId;

    if (!pendingId) {
        return res.json({ success: false, message: "Session expired. Please log in again." });
    }

    dbCon.query(
      "SELECT * FROM users WHERE id = ?",
      [pendingId],
      (err, results) => {
        if (err || results.length === 0) {
          return res.json({ success: false, message: "Invalid session. Please log in again." });
        }

        const user = results[0];

        const now = new Date();
        const expires = user.two_factor_expires ? new Date(user.two_factor_expires) : null;

        if (!user.two_factor_code || !expires || now > expires || user.two_factor_code !== code) {
          return res.json({ success: false, message: "Invalid or expired code" });
        }

        // Clear 2FA fields
        dbCon.query(
          "UPDATE users SET two_factor_code = NULL, two_factor_expires = NULL WHERE id = ?",
          [user.id]
        );

        // Complete login
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.role = user.role;
        req.session.displayName = user.display_name;
        delete req.session.pending2FAUserId;

        return res.json({ success: true });
      }
    );
}

export async function get2FAStatus(req, res) {
  if (!req.session.userId) {
    return res.json({ success: false, error: "Not logged in" });
  }

  dbCon.query(
    "SELECT two_factor_enabled FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, error: "User not found" });
      }

      return res.json({
        success: true,
        enabled: results[0].two_factor_enabled === 1
      });
    }
  );
}

export async function set2FAStatus(req, res) {
  if (!req.session.userId) {
    return res.json({ success: false, error: "Not logged in" });
  }

  const { enabled } = req.body;

  dbCon.query(
    "UPDATE users SET two_factor_enabled = ? WHERE id = ?",
    [enabled ? 1 : 0, req.session.userId],
    (err) => {
      if (err) {
        return res.json({ success: false, error: "Database error" });
      }

      return res.json({ success: true });
    }
  );
}

/*
*   log user out destroying the current session and user cookie information
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
