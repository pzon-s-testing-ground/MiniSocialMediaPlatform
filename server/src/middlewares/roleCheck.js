export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

export const requireModOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Moderator')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Moderators/Admins only.' });
    }
};
