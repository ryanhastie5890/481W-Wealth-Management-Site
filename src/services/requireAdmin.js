export default function requireAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    }
    return res.status(403).send("Admins only");
}
