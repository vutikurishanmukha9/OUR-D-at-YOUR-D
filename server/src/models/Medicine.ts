import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    price: number;
    manufacturer: string;
    type: string;
    packSize: string;
    composition: string;
    description: string;
    sideEffects: string[];
    interactions: Record<string, any>;
    isDiscontinued: boolean;
}

const MedicineSchema: Schema = new Schema({
    name: { type: String, required: true, index: true },
    price: { type: Number, default: 0 },
    manufacturer: { type: String },
    type: { type: String },
    packSize: { type: String },
    composition: { type: String },
    description: { type: String },
    sideEffects: { type: [String], default: [] },
    interactions: { type: Schema.Types.Mixed, default: {} },
    isDiscontinued: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Text index for search
MedicineSchema.index({ name: 'text', description: 'text', composition: 'text' });

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
