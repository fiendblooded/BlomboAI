import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const update: Record<string, any> = {};
    if (typeof body.name === "string") update.name = body.name;
    if (typeof body.posterUrl === "string") update.posterUrl = body.posterUrl;
    if (typeof body.websiteUrl === "string")
      update.websiteUrl = body.websiteUrl;
    if (typeof body.description === "string")
      update.description = body.description;
    const updated = await EventModel.findByIdAndUpdate(id, update, {
      new: true,
    }).exec();
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const event = await EventModel.findById(id).exec();
    if (!event)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    event.status = "ended";
    await event.save();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
