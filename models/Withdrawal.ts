// models/Withdrawal.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  method: {
    type: 'upi';
    upiId: string;
  };
  state: 'requested' | 'approved' | 'paid' | 'rejected';
}

const WithdrawalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: {
    type: { type: String, enum: ['upi'], required: true },
    upiId: { type: String, required: true },
  },
  state: {
    type: String,
    enum: ['requested', 'approved', 'paid', 'rejected'],
    default: 'requested',
  },
}, { timestamps: true });

const Withdrawal: Model<IWithdrawal> = mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

export default Withdrawal;