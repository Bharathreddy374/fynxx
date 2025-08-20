// app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/models/Campaign';
import Application from '@/models/Application'; // Import the Application model
import '@/models/User';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
}

export async function GET() {
  try {
    await dbConnect();
    const cookieStore =await cookies();
    const token = cookieStore.get('access_token');

    let influencerId: string | null = null;
    if (token) {
      try {
        const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        if (decoded.role === 'influencer') {
          influencerId = decoded.sub;
        }
      } catch (e) {
        console.error("Invalid token on campaign fetch:", e);
      }
    }

    // Dummy data seeding remains the same...
    const count = await Campaign.countDocuments();
    if (count === 0) {
      await Campaign.create([
        { title: 'IG Story for Aura Skincare', brief: 'Promote our new Vitamin C serum.', rewardAmount: 500, platform: 'instagram' },
        { title: 'YouTube Short for TechGadget', brief: 'Unbox and review our new smart watch.', rewardAmount: 2500, platform: 'youtube' },
        { title: 'IG Reel for FitLife Apparel', brief: 'Showcase our new activewear line.', rewardAmount: 1500, platform: 'instagram' },
      ]);
    }

    const campaigns = await Campaign.find({ status: 'active' }).lean();

    // If the user is an influencer, check which campaigns they've applied to
    if (influencerId) {
      const userApplications = await Application.find({ influencerId }).select('campaignId');
      const appliedCampaignIds = new Set(userApplications.map(app => app.campaignId.toString()));

      const campaignsWithStatus = campaigns.map(campaign => ({
        ...campaign,
        hasApplied: appliedCampaignIds.has(campaign._id.toString()),
      }));
      return NextResponse.json(campaignsWithStatus);
    }

    return NextResponse.json(campaigns);

  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}