import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Menu, X, MessageCircle, Upload, Mic, MicOff, Send, History, 
  User, LogOut, Moon, Sun, Heart, Brain, Pill, FileText, Camera, AlertTriangle,
  Home, Phone, Calendar, Users, MapPin, Clock, Star, Shield, Zap, CheckCircle,
  ArrowRight, Play, UserPlus, LogIn, ChevronDown, Activity, Ambulance, Lock, Info
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  available: boolean;
}

interface Consultation {
  id: string;
  date: string;
  symptoms: string;
  ayurvedicMedicines: Medicine[];
  allopathicMedicines: Medicine[];
}

interface Medicine {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
}

type Page = 'home' | 'about' | 'book-doctor' | 'ai-assistant' | 'upload' | 'emergency' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<{
    ayurvedic: Medicine[];
    allopathic: Medicine[];
  } | null>(null);
  const [emergencyChat, setEmergencyChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, message: string, time: string}[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Check if current page requires authentication
  const requiresAuth = ['book-doctor', 'upload'].includes(currentPage);
  const canAccess = user || !requiresAuth;

  // Sample data
  const sampleDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'General Physician',
      rating: 4.8,
      experience: '8 years',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      rating: 4.9,
      experience: '12 years',
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true
    },
    {
      id: '3',
      name: 'Dr. Anita Patel',
      specialty: 'Pediatrician',
      rating: 4.7,
      experience: '10 years',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: false
    }
  ];

  const sampleConsultations: Consultation[] = [
    {
      id: '1',
      date: '2024-01-15',
      symptoms: 'Headache, fatigue, mild fever',
      ayurvedicMedicines: [
        { name: 'Sudarshan Ghana Vati', dosage: '2 tablets', timing: 'After meals', duration: '5 days' },
        { name: 'Ginger Tea', dosage: '1 cup', timing: 'Morning & Evening', duration: '3 days' }
      ],
      allopathicMedicines: [
        { name: 'Paracetamol', dosage: '500mg', timing: 'Every 6 hours', duration: '3 days' },
        { name: 'Ibuprofen', dosage: '400mg', timing: 'After meals', duration: '5 days' }
      ]
    }
  ];

  const sampleAppointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'General Checkup',
      status: 'confirmed'
    },
    {
      id: '2',
      doctorName: 'Dr. Rajesh Kumar',
      date: '2024-01-18',
      time: '2:30 PM',
      type: 'Heart Consultation',
      status: 'completed'
    }
  ];

  useEffect(() => {
    if (user) {
      setConsultations(sampleConsultations);
      setAppointments(sampleAppointments);
    }
  }, [user]);

  const handleLogin = (email: string, password: string) => {
    setUser({ id: '1', name: 'John Doe', email, phone: '+91 9876543210' });
    setShowLogin(false);
    setIsGuestMode(false);
  };

  const handleSignup = (name: string, email: string, password: string, phone: string) => {
    setUser({ id: '1', name, email, phone });
    setShowLogin(false);
    setIsGuestMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuestMode(false);
    setConsultations([]);
    setCurrentPrescription(null);
    setShowResults(false);
    setAppointments([]);
    setCurrentPage('home');
  };

  const handleGuestAccess = () => {
    setIsGuestMode(true);
    setCurrentPage('ai-assistant');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setSymptoms('Headache and mild fever since morning');
        setIsListening(false);
      }, 3000);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    
    setTimeout(() => {
      const prescription = {
        ayurvedic: [
          { name: 'Sudarshan Ghana Vati', dosage: '2 tablets', timing: 'After meals', duration: '5 days' },
          { name: 'Ginger Tea', dosage: '1 cup', timing: 'Morning & Evening', duration: '3 days' },
          { name: 'Tulsi Drops', dosage: '5 drops', timing: 'In warm water', duration: '7 days' }
        ],
        allopathic: [
          { name: 'Paracetamol', dosage: '500mg', timing: 'Every 6 hours', duration: '3 days' },
          { name: 'Ibuprofen', dosage: '400mg', timing: 'After meals', duration: '5 days' },
          { name: 'Vitamin C', dosage: '500mg', timing: 'Once daily', duration: '7 days' }
        ]
      };
      
      setCurrentPrescription(prescription);
      setIsAnalyzing(false);
      setShowResults(true);
      
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        symptoms,
        ayurvedicMedicines: prescription.ayurvedic,
        allopathicMedicines: prescription.allopathic
      };
      setConsultations(prev => [newConsultation, ...prev]);
    }, 3000);
  };

  const sendEmergencyMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    
    setTimeout(() => {
      const aiResponse = {
        sender: 'ai',
        message: 'I understand this is urgent. Based on your symptoms, I recommend seeking immediate medical attention. I can also arrange for an emergency doctor visit to your location. Would you like me to book an emergency consultation?',
        time: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  if (!canAccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
            <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Account Required
            </h2>
            <p className={`text-center mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please create an account to access doctor booking and file upload services.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Login / Sign Up
            </button>
            <button
              onClick={handleGuestAccess}
              className={`w-full mt-3 border border-emerald-600 text-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              Try AI Assistant (No Account)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-emerald-500/20' : 'bg-white border-gray-200'} border-b px-4 py-3 sticky top-0 z-40 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${darkMode ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-blue-600'} transition-colors lg:hidden`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-2`}>
                <Stethoscope className={`h-6 w-6 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <span className="font-bold text-lg">OUR D at YOUR D</span>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Healthcare at your doorstep</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`${currentPage === 'home' ? (darkMode ? 'text-emerald-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-700')} hover:${darkMode ? 'text-emerald-400' : 'text-blue-600'} transition-colors`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`${currentPage === 'about' ? (darkMode ? 'text-emerald-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-700')} hover:${darkMode ? 'text-emerald-400' : 'text-blue-600'} transition-colors`}
            >
              About Us
            </button>
            <button
              onClick={() => {
                if (!user && requiresAuth && currentPage === 'book-doctor') {
                  setShowLogin(true);
                } else {
                  setCurrentPage('book-doctor');
                }
              }}
              className={`${currentPage === 'book-doctor' ? (darkMode ? 'text-emerald-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-700')} hover:${darkMode ? 'text-emerald-400' : 'text-blue-600'} transition-colors flex items-center space-x-1`}
            >
              <span>Book a Doctor</span>
              {!user && <Lock className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className={`${currentPage === 'ai-assistant' ? (darkMode ? 'text-emerald-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-700')} hover:${darkMode ? 'text-emerald-400' : 'text-blue-600'} transition-colors`}
            >
              AI Health Assistant
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className={`${currentPage === 'contact' ? (darkMode ? 'text-emerald-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-700')} hover:${darkMode ? 'text-emerald-400' : 'text-blue-600'} transition-colors`}
            >
              Contact
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} transition-colors`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user || isGuestMode ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isGuestMode ? 'Guest Mode' : `Welcome, ${user?.name}`}
                </span>
                {user && (
                  <button
                    onClick={handleLogout}
                    className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                )}
                {isGuestMode && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className={`${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2`}
                  >
                    <User className="h-4 w-4" />
                    <span>Create Account</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className={`${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg transition-colors`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {(user || isGuestMode) && (currentPage === 'ai-assistant' || currentPage === 'book-doctor') && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} w-80 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0 mt-16 lg:mt-0`}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  {currentPage === 'ai-assistant' ? (
                    <>
                      <History className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                      <span>Medical History</span>
                    </>
                  ) : (
                    <>
                      <Calendar className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                      <span>My Appointments</span>
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} lg:hidden`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {currentPage === 'ai-assistant' ? (
                  user ? (
                    consultations.map((consultation) => (
                      <div key={consultation.id} className={`${cardClasses} rounded-lg p-4 border hover:border-opacity-60 transition-colors cursor-pointer`}>
                        <div className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-blue-600'} mb-2`}>{consultation.date}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{consultation.symptoms}</div>
                        <div className="flex space-x-2 text-xs">
                          <span className={`${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-100 text-green-700'} px-2 py-1 rounded`}>
                            {consultation.ayurvedicMedicines.length} Ayurvedic
                          </span>
                          <span className={`${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'} px-2 py-1 rounded`}>
                            {consultation.allopathicMedicines.length} Allopathic
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Create an account to save consultation history</p>
                    </div>
                  )
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className={`${cardClasses} rounded-lg p-4 border hover:border-opacity-60 transition-colors cursor-pointer`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.doctorName}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          appointment.status === 'confirmed' ? (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-100 text-green-700') :
                          appointment.status === 'pending' ? (darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                          (darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700')
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{appointment.type}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {appointment.date} at {appointment.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${(user || isGuestMode) && (currentPage === 'ai-assistant' || currentPage === 'book-doctor') ? 'lg:ml-80' : ''}`}>
          {currentPage === 'home' && <HomePage darkMode={darkMode} setCurrentPage={setCurrentPage} />}
          {currentPage === 'about' && <AboutPage darkMode={darkMode} />}
          {currentPage === 'book-doctor' && <BookDoctorPage darkMode={darkMode} doctors={sampleDoctors} />}
          {currentPage === 'ai-assistant' && (
            <AIAssistantPage 
              darkMode={darkMode}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              isListening={isListening}
              toggleListening={toggleListening}
              isAnalyzing={isAnalyzing}
              analyzeSymptoms={analyzeSymptoms}
              showResults={showResults}
              currentPrescription={currentPrescription}
              isGuestMode={isGuestMode}
              setShowLogin={setShowLogin}
            />
          )}
          {currentPage === 'upload' && <UploadPage darkMode={darkMode} />}
          {currentPage === 'emergency' && <EmergencyPage darkMode={darkMode} />}
          {currentPage === 'contact' && <ContactPage darkMode={darkMode} />}
        </div>
      </div>

      {/* Emergency Chat Button */}
      <button
        onClick={() => setEmergencyChat(true)}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Emergency Chat Modal */}
      {emergencyChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md h-96 flex flex-col border border-red-500/20`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className="text-lg font-semibold text-red-400 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency Consultation</span>
              </h3>
              <button
                onClick={() => setEmergencyChat(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-red-500 text-white' 
                        : (darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900')
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Describe your emergency..."
                  className={`flex-1 ${inputClasses} rounded-lg px-3 py-2 focus:outline-none`}
                  onKeyPress={(e) => e.key === 'Enter' && sendEmergencyMessage()}
                />
                <button
                  onClick={sendEmergencyMessage}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 w-full max-w-md border ${darkMode ? 'border-emerald-500/20' : 'border-gray-200'}`}>
            <div className="text-center mb-8">
              <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                <Stethoscope className={`h-8 w-8 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Welcome Back</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Access your health dashboard</p>
            </div>
            
            <LoginForm onLogin={handleLogin} onSignup={handleSignup} darkMode={darkMode} onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

// Component Pages
function HomePage({ darkMode, setCurrentPage }: { darkMode: boolean; setCurrentPage: (page: Page) => void }) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'} py-20`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className={`text-5xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Your Doctor at Your <span className={`${darkMode ? 'text-emerald-400' : 'text-blue-600'}`}>Door</span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 max-w-3xl mx-auto`}>
            No more waiting in long hospital queues. Get professional medical care delivered directly to your home. 
            From routine checkups to emergency care, we bring healthcare to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('book-doctor')}
              className={`${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2`}
            >
              <Calendar className="h-5 w-5" />
              <span>Book a Doctor Now</span>
            </button>
            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className={`${darkMode ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' : 'border-blue-600 text-blue-600 hover:bg-blue-50'} border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2`}
            >
              <Brain className="h-5 w-5" />
              <span>Try AI Assistant (No Account Needed)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-16`}>
            Why Choose Our Service?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`${cardClasses} rounded-2xl p-8 border text-center hover:scale-105 transition-transform`}>
              <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center`}>
                <Home className={`h-8 w-8 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Home Visits</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Professional doctors come to your home for consultations, treatments, and emergency care.
              </p>
            </div>

            <div className={`${cardClasses} rounded-2xl p-8 border text-center hover:scale-105 transition-transform`}>
              <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center`}>
                <Clock className={`h-8 w-8 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>24/7 Availability</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Round-the-clock medical support including emergency services and urgent care.
              </p>
            </div>

            <div className={`${cardClasses} rounded-2xl p-8 border text-center hover:scale-105 transition-transform`}>
              <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center`}>
                <Brain className={`h-8 w-8 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>AI Health Assistant</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get instant health advice with our AI assistant supporting both Ayurvedic and modern medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-16`}>
            Our Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Stethoscope, title: 'General Consultation', desc: 'Routine checkups and health assessments' },
              { icon: Heart, title: 'Emergency Care', desc: 'Urgent medical attention at your doorstep' },
              { icon: Activity, title: 'Specialist Care', desc: 'Cardiologists, pediatricians, and more' },
              { icon: Ambulance, title: 'Critical Care', desc: 'ICU setup and critical patient monitoring' }
            ].map((service, index) => (
              <div key={index} className={`${cardClasses} rounded-xl p-6 border text-center hover:scale-105 transition-transform`}>
                <service.icon className={`h-12 w-12 ${darkMode ? 'text-emerald-400' : 'text-blue-600'} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{service.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Ready to Experience Healthcare at Home?
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
            Join thousands of families who trust us for their healthcare needs.
          </p>
          <button
            onClick={() => setCurrentPage('book-doctor')}
            className={`${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2`}
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function AboutPage({ darkMode }: { darkMode: boolean }) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>About Our Mission</h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
            We're revolutionizing healthcare delivery by bringing professional medical care directly to your home, 
            eliminating the need for long hospital waits and making quality healthcare accessible to everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className={`${cardClasses} rounded-2xl p-8 border`}>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Our Vision</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              To make quality healthcare accessible to every family by bringing experienced doctors and medical professionals 
              directly to their homes, ensuring comfort, convenience, and comprehensive care.
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We believe that healthcare should be patient-centered, accessible, and delivered with compassion and expertise.
            </p>
          </div>

          <div className={`${cardClasses} rounded-2xl p-8 border`}>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Our Technology</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Our AI-powered health assistant combines traditional Ayurvedic wisdom with modern medical knowledge, 
              providing personalized health recommendations and supporting multiple Indian languages.
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Advanced diagnostic tools, telemedicine capabilities, and real-time health monitoring ensure the highest 
              quality of care in the comfort of your home.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-12`}>Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Trust & Safety', desc: 'Verified doctors, secure consultations, and complete privacy protection' },
              { icon: Heart, title: 'Compassionate Care', desc: 'Patient-first approach with empathy and understanding' },
              { icon: Zap, title: 'Innovation', desc: 'Cutting-edge technology meets traditional healthcare wisdom' }
            ].map((value, index) => (
              <div key={index} className={`${cardClasses} rounded-xl p-6 border text-center`}>
                <value.icon className={`h-12 w-12 ${darkMode ? 'text-emerald-400' : 'text-blue-600'} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>{value.title}</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Join Our Healthcare Revolution</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 max-w-3xl mx-auto`}>
            Experience the future of healthcare today. From routine checkups to emergency care, from childbirth assistance 
            to elderly care, we're here to serve your family's health needs with professionalism and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className={`${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-100 text-blue-700'} px-6 py-3 rounded-lg font-semibold`}>
              ✓ 500+ Verified Doctors
            </div>
            <div className={`${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-100 text-blue-700'} px-6 py-3 rounded-lg font-semibold`}>
              ✓ 24/7 Emergency Support
            </div>
            <div className={`${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-100 text-blue-700'} px-6 py-3 rounded-lg font-semibold`}>
              ✓ AI Health Assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookDoctorPage({ darkMode, doctors }: { darkMode: boolean; doctors: Doctor[] }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  const specialties = ['all', 'General Physician', 'Cardiologist', 'Pediatrician', 'Gynecologist', 'Orthopedic'];

  const filteredDoctors = selectedSpecialty === 'all' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty);

  const bookAppointment = () => {
    if (selectedDoctor && appointmentDate && appointmentTime) {
      alert(`Appointment booked with ${selectedDoctor.name} on ${appointmentDate} at ${appointmentTime}`);
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAppointmentTime('');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Book a Doctor</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Choose from our network of verified doctors for home visits
          </p>
        </div>

        {/* Specialty Filter */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Filter by Specialty</h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSpecialty === specialty
                    ? (darkMode ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white')
                    : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                {specialty === 'all' ? 'All Specialties' : specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className={`${cardClasses} rounded-xl p-6 border hover:scale-105 transition-transform`}>
              <div className="text-center mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {doctor.name}
                </h3>
                <p className={`${darkMode ? 'text-emerald-400' : 'text-blue-600'} font-medium mb-2`}>
                  {doctor.specialty}
                </p>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doctor.rating}</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {doctor.experience} experience
                </p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  doctor.available 
                    ? (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-100 text-green-700')
                    : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                }`}>
                  {doctor.available ? 'Available' : 'Busy'}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedDoctor(doctor)}
                disabled={!doctor.available}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  doctor.available
                    ? (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {doctor.available ? 'Book Appointment' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Book Appointment
                </h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDoctor.name}
                </h4>
                <p className={`${darkMode ? 'text-emerald-400' : 'text-blue-600'}`}>
                  {selectedDoctor.specialty}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Appointment Type
                  </label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className={`w-full ${inputClasses} rounded-lg px-3 py-2 focus:outline-none`}
                  >
                    <option value="consultation">General Consultation</option>
                    <option value="emergency">Emergency Visit</option>
                    <option value="followup">Follow-up</option>
                    <option value="checkup">Health Checkup</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full ${inputClasses} rounded-lg px-3 py-2 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Preferred Time
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className={`w-full ${inputClasses} rounded-lg px-3 py-2 focus:outline-none`}
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>

                <button
                  onClick={bookAppointment}
                  disabled={!appointmentDate || !appointmentTime}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    appointmentDate && appointmentTime
                      ? (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AIAssistantPage({ 
  darkMode, 
  symptoms, 
  setSymptoms, 
  isListening, 
  toggleListening, 
  isAnalyzing, 
  analyzeSymptoms, 
  showResults, 
  currentPrescription,
  isGuestMode,
  setShowLogin
}: {
  darkMode: boolean;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  isAnalyzing: boolean;
  analyzeSymptoms: () => void;
  showResults: boolean;
  currentPrescription: { ayurvedic: Medicine[]; allopathic: Medicine[] } | null;
  isGuestMode: boolean;
  setShowLogin: (show: boolean) => void;
}) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Guest Mode Notice */}
      {isGuestMode && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
          <div className="flex items-center">
            <Info className={`w-5 h-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              You're using AI Assistant as a guest. 
              <button 
                onClick={() => setShowLogin(true)}
                className={`ml-1 underline hover:no-underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              >
                Create an account
              </button> to save your consultation history and access doctor booking.
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
              placeholder="Describe your symptoms in detail... (Supports all Indian languages)"
              className={`w-full ${inputClasses} rounded-lg p-4 focus:outline-none resize-none h-32`}
            />
            <button
              onClick={toggleListening}
              className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600')
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={analyzeSymptoms}
              disabled={!symptoms.trim() || isAnalyzing}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                !symptoms.trim() || isAnalyzing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
              }`}
            >
              <Brain className="h-5 w-5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}</span>
            </button>
          </div>
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
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analyzing your symptoms...</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Our AI is processing your information</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {showResults && currentPrescription && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Ayurvedic Medicines */}
          <div className={`${darkMode ? 'bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 border-emerald-500/20' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-2xl p-6 border`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Heart className={`h-6 w-6 ${darkMode ? 'text-emerald-400' : 'text-green-600'}`} />
              <span>Ayurvedic Treatment</span>
            </h3>
            
            <div className="space-y-4">
              {currentPrescription.ayurvedic.map((medicine, index) => (
                <div key={index} className={`${darkMode ? 'bg-emerald-800/30 border-emerald-500/30' : 'bg-white/70 border-green-300'} rounded-lg p-4 border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-emerald-100' : 'text-green-800'} mb-2`}>{medicine.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dosage:</span>
                      <span className={`${darkMode ? 'text-emerald-200' : 'text-green-700'} ml-2`}>{medicine.dosage}</span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timing:</span>
                      <span className={`${darkMode ? 'text-emerald-200' : 'text-green-700'} ml-2`}>{medicine.timing}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration:</span>
                      <span className={`${darkMode ? 'text-emerald-200' : 'text-green-700'} ml-2`}>{medicine.duration}</span>
                    </div>
                  </div>
                </div>
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
              {currentPrescription.allopathic.map((medicine, index) => (
                <div key={index} className={`${darkMode ? 'bg-blue-800/30 border-blue-500/30' : 'bg-white/70 border-blue-300'} rounded-lg p-4 border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-blue-100' : 'text-blue-800'} mb-2`}>{medicine.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dosage:</span>
                      <span className={`${darkMode ? 'text-blue-200' : 'text-blue-700'} ml-2`}>{medicine.dosage}</span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timing:</span>
                      <span className={`${darkMode ? 'text-blue-200' : 'text-blue-700'} ml-2`}>{medicine.timing}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration:</span>
                      <span className={`${darkMode ? 'text-blue-200' : 'text-blue-700'} ml-2`}>{medicine.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className={`${darkMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4 mb-6`}>
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

function UploadPage({ darkMode }: { darkMode: boolean }) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Upload Medical Files</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload your medical documents for AI analysis and digital record keeping
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
            <Camera className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>X-rays & Medical Images</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Upload X-rays, CT scans, MRI images for AI-powered analysis and diagnosis assistance
            </p>
            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 mb-4`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Drag & drop files here or click to browse</p>
            </div>
            <button className={`w-full ${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition-colors`}>
              Upload Images
            </button>
          </div>

          <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
            <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Prescriptions & Reports</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Upload prescriptions and medical reports for medicine extraction and reminder setup
            </p>
            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 mb-4`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Drag & drop files here or click to browse</p>
            </div>
            <button className={`w-full ${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition-colors`}>
              Upload Documents
            </button>
          </div>
        </div>

        <div className={`${cardClasses} rounded-2xl p-6 border mt-8`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Supported File Types</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-emerald-400' : 'text-blue-600'} mb-2`}>Medical Images</h4>
              <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• JPEG, PNG, TIFF formats</li>
                <li>• DICOM files</li>
                <li>• Maximum size: 50MB</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-emerald-400' : 'text-blue-600'} mb-2`}>Documents</h4>
              <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• PDF, DOC, DOCX formats</li>
                <li>• Image files (JPG, PNG)</li>
                <li>• Maximum size: 25MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmergencyPage({ darkMode }: { darkMode: boolean }) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-red-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="bg-red-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Emergency Help</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Immediate medical assistance when you need it most
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
            <Phone className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Emergency Hotline</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              24/7 emergency medical support with immediate doctor dispatch
            </p>
            <a href="tel:+911234567890" className="block w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Call Now: +91 123-456-7890
            </a>
          </div>

          <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
            <Ambulance className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Emergency Doctor</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Request immediate doctor visit to your location for critical situations
            </p>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Request Emergency Visit
            </button>
          </div>
        </div>

        <div className={`${cardClasses} rounded-2xl p-6 border`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>When to Call Emergency Services</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium text-red-400 mb-3`}>Immediate Emergency</h4>
              <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                <li>• Chest pain or heart attack symptoms</li>
                <li>• Difficulty breathing or choking</li>
                <li>• Severe bleeding or trauma</li>
                <li>• Loss of consciousness</li>
                <li>• Stroke symptoms</li>
                <li>• Severe allergic reactions</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-medium text-red-400 mb-3`}>Urgent Care</h4>
              <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                <li>• High fever (above 103°F)</li>
                <li>• Severe abdominal pain</li>
                <li>• Persistent vomiting</li>
                <li>• Severe headache</li>
                <li>• Childbirth complications</li>
                <li>• Mental health crisis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ darkMode }: { darkMode: boolean }) {
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-emerald-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Contact Us</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Get in touch with our healthcare team
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className={`${cardClasses} rounded-2xl p-8 border mb-8`}>
              <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Subject
                  </label>
                  <select className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="feedback">Feedback</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none resize-none`}
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`w-full ${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition-colors`}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`${cardClasses} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>+91 123-456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MessageCircle className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>support@ourdatyourdoor.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Address</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>123 Healthcare Street, Medical District, Mumbai 400001</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hours</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>24/7 Emergency Services</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>9 AM - 9 PM Regular Consultations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardClasses} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Hotline</span>
                  <a href="tel:+911234567890" className="text-red-400 font-semibold">+91 123-456-7890</a>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Urgent Care</span>
                  <a href="tel:+911234567891" className="text-yellow-400 font-semibold">+91 123-456-7891</a>
                </div>
              </div>
            </div>

            <div className={`${cardClasses} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Follow Us</h3>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <button
                    key={social}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg transition-colors`}
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onSignup, darkMode, setDarkMode }: { 
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string, phone: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'} flex items-center justify-center p-4`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-600'} transition-colors shadow-lg`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-emerald-500/20' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl p-8 w-full max-w-md border`}>
        <div className="text-center mb-8">
          <div className={`${darkMode ? 'bg-emerald-500/20' : 'bg-blue-500/20'} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
            <Stethoscope className={`h-8 w-8 ${darkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Our D At Your Door</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Healthcare at your doorstep</p>
        </div>
        
        <LoginForm onLogin={onLogin} onSignup={onSignup} darkMode={darkMode} />
      </div>
    </div>
  );
}

function LoginForm({ onLogin, onSignup, darkMode, onClose }: { 
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string, phone: string) => void;
  darkMode: boolean;
  onClose?: () => void;
}) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      onSignup(formData.name, formData.email, formData.password, formData.phone);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  return (
    <div>
      {onClose && (
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
              placeholder="Enter your full name"
              required={isSignup}
            />
          </div>
        )}
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
            placeholder="Enter your email"
            required
          />
        </div>

        {isSignup && (
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
              placeholder="Enter your phone number"
              required={isSignup}
            />
          </div>
        )}
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={`w-full ${inputClasses} rounded-lg px-4 py-3 focus:outline-none`}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full ${darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 px-4 rounded-lg transition-colors`}
        >
          {isSignup ? 'Create Account' : 'Sign In'}
        </button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-blue-600 hover:text-blue-500'} text-sm transition-colors`}
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;