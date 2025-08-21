// app/api/applications/[id]/proof/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string; // User ID
}

const proofSchema = z.object({
  link: z.string().url("Please provide a valid URL"),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const applicationId = params.id;
    const body = await request.json();
    const validation = proofSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    const influencerId = decoded.sub;

    const application = await Application.findById(applicationId);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Security check: Ensure the user owns this application
    if (application.influencerId.toString() !== influencerId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the application with the proof link and change its state
    application.proof = {
        link: validation.data.link,
        status: 'pending', // Awaiting admin review
    };
    application.state = 'submitted';
    await application.save();

    return NextResponse.json(application);

  } catch (error) {
    console.error("Submit proof error:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}