import express, { Router, Request, Response } from 'express';
import Doctor from '../models/Doctor';
import { asyncHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors with optional filtering
// @access  Public
router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const { specialty, available, search } = req.query;

        // Build query
        const query: any = {};

        if (specialty && specialty !== 'all') {
            query.specialty = { $regex: specialty, $options: 'i' };
        }

        if (available === 'true') {
            query.available = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await Doctor.find(query).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    })
);

// @route   GET /api/doctors/:id
// @desc    Get single doctor by ID
// @access  Public
router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    })
);

// @route   GET /api/doctors/specialties
// @desc    Get list of all specialties
// @access  Public
router.get(
    '/meta/specialties',
    asyncHandler(async (req: Request, res: Response) => {
        const specialties = await Doctor.distinct('specialty');

        res.status(200).json({
            success: true,
            data: specialties
        });
    })
);

export default router;
