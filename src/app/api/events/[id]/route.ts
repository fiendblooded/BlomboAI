import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const eventDoc = await EventModel.findById(params.id).exec();
    if (!eventDoc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const event = eventDoc.toObject();
    return NextResponse.json({
      id: eventDoc._id.toString(),
      code: event.code,
      name: event.name,
      posterUrl: event.posterUrl || null,
      websiteUrl: event.websiteUrl || null,
      description: event.description || null,
      status: event.status,
      createdAt: event.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
