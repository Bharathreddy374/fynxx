// app/api/admin/users/approve/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
}

const approveUserSchema = z.object({
  userId: z.string(),
  decision: z.enum(['approved', 'rejected']),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

  } catch (error) {
    console.error("User approval error:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}