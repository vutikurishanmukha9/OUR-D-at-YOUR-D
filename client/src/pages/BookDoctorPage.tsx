import { useState, useEffect } from 'react';
import { doctorsApi, appointmentsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Doctor } from '../types';
import { Star, Clock, Calendar, X, CheckCircle, MapPin, Phone, Video, Home } from 'lucide-react';

export default function BookDoctorPage() {
    const { isAuthenticated } = useAuth();
    const { darkMode } = useTheme();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('consultation');
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');
    const [bookingError, setBookingError] = useState<string | null>(null);

    const cardClasses = darkMode
        ? 'bg-gray-800 border-emerald-500/20'
        : 'bg-white border-gray-200 shadow-lg';

    const inputClasses = darkMode
        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500'
        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500';

    useEffect(() => {
        fetchDoctors();
    }, [selectedSpecialty]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await doctorsApi.getAll({
                specialty: selectedSpecialty === 'all' ? undefined : selectedSpecialty,
                available: true
            });

            if (response.success && response.data) {
                setDoctors(response.data);
            } else {
                setError(response.error || 'Failed to load doctors');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const bookAppointment = async () => {
        if (!selectedDoctor || !appointmentDate || !appointmentTime) return;

        setBookingStatus('booking');
        setBookingError(null);

        try {
            const response = await appointmentsApi.create({
                doctorId: selectedDoctor._id,
                date: appointmentDate,
                time: appointmentTime,
                type: appointmentType
            });

            if (response.success) {
                setBookingStatus('success');
                setTimeout(() => {
                    setSelectedDoctor(null);
                    setAppointmentDate('');
                    setAppointmentTime('');
                    setBookingStatus('idle');
                }, 2000);
            } else {
                setBookingError(response.error || 'Booking failed');
                setBookingStatus('error');
            }
        } catch (err: any) {
            setBookingError(err.message);
            setBookingStatus('error');
        }
    };

    const specialties = ['all', 'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Gynecologist', 'Neurologist', 'Ayurvedic Practitioner'];
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    const appointmentTypes = [
        { value: 'consultation', label: 'Clinic Consultation', icon: MapPin },
        { value: 'home-visit', label: 'Home Visit', icon: Home },
        { value: 'video-call', label: 'Video Call', icon: Video }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Book a Doctor</h1>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Find and book appointments with our verified healthcare professionals
                </p>
            </div>

            {/* Specialty Filter */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {specialties.map((specialty) => (
                    <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSpecialty === specialty
                                ? (darkMode ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white')
                                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                            }`}
                    >
                        {specialty === 'all' ? 'All Specialties' : specialty}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${darkMode ? 'border-emerald-400' : 'border-blue-600'}`}></div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading doctors...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-red-400">{error}</p>
                    <button onClick={fetchDoctors} className="mt-4 text-emerald-400 hover:underline">Try again</button>
                </div>
            )}

            {/* Doctors Grid */}
            {!loading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className={`${cardClasses} rounded-2xl overflow-hidden border hover:scale-105 transition-transform`}>
                            <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{doctor.name}</h3>
                                <p className={`${darkMode ? 'text-emerald-400' : 'text-blue-600'} mb-3`}>{doctor.specialty}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doctor.rating}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doctor.experience}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${doctor.available
                                        ? (darkMode ? 'text-emerald-400' : 'text-green-600')
                                        : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                                        {doctor.available ? '● Available' : '● Unavailable'}
                                    </span>
                                    {doctor.consultationFee && (
                                        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            ₹{doctor.consultationFee}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedDoctor(doctor)}
                                    disabled={!doctor.available || !isAuthenticated}
                                    className={`w-full mt-4 py-2 rounded-lg font-semibold transition-colors ${!doctor.available || !isAuthenticated
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                                        }`}
                                >
                                    {!isAuthenticated ? 'Login to Book' : !doctor.available ? 'Unavailable' : 'Book Appointment'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-lg p-6 border ${darkMode ? 'border-emerald-500/20' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Book Appointment
                            </h3>
                            <button onClick={() => setSelectedDoctor(null)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {bookingStatus === 'success' ? (
                            <div className="text-center py-8">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Booking Confirmed!</h4>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your appointment has been scheduled</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center mb-6">
                                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                                    <div>
                                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDoctor.name}</h4>
                                        <p className={`${darkMode ? 'text-emerald-400' : 'text-blue-600'}`}>{selectedDoctor.specialty}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Appointment Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {appointmentTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setAppointmentType(type.value)}
                                                    className={`p-3 rounded-lg border text-center transition-colors ${appointmentType === type.value
                                                            ? (darkMode ? 'border-emerald-500 bg-emerald-500/20' : 'border-blue-500 bg-blue-50')
                                                            : (darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400')
                                                        }`}
                                                >
                                                    <type.icon className={`h-5 w-5 mx-auto mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <Calendar className="inline h-4 w-4 mr-1" /> Select Date
                                        </label>
                                        <input
                                            type="date"
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`w-full ${inputClasses} rounded-lg px-4 py-3 border focus:outline-none`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <Clock className="inline h-4 w-4 mr-1" /> Select Time
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setAppointmentTime(time)}
                                                    className={`py-2 rounded-lg text-sm transition-colors ${appointmentTime === time
                                                            ? (darkMode ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white')
                                                            : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {bookingError && (
                                        <p className="text-red-400 text-sm">{bookingError}</p>
                                    )}

                                    <button
                                        onClick={bookAppointment}
                                        disabled={!appointmentDate || !appointmentTime || bookingStatus === 'booking'}
                                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${!appointmentDate || !appointmentTime || bookingStatus === 'booking'
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : (darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                                            }`}
                                    >
                                        {bookingStatus === 'booking' ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
