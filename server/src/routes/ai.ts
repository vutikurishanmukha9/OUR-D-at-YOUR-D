import express, { Router, Response } from 'express';
import Consultation from '../models/Consultation';
import { asyncHandler } from '../middleware/errorHandler';
import { optionalAuth, protect, AuthRequest } from '../middleware/auth';
import { analyzeSymptoms, testGeminiConnection } from '../services/geminiService';

const router: Router = express.Router();

// @route   POST /api/ai/analyze
// @desc    Analyze symptoms using Gemini AI
// @access  Public (guest) or Private (logged in user)
router.post(
    '/analyze',
    optionalAuth,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { symptoms } = req.body;

        // Validation
        if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 5) {
            res.status(400).json({
                success: false,
                error: 'Please provide a detailed description of your symptoms (at least 5 characters)'
            });
            return;
        }

        // Analyze symptoms using Gemini AI
        const analysisResult = await analyzeSymptoms(symptoms.trim());

        // Save consultation to database
        const consultation = await Consultation.create({
            user: req.user?.id || null,
            symptoms: symptoms.trim(),
            ayurvedicMedicines: analysisResult.ayurvedicMedicines,
            allopathicMedicines: analysisResult.allopathicMedicines,
            aiAnalysis: analysisResult.aiAnalysis,
            isGuestConsultation: !req.user
        });

        res.status(200).json({
            success: true,
            data: {
                id: consultation._id,
                symptoms: consultation.symptoms,
                aiAnalysis: analysisResult.aiAnalysis,
                severity: analysisResult.severity,
                seekEmergencyCare: analysisResult.seekEmergencyCare,
                ayurvedicMedicines: analysisResult.ayurvedicMedicines,
                allopathicMedicines: analysisResult.allopathicMedicines,
                createdAt: consultation.createdAt,
                disclaimer: 'This is AI-generated advice for informational purposes only. Please consult a qualified healthcare professional for proper diagnosis and treatment.'
            }
        });
    })
);

// @route   GET /api/ai/consultations
// @desc    Get consultation history for logged in user
// @access  Private
router.get(
    '/consultations',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const consultations = await Consultation.find({ user: req.user?.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: consultations.length,
            data: consultations
        });
    })
);

// @route   GET /api/ai/consultations/:id
// @desc    Get single consultation
// @access  Private
router.get(
    '/consultations/:id',
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const consultation = await Consultation.findOne({
            _id: req.params.id,
            user: req.user?.id
        });

        if (!consultation) {
            res.status(404).json({
                success: false,
                error: 'Consultation not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: consultation
        });
    })
);

// @route   GET /api/ai/health
// @desc    Check AI service health
// @access  Public
router.get(
    '/health',
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const isGeminiConnected = await testGeminiConnection();

        res.status(200).json({
            success: true,
            data: {
                status: 'operational',
                geminiConnected: isGeminiConnected,
                timestamp: new Date().toISOString()
            }
        });
    })
);

export default router;
