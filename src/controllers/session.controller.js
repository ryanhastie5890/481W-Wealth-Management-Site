// Server side sessions.
export async function sessionMessage(req, res) {
    const msg = req.session.message || "";
    req.session.message = null; // clear message after reading
    res.send(msg);
}

// Get session info
export async function getSession(req, res) {
    // Get user email
    if (req.session.userId != null) {
        res.json({
            loggedIn: true,
            userId: req.session.userId,
            email: req.session.email
        });
    }
    else {
        res.json({
            loggedIn: false
        });
    }
}