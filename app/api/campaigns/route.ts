// app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/models/Campaign';
import '@/models/User';  // Ensure User model is also loaded
import { z } from 'zod';

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

const campaignSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    brief: z.string().min(10, "Brief must be at least 10 characters long"),
    rewardAmount: z.number().positive("Reward must be a positive number"),
    platform: z.enum(['instagram', 'youtube', 'any']),
});

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const validation = campaignSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
        }

        // In a real app, you would get the brand's user ID from the JWT here
        // For the POC, we'll create the campaign without linking it to a specific brand user.

        const newCampaign = await Campaign.create(validation.data);

        return NextResponse.json(newCampaign, { status: 201 });

    } catch (error) {
        console.error("Failed to create campaign:", error);
        return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
    }
}