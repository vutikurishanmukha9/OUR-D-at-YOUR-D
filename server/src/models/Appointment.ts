import mongoose, { Document, Schema } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentType = 'consultation' | 'home-visit' | 'video-call' | 'emergency';

export interface IAppointment extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    doctorName: string;
    date: Date;
    time: string;
    type: AppointmentType;
    status: AppointmentStatus;
    symptoms: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Doctor is required']
        },
        doctorName: {
            type: String,
            required: [true, 'Doctor name is required']
        },
        date: {
            type: Date,
            required: [true, 'Appointment date is required']
        },
        time: {
            type: String,
            required: [true, 'Appointment time is required']
        },
        type: {
            type: String,
            enum: ['consultation', 'home-visit', 'video-call', 'emergency'],
            default: 'consultation'
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        symptoms: {
            type: String,
            default: ''
        },
        notes: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: 1 });

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
