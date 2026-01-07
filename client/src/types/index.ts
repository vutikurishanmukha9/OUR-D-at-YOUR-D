export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Doctor {
    _id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    image: string;
    available: boolean;
    email?: string;
    phone?: string;
    bio?: string;
    consultationFee?: number;
    languages?: string[];
}

export interface Medicine {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
}

export interface CatalogMedicine {
    _id: string;
    name: string;
    price: number;
    manufacturer: string;
    type: string;
    packSize: string;
    composition: string;
    description: string;
    sideEffects: string[];
    isDiscontinued: boolean;
}

export interface Consultation {
    _id: string;
    symptoms: string;
    ayurvedicMedicines: Medicine[];
    allopathicMedicines: Medicine[];
    aiAnalysis?: string;
    createdAt: string;
}

export interface Appointment {
    _id: string;
    doctor: Doctor | string;
    doctorName: string;
    date: string;
    time: string;
    type: 'consultation' | 'home-visit' | 'video-call' | 'emergency';
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    symptoms?: string;
    notes?: string;
    createdAt: string;
}

export interface SymptomAnalysisResult {
    id: string;
    symptoms: string;
    aiAnalysis: string;
    severity: 'mild' | 'moderate' | 'severe';
    seekEmergencyCare: boolean;
    ayurvedicMedicines: Medicine[];
    allopathicMedicines: Medicine[];
    disclaimer: string;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    data?: {
        user: User;
        token: string;
    };
    error?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    count?: number;
}

export type Page = 'home' | 'about' | 'book-doctor' | 'ai-assistant' | 'upload' | 'emergency' | 'contact';
