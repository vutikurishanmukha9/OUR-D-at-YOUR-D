import { useState, useEffect } from 'react';
import {
  Stethoscope, Menu, MessageCircle, Send,
  LogOut, Moon, Sun, Heart, Brain, Pill, AlertTriangle,
  Home, Phone, Calendar, Clock, Star, Shield, Zap,
  ArrowRight, Activity, Ambulance, Sparkles, Users, MapPin,
  Video, ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface User { id: string; name: string; email: string; phone: string; }
interface Doctor { id: string; name: string; specialty: string; rating: number; experience: string; image: string; available: boolean; consultationFee?: number; }
interface Medicine { name: string; dosage: string; timing: string; duration: string; }

type Page = 'home' | 'about' | 'book-doctor' | 'ai-assistant' | 'contact';

const sampleDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'General Physician', rating: 4.8, experience: '8 years', image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300', available: true, consultationFee: 500 },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', rating: 4.9, experience: '12 years', image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300', available: true, consultationFee: 1000 },
  { id: '3', name: 'Dr. Anita Patel', specialty: 'Pediatrician', rating: 4.7, experience: '10 years', image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300', available: true, consultationFee: 600 },
  { id: '4', name: 'Dr. Suresh Menon', specialty: 'Dermatologist', rating: 4.6, experience: '7 years', image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300', available: false, consultationFee: 800 },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<{ ayurvedic: Medicine[]; allopathic: Medicine[] } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogin = (email: string) => {
    setUser({ id: '1', name: 'John Doe', email, phone: '+91 9876543210' });
    setShowLogin(false);
    setIsGuestMode(false);
  };

  const handleSignup = (name: string, email: string, phone: string) => {
    setUser({ id: '1', name, email, phone });
    setShowLogin(false);
    setIsGuestMode(false);
  };

  const handleLogout = () => { setUser(null); setIsGuestMode(false); setCurrentPage('home'); };
  const handleGuestAccess = () => { setIsGuestMode(true); setCurrentPage('ai-assistant'); };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setCurrentPrescription({
        ayurvedic: [
          { name: 'Sudarshan Ghana Vati', dosage: '2 tablets', timing: 'After meals', duration: '5 days' },
          { name: 'Tulsi Drops', dosage: '5 drops', timing: 'In warm water', duration: '7 days' },
        ],
        allopathic: [
          { name: 'Paracetamol', dosage: '500mg', timing: 'Every 6 hours', duration: '3 days' },
          { name: 'Vitamin C', dosage: '500mg', timing: 'Once daily', duration: '7 days' },
        ]
      });
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">OUR D at YOUR D</h1>
              <p className="text-xs text-muted-foreground">Healthcare at Your Doorstep</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {(['home', 'book-doctor', 'ai-assistant', 'about', 'contact'] as Page[]).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === page ? 'text-primary' : 'text-muted-foreground'}`}>
                {page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-5 w-5" /></Button>
              </div>
            ) : (
              <Button onClick={() => isGuestMode ? setShowLogin(true) : setShowLogin(true)} className="gradient-hero text-white">
                {isGuestMode ? 'Sign Up' : 'Login'}
              </Button>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {(['home', 'book-doctor', 'ai-assistant', 'about', 'contact'] as Page[]).map((page) => (
                    <Button key={page} variant={currentPage === page ? 'default' : 'ghost'} className="justify-start"
                      onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }}>
                      {page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} handleGuestAccess={handleGuestAccess} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'book-doctor' && <BookDoctorPage doctors={sampleDoctors} user={user} setShowLogin={setShowLogin} />}
        {currentPage === 'ai-assistant' && <AIAssistantPage symptoms={symptoms} setSymptoms={setSymptoms} isAnalyzing={isAnalyzing} analyzeSymptoms={analyzeSymptoms} showResults={showResults} currentPrescription={currentPrescription} isGuestMode={isGuestMode} setShowLogin={setShowLogin} />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg gradient-hero animate-pulse" onClick={() => alert('Emergency: 1800-123-4567')}>
        <Ambulance className="h-6 w-6" />
      </Button>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">Access your health dashboard</DialogDescription>
          </DialogHeader>
          <LoginForm onLogin={handleLogin} onSignup={handleSignup} />
        </DialogContent>
      </Dialog>

      <footer className="border-t py-12 mt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary"><Stethoscope className="h-5 w-5 text-white" /></div>
                <span className="font-bold">OUR D at YOUR D</span>
              </div>
              <p className="text-sm text-muted-foreground">Professional healthcare at your doorstep.</p>
            </div>
            <div><h4 className="font-semibold mb-4">Services</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>Home Visits</li><li>AI Consultation</li><li>Emergency Care</li></ul></div>
            <div><h4 className="font-semibold mb-4">Company</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>About Us</li><li>Careers</li><li>Contact</li></ul></div>
            <div><h4 className="font-semibold mb-4">Emergency</h4><p className="text-2xl font-bold text-primary">1800-123-4567</p><p className="text-sm text-muted-foreground mt-2">Available 24/7</p></div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">© 2024 OUR D at YOUR D. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ setCurrentPage, handleGuestAccess }: { setCurrentPage: (page: Page) => void; handleGuestAccess: () => void }) {
  return (
    <div>
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container max-w-7xl mx-auto px-4 relative text-center">
          <Badge className="mb-6 gradient-hero text-white border-0"><Sparkles className="h-3 w-3 mr-1" /> AI-Powered Healthcare</Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">Your Doctor at Your <span className="text-gradient">Doorstep</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">No more waiting. Get professional medical care delivered to your home.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-hero text-white h-12 px-8" onClick={() => setCurrentPage('book-doctor')}><Calendar className="mr-2 h-5 w-5" />Book a Doctor</Button>
            <Button size="lg" variant="outline" className="h-12 px-8" onClick={handleGuestAccess}><Brain className="mr-2 h-5 w-5" />Try AI Assistant Free</Button>
          </div>
        </div>
      </section>

      <section className="py-12 border-y bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ value: '500+', label: 'Doctors' }, { value: '50K+', label: 'Patients' }, { value: '24/7', label: 'Available' }, { value: '4.9', label: 'Rating' }].map((s, i) => (
            <div key={i} className="text-center"><p className="text-3xl font-bold text-gradient">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center mb-16">
          <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Healthcare Reimagined</h2>
        </div>
        <div className="container max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[{ icon: Home, title: 'Home Visits', desc: 'Doctors visit your home', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock support', gradient: 'from-purple-500 to-pink-500' },
          { icon: Brain, title: 'AI Health Assistant', desc: 'Instant health advice', gradient: 'from-orange-500 to-red-500' }].map((f, i) => (
            <Card key={i} className="card-hover border-0 shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}><f.icon className="h-6 w-6 text-white" /></div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent><CardDescription>{f.desc}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 text-center mb-16">
          <Badge variant="outline" className="mb-4">Our Services</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Care</h2>
        </div>
        <div className="container max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ icon: Stethoscope, title: 'General Checkup', color: 'bg-blue-500' }, { icon: Heart, title: 'Cardiology', color: 'bg-red-500' },
          { icon: Activity, title: 'Emergency Care', color: 'bg-orange-500' }, { icon: Users, title: 'Pediatrics', color: 'bg-green-500' },
          { icon: Brain, title: 'Neurology', color: 'bg-purple-500' }, { icon: Shield, title: 'Preventive Care', color: 'bg-cyan-500' },
          { icon: Pill, title: 'Pharmacy', color: 'bg-pink-500' }, { icon: Video, title: 'Telemedicine', color: 'bg-indigo-500' }].map((s, i) => (
            <Card key={i} className="card-hover cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${s.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}><s.icon className="h-5 w-5" /></div>
                <span className="font-medium">{s.title}</span>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <Card className="gradient-hero text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Better Healthcare?</h2>
              <p className="text-white/80 mb-8">Join thousands of happy families.</p>
              <Button size="lg" variant="secondary" className="h-12 px-8" onClick={() => setCurrentPage('book-doctor')}>Get Started<ArrowRight className="ml-2 h-5 w-5" /></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="py-20 container max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">About Us</Badge>
        <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Revolutionizing healthcare delivery by bringing medical care to your home.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <Card className="card-hover"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Our Vision</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Quality healthcare accessible to everyone at home.</p></CardContent></Card>
        <Card className="card-hover"><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-secondary" />Our Technology</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">AI combining Ayurvedic and modern medicine.</p></CardContent></Card>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[{ icon: Shield, title: 'Trust & Safety' }, { icon: Heart, title: 'Compassionate Care' }, { icon: Zap, title: 'Innovation' }].map((v, i) => (
          <Card key={i} className="text-center card-hover"><CardContent className="pt-6"><div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4"><v.icon className="h-8 w-8 text-white" /></div><h3 className="font-semibold text-lg">{v.title}</h3></CardContent></Card>
        ))}
      </div>
    </div>
  );
}

function BookDoctorPage({ doctors, user, setShowLogin }: { doctors: Doctor[]; user: User | null; setShowLogin: (show: boolean) => void }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];
  const filteredDoctors = selectedSpecialty === 'all' ? doctors : doctors.filter(d => d.specialty === selectedSpecialty);

  return (
    <div className="py-12 container max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">Book Appointment</Badge>
        <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {specialties.map((spec) => (
          <Button key={spec} variant={selectedSpecialty === spec ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSpecialty(spec)}
            className={selectedSpecialty === spec ? 'gradient-hero text-white border-0' : ''}>
            {spec === 'all' ? 'All' : spec}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden card-hover">
            <div className="aspect-square relative">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              <Badge className={`absolute top-3 right-3 ${doctor.available ? 'bg-green-500' : 'bg-gray-500'}`}>{doctor.available ? 'Available' : 'Busy'}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{doctor.name}</h3>
              <p className="text-primary text-sm mb-3">{doctor.specialty}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{doctor.rating}</span></div>
                <span>{doctor.experience}</span>
              </div>
              {doctor.consultationFee && <p className="text-lg font-semibold mb-4">₹{doctor.consultationFee}</p>}
              <Button className="w-full gradient-hero text-white border-0" disabled={!doctor.available} onClick={() => !user && setShowLogin(true)}>
                {user ? 'Book Now' : 'Login to Book'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AIAssistantPage({ symptoms, setSymptoms, isAnalyzing, analyzeSymptoms, showResults, currentPrescription, isGuestMode, setShowLogin }: { symptoms: string; setSymptoms: (s: string) => void; isAnalyzing: boolean; analyzeSymptoms: () => void; showResults: boolean; currentPrescription: { ayurvedic: Medicine[]; allopathic: Medicine[] } | null; isGuestMode: boolean; setShowLogin: (show: boolean) => void }) {
  return (
    <div className="py-12 container max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4"><Brain className="h-3 w-3 mr-1" /> AI-Powered</Badge>
        <h1 className="text-4xl font-bold mb-4">Health Assistant</h1>
        <p className="text-muted-foreground">Describe your symptoms for instant recommendations</p>
      </div>
      {isGuestMode && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><span className="text-sm">Guest mode - Sign up to save history</span></div>
            <Button size="sm" onClick={() => setShowLogin(true)}>Sign Up</Button>
          </CardContent>
        </Card>
      )}
      <Card className="mb-8">
        <CardHeader><CardTitle>Describe Your Symptoms</CardTitle><CardDescription>Be detailed for better recommendations</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="E.g., headache and mild fever since morning..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="min-h-32" />
          <Button className="w-full gradient-hero text-white border-0 h-12" onClick={analyzeSymptoms} disabled={!symptoms.trim() || isAnalyzing}>
            {isAnalyzing ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />Analyzing...</> : <><Brain className="mr-2 h-5 w-5" />Analyze Symptoms</>}
          </Button>
        </CardContent>
      </Card>
      {showResults && currentPrescription && (
        <div className="space-y-6">
          <Tabs defaultValue="ayurvedic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ayurvedic"><Heart className="mr-2 h-4 w-4" />Ayurvedic</TabsTrigger>
              <TabsTrigger value="allopathic"><Pill className="mr-2 h-4 w-4" />Allopathic</TabsTrigger>
            </TabsList>
            <TabsContent value="ayurvedic" className="mt-6 space-y-4">
              {currentPrescription.ayurvedic.map((med, i) => (
                <Card key={i} className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="p-4"><h4 className="font-semibold text-green-800 dark:text-green-200">{med.name}</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-green-700 dark:text-green-300">
                      <div>Dosage: {med.dosage}</div><div>Timing: {med.timing}</div><div>Duration: {med.duration}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="allopathic" className="mt-6 space-y-4">
              {currentPrescription.allopathic.map((med, i) => (
                <Card key={i} className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <CardContent className="p-4"><h4 className="font-semibold text-blue-800 dark:text-blue-200">{med.name}</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <div>Dosage: {med.dosage}</div><div>Timing: {med.timing}</div><div>Duration: {med.duration}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
            <CardContent className="p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="text-sm"><p className="font-semibold text-yellow-800 dark:text-yellow-200">Medical Disclaimer</p><p className="text-yellow-700 dark:text-yellow-300">This is AI advice. Consult a healthcare professional.</p></div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ContactPage() {
  return (
    <div className="py-20 container max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">Contact Us</Badge>
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Card className="card-hover"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 rounded-lg bg-primary/10"><Phone className="h-6 w-6 text-primary" /></div><div><h3 className="font-semibold">Emergency</h3><p className="text-2xl font-bold text-primary">1800-123-4567</p></div></CardContent></Card>
          <Card className="card-hover"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 rounded-lg bg-secondary/10"><MapPin className="h-6 w-6 text-secondary" /></div><div><h3 className="font-semibold">Office</h3><p className="text-muted-foreground">Hyderabad, India</p></div></CardContent></Card>
          <Card className="card-hover"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 rounded-lg bg-accent/10"><Clock className="h-6 w-6 text-accent" /></div><div><h3 className="font-semibold">Hours</h3><p className="text-muted-foreground">24/7 Available</p></div></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Send Message</CardTitle><CardDescription>We'll respond promptly</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><Input placeholder="First Name" /><Input placeholder="Last Name" /></div>
            <Input placeholder="Email" type="email" /><Input placeholder="Phone" />
            <Textarea placeholder="Your Message..." className="min-h-32" />
            <Button className="w-full gradient-hero text-white border-0"><Send className="mr-2 h-4 w-4" />Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, onSignup }: { onLogin: (email: string) => void; onSignup: (name: string, email: string, phone: string) => void }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <Tabs defaultValue="login" onValueChange={(v) => setIsSignup(v === 'signup')}>
      <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
      <TabsContent value="login" className="space-y-4 mt-4">
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full gradient-hero text-white border-0" onClick={() => onLogin(email)}>Login</Button>
      </TabsContent>
      <TabsContent value="signup" className="space-y-4 mt-4">
        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full gradient-hero text-white border-0" onClick={() => onSignup(name, email, phone)}>Create Account</Button>
      </TabsContent>
    </Tabs>
  );
}

export default App;
