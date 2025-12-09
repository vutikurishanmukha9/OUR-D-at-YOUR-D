import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

interface JwtPayload {
    id: string;
    email: string;
    name: string;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for token in Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Not authorized, no token provided'
            });
            return;
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User no longer exists'
            });
            return;
        }

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Not authorized, token invalid'
        });
    }
};

// Optional auth - doesn't fail if no token, but attaches user if valid token
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const jwtSecret = process.env.JWT_SECRET;
            if (jwtSecret) {
                const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name
                };
            }
        }

        next();
    } catch (error) {
        // Token invalid, but continue without user
        next();
    }
};
