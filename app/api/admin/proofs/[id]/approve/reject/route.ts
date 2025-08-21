// app/api/admin/proofs/[id]/reject/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const application = await Application.findById(params.id).session(session);
    if (!application || application.state !== "submitted") {
      throw new Error("Application not found or not in submitted state.");
    }

    application.state = "rejected";
    if (application.proof) {
      application.proof.status = "rejected";
    }
    await application.save({ session });

    await session.commitTransaction();
    return NextResponse.json({ message: "Proof rejected successfully." });
  } catch (err: unknown) {
    await session.abortTransaction();
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
