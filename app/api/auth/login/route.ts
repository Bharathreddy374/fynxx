// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/jwt';
import { IUser } from '@/models/User'; // Import the IUser interface

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = validation.data;

  const user: IUser | null = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const payload = { 
    sub: user._id.toString(), 
    role: user.role, 
    status: user.status 
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  
  const response = NextResponse.json({ user: userResponse });
  setAuthCookies(response, accessToken, refreshToken);

  return response;
}