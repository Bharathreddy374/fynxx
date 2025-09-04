// lib/adminAuth.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type AdminJwtPayload = JwtPayload & { role?: string };

export async function requireAdmin(request?: Request) {
  try {
    const authHeader = request?.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AdminJwtPayload;

    if (!decoded || decoded.role !== "admin") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { user: decoded };
  } catch (err) {
    console.error("Auth error:", err);
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}
