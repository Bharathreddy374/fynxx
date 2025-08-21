// app/api/influencer/applications/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import Campaign from '@/models/Campaign';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import '@/models/User'; // Ensure User model is loaded

interface JwtPayload { sub: string; }

export async function GET() {
    const cookieStore =await cookies();
    const token = cookieStore.get('access_token');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        const influencerId = decoded.sub;

        // Find all applications for this influencer and populate the campaign details
        const applications = await Application.find({ influencerId }).populate({
            path: 'campaignId',
            model: Campaign
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Failed to fetch influencer applications:", error);
        return NextResponse.json({ error: 'Invalid token or server error' }, { status: 500 });
    }
}