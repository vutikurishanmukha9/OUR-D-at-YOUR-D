import express from 'express';
import Medicine from '../models/Medicine';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/medicines
// @desc    Search medicines by name or description
// @access  Private (or Public based on requirements, making it Public for now so guests can search)
router.get('/', async (req, res) => {
    try {
        const { query, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        let searchCriteria = {};
        if (query) {
            searchCriteria = {
                $text: { $search: String(query) }
            };
        }

        // If simple search gives no results or no query, simple regex match on name for partial
        if (query && Object.keys(searchCriteria).length > 0) {
            const count = await Medicine.countDocuments(searchCriteria);
            // If text search is empty but query exists, fallback to regex
            if (count === 0) {
                searchCriteria = {
                    name: { $regex: String(query), $options: 'i' }
                };
            }
        } else if (query) {
            searchCriteria = {
                name: { $regex: String(query), $options: 'i' }
            };
        }

        const medicines = await Medicine.find(searchCriteria)
            .limit(Number(limit))
            .skip(skip)
            .sort({ name: 1 });

        const total = await Medicine.countDocuments(searchCriteria);

        res.json({
            medicines,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalMedicines: total
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ message: 'Server error fetching medicines' });
    }
});

// @route   GET /api/medicines/:id
// @desc    Get medicine by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        console.error('Error fetching medicine details:', error);
        res.status(500).json({ message: 'Server error fetching medicine details' });
    }
});

export default router;
