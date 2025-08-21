// lib/adminAuth.ts
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

interface JwtPayload { sub: string; role: string }

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  try {
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    if (decoded.role !== "admin") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { decoded };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
    } else {
      return { error: NextResponse.json({ error: "Unknown error occurred" }, { status: 401 }) };
    }
  }
}
