// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JwtPayload {
  sub: string;
  role: string;
}

export async function GET() {
  const cookieStore =await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const users = await User.find({}).select('-passwordHash'); // Get all users, remove password
    return NextResponse.json(users);

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}