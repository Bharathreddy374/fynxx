// app/api/admin/transactions/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbConnect();
  const transactions = await Transaction.find().populate("userId", "name email");
  return NextResponse.json(transactions);
}
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbConnect();
  const body = await request.json();
  const transaction = await Transaction.create(body);
  return NextResponse.json(transaction);
}