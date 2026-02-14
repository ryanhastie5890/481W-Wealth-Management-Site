export default function requireAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }

    if (req.path === '/admin.html' && req.session.role !== 'admin') {
    return res.redirect('/index.html');
    }

    // Allow auth + public assets
    if (
        req.path === '/login.html' ||
        req.path.startsWith('/css/') ||
        req.path.startsWith('/js/') ||
        req.path.startsWith('/api/auth/') ||
        req.path.startsWith('/api/session/')
    ) {
        return next();
    }

    return res.redirect('/login.html');
}
