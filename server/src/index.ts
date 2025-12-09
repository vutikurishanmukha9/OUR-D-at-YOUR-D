import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import aiRoutes from './routes/ai';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req: Request, res: Response, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'OUR-D-at-YOUR-D API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🏥 =============================================
   OUR-D-at-YOUR-D Backend Server
   Healthcare at Your Doorstep
🏥 =============================================
   
   🚀 Server running on port ${PORT}
   📍 API URL: http://localhost:${PORT}/api
   🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}
   
   📋 Available Endpoints:
      - GET  /api/health          - Server health check
      - POST /api/auth/register   - User registration
      - POST /api/auth/login      - User login
      - GET  /api/auth/me         - Get current user
      - GET  /api/doctors         - List all doctors
      - GET  /api/doctors/:id     - Get doctor details
      - GET  /api/appointments    - User appointments
      - POST /api/appointments    - Book appointment
      - POST /api/ai/analyze      - Analyze symptoms (AI)
      - GET  /api/ai/consultations - Consultation history
   
🏥 =============================================
  `);
});

export default app;
