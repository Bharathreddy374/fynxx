// models/Campaign.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  brief: string;
  rewardAmount: number;
  platform: 'instagram' | 'youtube' | 'any';
  status: 'active' | 'closed';
}

const CampaignSchema: Schema = new Schema({
  title: { type: String, required: true },
  brief: { type: String, required: true },
  rewardAmount: { type: Number, required: true },
  platform: { type: String, enum: ['instagram', 'youtube', 'any'], required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
}, { timestamps: true });

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;