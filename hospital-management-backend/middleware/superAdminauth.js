    const superAdminAuth = (req, res, next) => {
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };

    module.exports = superAdminAuth;
