import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string().min(2).max(120),
  posterUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(800).optional().or(z.literal("")),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const JoinParticipantSchema = z.object({
  name: z.string().min(2).max(120),
  // Allow http(s) URL or data URL (base64 image)
  avatarUrl: z
    .string()
    .regex(
      /^(https?:\/\/[^\s]+|data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+)$/,
      {
        message: "Invalid image URL",
      }
    )
    .optional(),
  linkedinUrl: z.string().url().optional(),
  aboutYou: z.string().min(10).max(800),
  lookingFor: z.string().min(10).max(800),
});

export type JoinParticipantInput = z.infer<typeof JoinParticipantSchema>;
