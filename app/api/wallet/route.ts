// app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

import Transaction from '@/models/Transaction';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string; // User ID
}

export async function GET() {
  const cookieStore =await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    const userId = decoded.sub;

    const user = await User.findById(userId).select('wallet');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      balance: user.wallet.balance || 0,
      transactions,
    });

  } catch (error) {
    console.error("Failed to fetch wallet data:", error);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 500 });
  }
}