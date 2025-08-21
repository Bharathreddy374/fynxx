// app/api/admin/proofs/[id]/approve/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import Campaign from '@/models/Campaign';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    if (decoded.role !== 'admin') {
      throw new Error('Forbidden');
    }
    
    await dbConnect();
    const applicationId = params.id;

    const application = await Application.findById(applicationId).session(session);
    if (!application || application.state !== 'submitted') {
      throw new Error("Application not found or is not in a state to be approved.");
    }
    
    const influencer = await User.findById(application.influencerId).session(session);
    if (!influencer) {
      throw new Error("Influencer account not found.");
    }

    const campaign = await Campaign.findById(application.campaignId).session(session);
    if (!campaign) {
      throw new Error("Associated campaign not found.");
    }
    const rewardAmount = campaign.rewardAmount;

    // 1. Update Application status
    if (application.proof) {
      application.proof.status = 'approved';
      application.proof.reviewedBy = new mongoose.Types.ObjectId(decoded.sub);
    }
    application.state = 'verified'; // Mark as verified after payment
    await application.save({ session });

    // 2. Update Influencer's wallet balance
    const newBalance = (influencer.wallet.balance || 0) + rewardAmount;
    influencer.wallet.balance = newBalance;
    await influencer.save({ session });

    // 3. Create a transaction record for this payment
    await Transaction.create([{
      userId: influencer._id,
      type: 'credit',
      subtype: 'campaign_reward',
      amount: rewardAmount,
      ref: { applicationId: application._id },
      balanceAfter: newBalance,
    }], { session });

    await session.commitTransaction();
    
    return NextResponse.json({ message: 'Proof approved and wallet credited successfully.' });

  } catch (error: unknown) {
    await session.abortTransaction();

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.error("Proof approval failed:", error);
    return NextResponse.json({ error: (error as Error).message || "An internal server error occurred" }, { status: 500 });
  } finally {
    session.endSession();
  }
}