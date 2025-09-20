import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel, ParticipantModel } from "@/lib/models";
import { JoinParticipantSchema } from "@/lib/validation";
import { embedText, generateProfileSummary } from "@/lib/ai";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = JoinParticipantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await EventModel.findById(id).exec();
    if (!event || event.status !== "active") {
      return NextResponse.json(
        { error: "Event not available" },
        { status: 404 }
      );
    }

    const { name, avatarUrl, linkedinUrl, aboutYou, lookingFor } = parsed.data;

    const aiProfile = await generateProfileSummary({
      name,
      aboutYou,
      lookingFor,
    });
    const [aiProfileEmbedding, preferencesEmbedding] = await Promise.all([
      embedText(aiProfile || aboutYou),
      embedText(lookingFor),
    ]);

    const participant = await ParticipantModel.create({
      eventId: event._id,
      name,
      avatarUrl,
      linkedinUrl,
      answers: { aboutYou, lookingFor },
      aiProfile,
      aiProfileEmbedding,
      preferences: lookingFor,
      preferencesEmbedding,
      joinedVia: "code",
    });

    return NextResponse.json({ id: participant._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const event = await EventModel.findById(id).exec();
    if (!event)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const participants = await ParticipantModel.find({ eventId: event._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .exec();
    return NextResponse.json({
      participants: participants.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        avatarUrl: p.avatarUrl || null,
        linkedinUrl: p.linkedinUrl || null,
        aiProfile: p.aiProfile || null,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
