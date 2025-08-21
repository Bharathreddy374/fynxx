// models/Application.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  campaignId: mongoose.Types.ObjectId;
  influencerId: mongoose.Types.ObjectId;
  state: 'applied' | 'accepted' | 'submitted' | 'verified' | 'rejected' | 'paid';
  // --- ADD THIS PROOF FIELD ---
  proof?: {
    link: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
  };
}

const ApplicationSchema: Schema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  influencerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: {
    type: String,
    enum: ['applied', 'accepted', 'submitted', 'verified', 'rejected', 'paid'],
    default: 'applied',
  },
  // --- ADD THIS PROOF SCHEMA ---
  proof: {
    link: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
}, { timestamps: true });

ApplicationSchema.index({ campaignId: 1, influencerId: 1 }, { unique: true });

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;