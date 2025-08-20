// app/api/campaigns/[id]/apply/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import Campaign from '@/models/Campaign';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JwtPayload {
  sub: string;
  role: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await request.text(); 

    await dbConnect();
    const campaignId = params.id;
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    const influencerId = decoded.sub;

    if (decoded.role !== 'influencer') {
        return NextResponse.json({ error: 'Only influencers can apply' }, { status: 403 });
    }

    // Check if the campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Check if the user has already applied
    const existingApplication = await Application.findOne({ campaignId, influencerId });
    if (existingApplication) {
        return NextResponse.json({ error: 'You have already applied to this campaign' }, { status: 409 });
    }

    const newApplication = new Application({
      campaignId,
      influencerId,
    });

    await newApplication.save();

    return NextResponse.json({ message: 'Successfully applied to campaign' }, { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    console.error("Apply to campaign error:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}