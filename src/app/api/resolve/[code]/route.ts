import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models";

interface Params {
  params: { code: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const eventDoc = await EventModel.findOne({
      code: params.code.toUpperCase(),
    }).exec();
    if (!eventDoc)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: eventDoc._id.toString(),
      code: eventDoc.code,
      name: eventDoc.name,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
