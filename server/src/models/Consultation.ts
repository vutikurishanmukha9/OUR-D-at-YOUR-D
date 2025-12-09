import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
}

export interface IConsultation extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | null;
    symptoms: string;
    ayurvedicMedicines: IMedicine[];
    allopathicMedicines: IMedicine[];
    aiAnalysis: string;
    isGuestConsultation: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
    {
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        timing: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const consultationSchema = new Schema<IConsultation>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        symptoms: {
            type: String,
            required: [true, 'Symptoms are required']
        },
        ayurvedicMedicines: {
            type: [medicineSchema],
            default: []
        },
        allopathicMedicines: {
            type: [medicineSchema],
            default: []
        },
        aiAnalysis: {
            type: String,
            default: ''
        },
        isGuestConsultation: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Index for user queries
consultationSchema.index({ user: 1, createdAt: -1 });

const Consultation = mongoose.model<IConsultation>('Consultation', consultationSchema);

export default Consultation;
