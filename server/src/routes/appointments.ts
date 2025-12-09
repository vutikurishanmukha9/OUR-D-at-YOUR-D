import express, { Router, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { asyncHandler } from '../middleware/errorHandler';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for current user
// @access  Private
router.get(
    '/',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const appointments = await Appointment.find({ user: req.user?.id })
            .populate('doctor', 'name specialty image')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    })
);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post(
    '/',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { doctorId, date, time, type, symptoms } = req.body;

        // Validation
        if (!doctorId || !date || !time) {
            res.status(400).json({
                success: false,
                error: 'Please provide doctorId, date, and time'
            });
            return;
        }

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
            return;
        }

        // Check if doctor is available
        if (!doctor.available) {
            res.status(400).json({
                success: false,
                error: 'Doctor is currently not available for appointments'
            });
            return;
        }

        // Check for conflicting appointments
        const conflictingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (conflictingAppointment) {
            res.status(400).json({
                success: false,
                error: 'This time slot is already booked'
            });
            return;
        }

        // Create appointment
        const appointment = await Appointment.create({
            user: req.user?.id,
            doctor: doctorId,
            doctorName: doctor.name,
            date: new Date(date),
            time,
            type: type || 'consultation',
            symptoms: symptoms || '',
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    })
);

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get(
    '/:id',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            user: req.user?.id
        }).populate('doctor', 'name specialty image phone email');

        if (!appointment) {
            res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    })
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment (reschedule or add notes)
// @access  Private
router.put(
    '/:id',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { date, time, notes, symptoms } = req.body;

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            user: req.user?.id
        });

        if (!appointment) {
            res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
            return;
        }

        // Only allow updates if not completed or cancelled
        if (['completed', 'cancelled'].includes(appointment.status)) {
            res.status(400).json({
                success: false,
                error: 'Cannot update a completed or cancelled appointment'
            });
            return;
        }

        // Update fields
        if (date) appointment.date = new Date(date);
        if (time) appointment.time = time;
        if (notes) appointment.notes = notes;
        if (symptoms) appointment.symptoms = symptoms;

        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment
        });
    })
);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete(
    '/:id',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            user: req.user?.id
        });

        if (!appointment) {
            res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
            return;
        }

        // Instead of deleting, mark as cancelled
        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    })
);

export default router;
