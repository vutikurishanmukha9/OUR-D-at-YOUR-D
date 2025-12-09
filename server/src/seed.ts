import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor';

dotenv.config();

const sampleDoctors = [
    {
        name: 'Dr. Priya Sharma',
        specialty: 'General Physician',
        rating: 4.8,
        experience: '8 years',
        image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'priya.sharma@healthcare.com',
        phone: '+91 98765 43210',
        bio: 'Experienced general physician specializing in preventive care and chronic disease management.',
        consultationFee: 500,
        languages: ['English', 'Hindi', 'Bengali']
    },
    {
        name: 'Dr. Rajesh Kumar',
        specialty: 'Cardiologist',
        rating: 4.9,
        experience: '12 years',
        image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'rajesh.kumar@healthcare.com',
        phone: '+91 98765 43211',
        bio: 'Senior cardiologist with expertise in interventional cardiology and heart failure management.',
        consultationFee: 1000,
        languages: ['English', 'Hindi', 'Tamil']
    },
    {
        name: 'Dr. Anita Patel',
        specialty: 'Pediatrician',
        rating: 4.7,
        experience: '10 years',
        image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'anita.patel@healthcare.com',
        phone: '+91 98765 43212',
        bio: 'Caring pediatrician dedicated to child health and development from newborn to adolescence.',
        consultationFee: 600,
        languages: ['English', 'Hindi', 'Gujarati']
    },
    {
        name: 'Dr. Suresh Menon',
        specialty: 'Dermatologist',
        rating: 4.6,
        experience: '7 years',
        image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'suresh.menon@healthcare.com',
        phone: '+91 98765 43213',
        bio: 'Expert dermatologist specializing in skin conditions, cosmetic dermatology, and laser treatments.',
        consultationFee: 800,
        languages: ['English', 'Hindi', 'Malayalam']
    },
    {
        name: 'Dr. Kavitha Reddy',
        specialty: 'Gynecologist',
        rating: 4.9,
        experience: '15 years',
        image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'kavitha.reddy@healthcare.com',
        phone: '+91 98765 43214',
        bio: 'Senior gynecologist with expertise in high-risk pregnancies and minimally invasive surgery.',
        consultationFee: 900,
        languages: ['English', 'Hindi', 'Telugu']
    },
    {
        name: 'Dr. Arun Nair',
        specialty: 'Orthopedic Surgeon',
        rating: 4.8,
        experience: '11 years',
        image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: false,
        email: 'arun.nair@healthcare.com',
        phone: '+91 98765 43215',
        bio: 'Skilled orthopedic surgeon specializing in joint replacement and sports medicine.',
        consultationFee: 1200,
        languages: ['English', 'Hindi', 'Kannada']
    },
    {
        name: 'Dr. Meera Joshi',
        specialty: 'Ayurvedic Practitioner',
        rating: 4.7,
        experience: '9 years',
        image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'meera.joshi@healthcare.com',
        phone: '+91 98765 43216',
        bio: 'Traditional Ayurvedic practitioner combining ancient wisdom with modern healthcare approaches.',
        consultationFee: 400,
        languages: ['English', 'Hindi', 'Sanskrit', 'Marathi']
    },
    {
        name: 'Dr. Vikram Singh',
        specialty: 'Neurologist',
        rating: 4.8,
        experience: '13 years',
        image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        email: 'vikram.singh@healthcare.com',
        phone: '+91 98765 43217',
        bio: 'Expert neurologist specializing in stroke care, epilepsy, and neurodegenerative disorders.',
        consultationFee: 1100,
        languages: ['English', 'Hindi', 'Punjabi']
    }
];

async function seedDatabase() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('❌ MONGODB_URI is not defined in .env file');
            process.exit(1);
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('🗑️  Cleared existing doctors');

        // Insert sample doctors
        const doctors = await Doctor.insertMany(sampleDoctors);
        console.log(`✅ Inserted ${doctors.length} sample doctors`);

        console.log('\n📋 Seeded Doctors:');
        doctors.forEach((doc, index) => {
            console.log(`   ${index + 1}. ${doc.name} - ${doc.specialty}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
