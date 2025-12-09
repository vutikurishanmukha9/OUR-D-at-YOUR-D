import { useState } from 'react';
import { aiApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Medicine, SymptomAnalysisResult } from '../types';
import { Brain, Mic, MicOff, Upload, Camera, FileText, AlertTriangle, Heart, Pill, Info } from 'lucide-react';

export default function AIAssistantPage() {
    const { isAuthenticated, isGuestMode } = useAuth();
    const { darkMode } = useTheme();
    const [symptoms, setSymptoms] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cardClasses = darkMode
        ? 'bg-gray-800 border-emerald-500/20'
        : 'bg-white border-gray-200 shadow-lg';

    const inputClasses = darkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening && 'webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSymptoms(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognition.start();
        } else {
            // Fallback for browsers without speech recognition
            setTimeout(() => {
                setSymptoms('Headache and mild fever since morning');
                setIsListening(false);
            }, 2000);
        }
    };

    const analyzeSymptoms = async () => {
        if (!symptoms.trim()) return;

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await aiApi.analyzeSymptoms(symptoms.trim());

            if (response.success && response.data) {
                setAnalysisResult(response.data);
            } else {
                setError(response.error || 'Failed to analyze symptoms');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const MedicineCard = ({ medicine, type }: { medicine: Medicine; type: 'ayurvedic' | 'allopathic' }) => (
        <div className={`${type === 'ayurvedic'
            ? (darkMode ? 'bg-emerald-800/30 border-emerald-500/30' : 'bg-white/70 border-green-300')
            : (darkMode ? 'bg-blue-800/30 border-blue-500/30' : 'bg-white/70 border-blue-300')
            } rounded-lg p-4 border`}>
            <h4 className={`font-semibold ${type === 'ayurvedic'
                ? (darkMode ? 'text-emerald-100' : 'text-green-800')
                : (darkMode ? 'text-blue-100' : 'text-blue-800')
                } mb-2`}>{medicine.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dosage:</span>
                    <span className={`ml-2 ${type === 'ayurvedic' ? (darkMode ? 'text-emerald-200' : 'text-green-700') : (darkMode ? 'text-blue-200' : 'text-blue-700')}`}>{medicine.dosage}</span>
                </div>
                <div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timing:</span>
                    <span className={`ml-2 ${type === 'ayurvedic' ? (darkMode ? 'text-emerald-200' : 'text-green-700') : (darkMode ? 'text-blue-200' : 'text-blue-700')}`}>{medicine.timing}</span>
                </div>
                <div className="col-span-2">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration:</span>
                    <span className={`ml-2 ${type === 'ayurvedic' ? (darkMode ? 'text-emerald-200' : 'text-green-700') : (darkMode ? 'text-blue-200' : 'text-blue-700')}`}>{medicine.duration}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Guest Mode Notice */}
            {isGuestMode && !isAuthenticated && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
                    <div className="flex items-center">
                        <Info className={`w-5 h-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                            You're using AI Assistant as a guest. Create an account to save your consultation history.
                        </span>
                    </div>
                </div>
            )}

            {/* Input Section */}
            <div className={`${cardClasses} rounded-2xl p-6 mb-6 border`}>
                <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Brain className={`h-6 w-6 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                    <span>Describe Your Symptoms</span>
                </h2>

                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Describe your symptoms in detail... (Supports voice input)"
                            className={`w-full ${inputClasses} rounded-lg p-4 focus:outline-none resize-none h-32 border`}
                        />
                        <button
                            onClick={toggleListening}
                            className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                    : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600')
                                }`}
                        >
                            {isListening ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={analyzeSymptoms}
                        disabled={!symptoms.trim() || isAnalyzing}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${!symptoms.trim() || isAnalyzing
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                            }`}
                    >
                        <Brain className="h-5 w-5" />
                        <span>{isAnalyzing ? 'Analyzing with AI...' : 'Analyze Symptoms'}</span>
                    </button>
                </div>
            </div>

            {/* File Upload Section */}
            <div className={`${cardClasses} rounded-2xl p-6 mb-6 border`}>
                <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Upload className={`h-6 w-6 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                    <span>Upload Medical Files</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-emerald-500' : 'border-gray-300 hover:border-blue-500'} rounded-lg p-6 text-center transition-colors cursor-pointer`}>
                        <Camera className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Upload X-rays / Medical Images</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>AI will analyze and provide insights</p>
                    </div>

                    <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-emerald-500' : 'border-gray-300 hover:border-blue-500'} rounded-lg p-6 text-center transition-colors cursor-pointer`}>
                        <FileText className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Upload Prescriptions</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Extract medicines and set reminders</p>
                    </div>
                </div>
            </div>

            {/* Analysis Loading */}
            {isAnalyzing && (
                <div className={`${cardClasses} rounded-2xl p-6 mb-6 border`}>
                    <div className="flex items-center space-x-4">
                        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-emerald-400' : 'border-blue-600'}`}></div>
                        <div>
                            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analyzing your symptoms with AI...</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This may take a few seconds</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {analysisResult && (
                <>
                    {/* AI Analysis */}
                    <div className={`${cardClasses} rounded-2xl p-6 mb-6 border`}>
                        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Analysis</h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{analysisResult.aiAnalysis}</p>
                        <div className="flex gap-2 mt-3">
                            <span className={`text-xs px-2 py-1 rounded ${analysisResult.severity === 'mild' ? 'bg-green-500/20 text-green-400' :
                                    analysisResult.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {analysisResult.severity.toUpperCase()} Severity
                            </span>
                            {analysisResult.seekEmergencyCare && (
                                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                                    ⚠️ Seek Emergency Care
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Medicines Grid */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        {/* Ayurvedic Medicines */}
                        <div className={`${darkMode ? 'bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 border-emerald-500/20' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-2xl p-6 border`}>
                            <h3 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Heart className={`h-6 w-6 ${darkMode ? 'text-emerald-400' : 'text-green-600'}`} />
                                <span>Ayurvedic Treatment</span>
                            </h3>
                            <div className="space-y-4">
                                {analysisResult.ayurvedicMedicines.map((medicine, index) => (
                                    <MedicineCard key={index} medicine={medicine} type="ayurvedic" />
                                ))}
                            </div>
                        </div>

                        {/* Allopathic Medicines */}
                        <div className={`${darkMode ? 'bg-gradient-to-br from-blue-800/50 to-blue-900/50 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-2xl p-6 border`}>
                            <h3 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Pill className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                <span>Allopathic Treatment</span>
                            </h3>
                            <div className="space-y-4">
                                {analysisResult.allopathicMedicines.map((medicine, index) => (
                                    <MedicineCard key={index} medicine={medicine} type="allopathic" />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Disclaimer */}
            <div className={`${darkMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                        <p className={`${darkMode ? 'text-yellow-300' : 'text-yellow-800'} font-semibold mb-1`}>Medical Disclaimer</p>
                        <p className={`${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                            This AI assistant provides general guidance only. Always consult qualified healthcare professionals for proper diagnosis and treatment. In case of emergency, contact your local emergency services immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
