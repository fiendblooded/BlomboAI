# Blombo — AI Matches for Real‑World Events

Connect the right people in minutes, not hours. Attendees chat with Blombo, share who they are and who they’re looking to meet, and instantly get curated matches — with friendly reasons why.

---

## Highlights

- **AI matchmaker**: concise, human‑readable reasons for each match
- **Chatbot‑first UX**: no forms; everything happens in a delightful chat
- **LinkedIn optional**: quick name/photo pull or manual entry fallback
- **QR + short codes**: spin up an event and share instantly
- **Admin dashboard**: share link, QR, code badge, and participants
- **Polished UI**: minimal, Notion‑like aesthetic with smooth micro‑interactions

## Product Tour

- Landing: `/` — what Blombo does and quick CTAs
- App (chat): `/app` — “create” or “join” flows in chat
- Event join: `/e/[code]/chat` — event‑specific onboarding + matching
- Admin dashboard: `/admin/events/[id]` — share links, QR, participants

## How It Works

1. Organizer creates an event in chat and shares a link/QR.
2. Guest joins, enters name + email, answers three quick prompts about themselves, and describes who they want to meet.
3. OpenAI generates a crisp profile blurb and ranks best matches in the room.
4. Blombo shows the top two matches (and can fetch two more on request).

## Tech Stack

- Frontend: Next.js 15 (App Router), React, TypeScript, styled‑components
- Backend: Next.js API routes (serverless), MongoDB via Mongoose
- Auth: NextAuth.js (LinkedIn OAuth; manual entry fallback)
- AI: OpenAI API — profile summaries + LLM‑based match ranking
- Hosting: Vercel (zero‑config deploy)

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=blombo

OPENAI_API_KEY=sk-...

NEXTAUTH_SECRET=strong-random-string
NEXTAUTH_URL=http://localhost:3000

LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Optional (photos currently disabled in UI)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

3. Run locally

```bash
npm run dev
```

4. Open

```
http://localhost:3000
```

## Key Flows (UX)

- Create event (chat) → Share QR/link → Manage in dashboard
- Join event (QR/code) → Name + Email → 3 short prompts → Get matches
- Matches as elegant cards with initials, bios, reasons, and LinkedIn links
- Ask for two more matches at any time

## API Surface (Selected)

- POST `/api/events` — create event
- GET `/api/events/:id` — read event
- POST `/api/events/:id/participants` — join (stores profile, preferences)
- POST `/api/participants/:id/match?topK=2&excludeIds=a,b` — ranked matches
- GET `/api/events/:id/participants` — list participants (admin)

## Implementation Notes

- Matching: cosine similarity replaced with LLM‑based ranking for natural reasons.
- UI: colors hardcoded for a clean Notion‑like palette; avatars are colored initials.
- Chat: assistant on the left, user on the right; bot avatar uses `public/blombo.png`.
- LinkedIn: optional sign‑in to prefill name; manual entry always supported.

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel
2. Add environment variables:
   - `MONGODB_URI`, `MONGODB_DB_NAME`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
   - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
3. Deploy — serverless API routes and pages are supported out of the box.

## Privacy & Security

- Minimal data: name, email, optional LinkedIn link, and short text prompts
- No photos by default; avatars render as colored initials
- MongoDB connection is cached across invocations for performance

## Roadmap

- Copy buttons (share link / event code)
- Live participant count + simple analytics on dashboard
- Organizer tools (pin intros, schedule rounds)

## Credits

Built with ❤️ using Next.js, styled‑components, MongoDB, NextAuth, and OpenAI.

See `LINKEDIN_SETUP.md` for provider configuration.
