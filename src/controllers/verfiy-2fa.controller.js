export async function verify2FA(req, res) {
  console.log("verify2FA route HIT");

  const { code } = req.body;
  const pendingId = req.session.pending2FAUserId;

  if (!pendingId) {
    return res.json({
      success: false,
      message: "Session expired. Please log in again."
    });
  }

  dbCon.query(
    "SELECT * FROM users WHERE id = ?",
    [pendingId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({
          success: false,
          message: "Invalid session. Please log in again."
        });
      }

      const user = results[0];

      const now = new Date();
      const expires = user.two_factor_expires
        ? new Date(user.two_factor_expires)
        : null;

      if (
        !user.two_factor_code ||
        !expires ||
        now > expires ||
        user.two_factor_code !== code
      ) {
        return res.json({
          success: false,
          message: "Invalid or expired code"
        });
      }

      dbCon.query(
        "UPDATE users SET two_factor_code = NULL, two_factor_expires = NULL WHERE id = ?",
        [user.id]
      );

      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.role = user.role;
      req.session.displayName = user.display_name;
      delete req.session.pending2FAUserId;

      return res.json({ success: true });
    }
  );
}
