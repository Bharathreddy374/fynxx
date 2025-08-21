// app/api/admin/campaigns/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Campaign from "@/models/Campaign";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbConnect();
  const campaigns = await Campaign.find();
  return NextResponse.json(campaigns);
}
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbConnect();
  const body = await request.json();
  const campaign = await Campaign.create(body);
  return NextResponse.json(campaign);
}

