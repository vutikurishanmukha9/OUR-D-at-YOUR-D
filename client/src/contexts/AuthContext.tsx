import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isGuestMode: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    enterGuestMode: () => void;
    exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuestMode, setIsGuestMode] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authApi.getStoredUser();
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                // Verify token is still valid
                const response = await authApi.getCurrentUser();
                if (response.success && response.data) {
                    setUser(response.data);
                } else {
                    // Token expired or invalid
                    authApi.logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(email, password);
            if (response.success && response.data) {
                setUser(response.data.user);
                setIsGuestMode(false);
                return { success: true };
            }
            return { success: false, error: response.error || 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, phone: string) => {
        setIsLoading(true);
        try {
            const response = await authApi.register(name, email, password, phone);
            if (response.success && response.data) {
                setUser(response.data.user);
                setIsGuestMode(false);
                return { success: true };
            }
            return { success: false, error: response.error || 'Registration failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        setIsGuestMode(false);
    };

    const enterGuestMode = () => {
        setIsGuestMode(true);
    };

    const exitGuestMode = () => {
        setIsGuestMode(false);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        isGuestMode,
        login,
        register,
        logout,
        enterGuestMode,
        exitGuestMode
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
