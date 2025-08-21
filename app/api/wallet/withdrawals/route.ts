// app/api/wallet/withdrawals/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
}

const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  upiId: z.string().min(3, "UPI ID seems too short"),
});

export async function POST(request: Request) {
  const cookieStore =await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
  try {
    await dbConnect();
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    const userId = decoded.sub;

    const body = await request.json();
    const validation = withdrawalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { amount, upiId } = validation.data;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.wallet.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const newWithdrawal = await Withdrawal.create({
      userId,
      amount,
      method: { type: 'upi', upiId },
    });

    // Note: We don't deduct the balance until an admin approves it.

    return NextResponse.json(newWithdrawal, { status: 201 });

  } catch (error) {
    console.error("Withdrawal request failed:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}