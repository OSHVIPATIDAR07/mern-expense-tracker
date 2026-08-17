// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
};

export default authMiddleware;