// models/Transaction.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  subtype: 'campaign_reward' | 'withdrawal';
  amount: number;
  ref: {
    applicationId?: mongoose.Types.ObjectId;
    withdrawalId?: mongoose.Types.ObjectId;
  };
  balanceAfter: number;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  subtype: { type: String, enum: ['campaign_reward', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  ref: {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    withdrawalId: { type: Schema.Types.ObjectId, ref: 'Withdrawal' },
  },
  balanceAfter: { type: Number, required: true },
}, { timestamps: true });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;