// app/api/brand/campaigns/[id]/applications/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import '@/models/Campaign'; // Ensure Campaign model is loaded

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await request.text(); // Recommended for Vercel edge runtime
    await dbConnect();
    const campaignId = params.id;

    // In a real production app, you would verify the user's JWT here
    // and check if they are the brand owner of this specific campaign.

    const applications = await Application.find({ campaignId }).populate({
      path: 'influencerId',
      model: User,
      select: 'name email' // We only need the influencer's name and email
    });

    return NextResponse.json(applications);

  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}