// app/api/admin/users/approve/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';
import { requireAdmin } from '@/lib/adminAuth'; // Import the helper

const approveUserSchema = z.object({
  userId: z.string(),
  decision: z.enum(['approved', 'rejected']),
});

export async function POST(request: Request) {
  // Use the requireAdmin helper for consistent auth checks
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const validation = approveUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    const { userId, decision } = validation.data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: decision },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);

  } catch (err) {
    console.error("User approval error:", err);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}