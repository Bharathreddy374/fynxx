// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'influencer' | 'brand' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  // Add the wallet property to the interface
  wallet: {
    balance: number;
    currency: string;
  };
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['influencer', 'brand', 'admin'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },

  // --- ADD THIS WALLET SCHEMA DEFINITION ---
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },

}, { timestamps: true });

// ... the rest of your file (pre-save hook, comparePassword method) remains the same

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (err: unknown) {
    return next(err as Error);
  }
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;