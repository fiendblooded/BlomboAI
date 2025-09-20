import mongoose, { Schema, models, model } from "mongoose";

export interface EventDoc extends mongoose.Document {
  code: string;
  name: string;
  posterUrl?: string;
  websiteUrl?: string;
  description?: string;
  status: "active" | "ended";
  shareSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<EventDoc>(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    posterUrl: String,
    websiteUrl: String,
    description: String,
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
      index: true,
    },
    shareSlug: { type: String, index: true },
  },
  { timestamps: true }
);

export interface MatchEntry {
  participantId: mongoose.Types.ObjectId;
  score: number;
  createdAt: Date;
}

export interface ParticipantDoc extends mongoose.Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  answers?: Record<string, unknown>;
  aiProfile?: string;
  aiProfileEmbedding?: number[];
  preferences?: string;
  preferencesEmbedding?: number[];
  matches?: MatchEntry[];
  joinedVia?: "code" | "qr";
  lastMatchedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<ParticipantDoc>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    avatarUrl: String,
    linkedinUrl: String,
    answers: Schema.Types.Mixed,
    aiProfile: String,
    aiProfileEmbedding: { type: [Number], default: undefined },
    preferences: String,
    preferencesEmbedding: { type: [Number], default: undefined },
    matches: [
      new Schema<MatchEntry>(
        {
          participantId: {
            type: Schema.Types.ObjectId,
            ref: "Participant",
            required: true,
          },
          score: { type: Number, required: true },
          createdAt: { type: Date, default: Date.now },
        },
        { _id: false }
      ),
    ],
    joinedVia: { type: String, enum: ["code", "qr"], default: "code" },
    lastMatchedAt: Date,
  },
  { timestamps: true }
);

export const EventModel = models.Event || model<EventDoc>("Event", EventSchema);
export const ParticipantModel =
  models.Participant || model<ParticipantDoc>("Participant", ParticipantSchema);
