// app/api/applications/[id]/review/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import { z } from 'zod';
import '@/models/User'; // Ensure models are loaded

const reviewSchema = z.object({
  decision: z.enum(['accepted', 'rejected']),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();
    const applicationId = params.id;
    const body = await request.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    // In a real app, you would verify the brand's token and ownership of the campaign here

    const { decision } = validation.data;

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { state: decision },
      { new: true } // This option returns the updated document
    );

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Later, we will add logic here to credit the influencer's wallet upon approval

    return NextResponse.json(updatedApplication);

  } catch (error) {
    console.error("Failed to review application:", error);
    return NextResponse.json({ error: "Failed to review application" }, { status: 500 });
  }
}