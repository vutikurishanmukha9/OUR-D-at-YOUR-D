import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    image: string;
    available: boolean;
    email: string;
    phone: string;
    bio: string;
    consultationFee: number;
    languages: string[];
    createdAt: Date;
    updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
    {
        name: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true
        },
        specialty: {
            type: String,
            required: [true, 'Specialty is required'],
            trim: true
        },
        rating: {
            type: Number,
            default: 4.5,
            min: [0, 'Rating cannot be negative'],
            max: [5, 'Rating cannot exceed 5']
        },
        experience: {
            type: String,
            required: [true, 'Experience is required']
        },
        image: {
            type: String,
            default: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        available: {
            type: Boolean,
            default: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone is required']
        },
        bio: {
            type: String,
            default: ''
        },
        consultationFee: {
            type: Number,
            default: 500,
            min: [0, 'Fee cannot be negative']
        },
        languages: {
            type: [String],
            default: ['English', 'Hindi']
        }
    },
    {
        timestamps: true
    }
);

const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

export default Doctor;
