// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['influencer', 'brand']),
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const user = new User({
      name,
      email,
      passwordHash: password,
      role,
    });

    await user.save();

    console.log("✅ User successfully created:", user.email);
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    // This will now print the exact database error to your terminal
    console.error("❌ Registration API Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}