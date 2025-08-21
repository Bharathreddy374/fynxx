// app/api/admin/proofs/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import Campaign from '@/models/Campaign';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

    // Security Check: Only admins can access this route
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    // Find all applications with 'submitted' state and populate related data
    const submittedApplications = await Application.find({ state: 'submitted' })
      .populate({ path: 'influencerId', model: User, select: 'name email' })
      .populate({ path: 'campaignId', model: Campaign, select: 'title rewardAmount' });
    
    return NextResponse.json(submittedApplications);

  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    console.error("Failed to fetch proofs:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}