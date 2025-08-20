// app/api/me/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JwtPayload {
  sub: string; // User ID
}

export async function GET() {
  const cookieStore =await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    const userId = decoded.sub;

    const user = await User.findById(userId).select('-passwordHash'); // Find user but exclude password hash

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error ) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}