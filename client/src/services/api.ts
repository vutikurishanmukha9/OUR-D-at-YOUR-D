import { User, Doctor, Appointment, Consultation, SymptomAnalysisResult, AuthResponse, ApiResponse, CatalogMedicine } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper to make authenticated requests
const authHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...authHeaders(),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP error! status: ${response.status}`
            };
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
}

// ============ AUTH API ============

export const authApi = {
    register: async (name: string, email: string, password: string, phone: string): Promise<AuthResponse> => {
        const response = await fetchApi<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, phone })
        });

        if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response as AuthResponse;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await fetchApi<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response as AuthResponse;
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        return fetchApi<User>('/auth/me');
    },

    updateProfile: async (name: string, phone: string): Promise<ApiResponse<User>> => {
        return fetchApi<User>('/auth/update', {
            method: 'PUT',
            body: JSON.stringify({ name, phone })
        });
    },

    getStoredUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: (): boolean => {
        return !!getAuthToken();
    }
};

// ============ DOCTORS API ============

export const doctorsApi = {
    getAll: async (filters?: { specialty?: string; available?: boolean; search?: string }): Promise<ApiResponse<Doctor[]>> => {
        const params = new URLSearchParams();
        if (filters?.specialty) params.append('specialty', filters.specialty);
        if (filters?.available !== undefined) params.append('available', String(filters.available));
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        return fetchApi<Doctor[]>(`/doctors${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id: string): Promise<ApiResponse<Doctor>> => {
        return fetchApi<Doctor>(`/doctors/${id}`);
    },

    getSpecialties: async (): Promise<ApiResponse<string[]>> => {
        return fetchApi<string[]>('/doctors/meta/specialties');
    }
};

// ============ APPOINTMENTS API ============

export const appointmentsApi = {
    getAll: async (): Promise<ApiResponse<Appointment[]>> => {
        return fetchApi<Appointment[]>('/appointments');
    },

    getById: async (id: string): Promise<ApiResponse<Appointment>> => {
        return fetchApi<Appointment>(`/appointments/${id}`);
    },

    create: async (data: {
        doctorId: string;
        date: string;
        time: string;
        type?: string;
        symptoms?: string;
    }): Promise<ApiResponse<Appointment>> => {
        return fetchApi<Appointment>('/appointments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (id: string, data: {
        date?: string;
        time?: string;
        notes?: string;
        symptoms?: string;
    }): Promise<ApiResponse<Appointment>> => {
        return fetchApi<Appointment>(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    cancel: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        return fetchApi<{ message: string }>(`/appointments/${id}`, {
            method: 'DELETE'
        });
    }
};

// ============ AI API ============

export const aiApi = {
    analyzeSymptoms: async (symptoms: string): Promise<ApiResponse<SymptomAnalysisResult>> => {
        return fetchApi<SymptomAnalysisResult>('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({ symptoms })
        });
    },

    getConsultations: async (): Promise<ApiResponse<Consultation[]>> => {
        return fetchApi<Consultation[]>('/ai/consultations');
    },

    getConsultation: async (id: string): Promise<ApiResponse<Consultation>> => {
        return fetchApi<Consultation>(`/ai/consultations/${id}`);
    },

    checkHealth: async (): Promise<ApiResponse<{ status: string; geminiConnected: boolean }>> => {
        return fetchApi<{ status: string; geminiConnected: boolean }>('/ai/health');
    }
};

// ============ MEDICINES API ============

export const medicinesApi = {
    search: async (query: string, page: number = 1): Promise<ApiResponse<{ medicines: CatalogMedicine[]; currentPage: number; totalPages: number; totalMedicines: number }>> => {
        return fetchApi<{ medicines: CatalogMedicine[]; currentPage: number; totalPages: number; totalMedicines: number }>(`/medicines?query=${encodeURIComponent(query)}&page=${page}`);
    },

    getById: async (id: string): Promise<ApiResponse<CatalogMedicine>> => {
        return fetchApi<CatalogMedicine>(`/medicines/${id}`);
    }
};

// ============ HEALTH CHECK ============

export const checkApiHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};
