<div align="center">

# OUR-D-at-YOUR-D

### *Healthcare at Your Doorstep*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000)](https://ui.shadcn.com/)

**A full-stack healthcare platform that brings professional medical care directly to your doorstep, powered by AI for instant health recommendations.**

[Live Demo](#) | [Features](#features) | [Installation](#installation) | [API Docs](#api-documentation) | [Contributing](#contributing)

</div>

---

## Problem Statement

Traditional healthcare access presents significant challenges:

- **Long Wait Times** - Hours spent in hospital queues
- **Transportation Issues** - Difficulty reaching medical facilities
- **Elderly & Disabled Care** - Limited mobility for vulnerable populations
- **Time Constraints** - Busy schedules preventing regular checkups
- **Medicine Confusion** - Uncertainty between Ayurvedic and Allopathic options

## Our Solution

**OUR-D-at-YOUR-D** eliminates these barriers by:

1. **Home Doctor Visits** - Verified doctors come to your location
2. **AI Health Assistant** - Instant symptom analysis with dual medicine recommendations
3. **24/7 Availability** - Emergency support round the clock
4. **Telemedicine** - Video consultations when physical visits aren't needed

---

## Features

### AI Health Assistant
- **Symptom Analysis** powered by Google Gemini AI
- **Dual Recommendations** - Both Ayurvedic and Allopathic medicines
- **Medical Disclaimers** - Responsible AI with safety warnings
- **Guest Access** - Try without creating an account

### Doctor Booking System
- Browse verified healthcare professionals
- Filter by specialty (Cardiologist, Pediatrician, etc.)
- Real-time availability status
- Multiple appointment types (Home Visit, Clinic, Video Call)

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Profile management
- Consultation history

### Modern UI/UX
- **shadcn/ui** components
- Professional medical blue theme with purple/pink accents
- Dark/Light mode toggle
- Fully responsive design
- Smooth animations and transitions

### Emergency Features
- One-tap emergency contact
- 24/7 hotline access
- Priority booking for urgent cases

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| TypeScript | Type Safety |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |

### AI Integration
| Technology | Purpose |
|------------|---------|
| Google Gemini API | Symptom Analysis |
| Structured Prompts | Medical Recommendations |

---

## Project Structure

```
OUR-D-at-YOUR-D/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/ui/      # shadcn/ui components
│   │   ├── contexts/           # React Context (Auth, Theme)
│   │   ├── lib/                # Utility functions
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript definitions
│   │   ├── App.tsx             # Main application
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── config/             # Database configuration
│   │   ├── middleware/         # Auth, Error handling
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Doctor.ts
│   │   │   ├── Appointment.ts
│   │   │   └── Consultation.ts
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.ts
│   │   │   ├── doctors.ts
│   │   │   ├── appointments.ts
│   │   │   └── ai.ts
│   │   ├── services/           # Gemini AI service
│   │   ├── index.ts            # Server entry
│   │   └── seed.ts             # Database seeding
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package (monorepo scripts)
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Google Gemini API key (free tier available)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/OUR-D-at-YOUR-D.git
cd OUR-D-at-YOUR-D
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables

**Server (`server/.env`):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Run Development Servers
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/:id` | Get doctor details |
| GET | `/api/doctors/specialties` | List specialties |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | User's appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze symptoms |
| GET | `/api/ai/consultations` | Consultation history |
| GET | `/api/ai/health` | AI service status |

---

## Future Enhancements

### Phase 2: Enhanced Features
- [ ] Video Consultations - WebRTC-based telemedicine
- [ ] Prescription Management - Digital prescriptions with QR codes
- [ ] Lab Test Booking - Home sample collection
- [ ] Medicine Delivery - Integration with pharmacy services

### Phase 3: AI Improvements
- [ ] Multi-language Support - Hindi, Telugu, Tamil, etc.
- [ ] Voice Input - Describe symptoms by speaking
- [ ] Image Analysis - Upload photos of symptoms
- [ ] Chronic Disease Management - Long-term health tracking

### Phase 4: Platform Expansion
- [ ] Mobile Apps - React Native iOS & Android apps
- [ ] Doctor Dashboard - Portal for healthcare providers
- [ ] Admin Panel - Platform management interface
- [ ] Analytics Dashboard - Health insights and trends

### Phase 5: Enterprise Features
- [ ] Corporate Health Plans - B2B healthcare packages
- [ ] Insurance Integration - Claim processing
- [ ] Health Records - HIPAA-compliant medical records
- [ ] IoT Integration - Wearable device data

---

## Security

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** on all API endpoints
- **CORS Protection** with whitelisted origins
- **Rate Limiting** on AI endpoints
- **Environment Variables** for sensitive data

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Support

- **Emergency Hotline:** 1800-123-4567 (24/7)
- **Email:** support@ourdatyourd.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/OUR-D-at-YOUR-D/issues)

---

<div align="center">

**Made with passion for better healthcare access**

Star this repo if you find it helpful!

</div>
