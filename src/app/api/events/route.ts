import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models";
import { CreateEventSchema } from "@/lib/validation";
import { customAlphabet } from "nanoid";

const generateCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = CreateEventSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let code = generateCode();
    // Ensure uniqueness by retrying a few times
    for (let i = 0; i < 5; i++) {
      const exists = await EventModel.findOne({ code }).lean();
      if (!exists) break;
      code = generateCode();
    }

    const event = await EventModel.create({
      code,
      name: parse.data.name,
      posterUrl: parse.data.posterUrl || undefined,
      websiteUrl: parse.data.websiteUrl || undefined,
      description: parse.data.description || undefined,
    });

    return NextResponse.json({
      id: event._id.toString(),
      code: event.code,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
