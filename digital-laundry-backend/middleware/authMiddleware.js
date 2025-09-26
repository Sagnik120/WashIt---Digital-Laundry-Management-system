import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log(token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        // console.log(token)
        // console.log(process.env.ACCESS_TOKEN_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret-key');
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

};




export default authMiddleware;