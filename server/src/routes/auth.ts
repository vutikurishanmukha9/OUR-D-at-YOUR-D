import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Generate JWT Token
const generateToken = (user: { _id: any; email: string; name: string }): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            res.status(400).json({
                success: false,
                error: 'Please provide all required fields: name, email, password, phone'
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
            return;
        }

        // Create new user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
            return;
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    })
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get(
    '/me',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await User.findById(req.user?.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    })
);

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put(
    '/update',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user?.id,
            { name, phone },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    })
);

export default router;
