// app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/models/Campaign';

export async function GET() {
  try {
    await dbConnect();

    // For the POC, we'll add some dummy data if no campaigns exist
    const count = await Campaign.countDocuments();
    if (count === 0) {
      await Campaign.create([
        { title: 'IG Story for Aura Skincare', brief: 'Promote our new Vitamin C serum.', rewardAmount: 500, platform: 'instagram' },
        { title: 'YouTube Short for TechGadget', brief: 'Unbox and review our new smart watch.', rewardAmount: 2500, platform: 'youtube' },
        { title: 'IG Reel for FitLife Apparel', brief: 'Showcase our new activewear line.', rewardAmount: 1500, platform: 'instagram' },
      ]);
    }

    const campaigns = await Campaign.find({ status: 'active' });
    return NextResponse.json(campaigns);

  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}