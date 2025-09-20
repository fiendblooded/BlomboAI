Event Matcher – Connect people at events with smart matching

Tech: Next.js (App Router, TypeScript), MongoDB (Mongoose), NextAuth (LinkedIn), OpenAI, styled-components, React Query

Quick start

1. Install dependencies

```bash
npm install
```

2. Set environment variables (create .env.local)

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=event-matcher

OPENAI_API_KEY=sk-...

NEXTAUTH_SECRET=strong-random-string
NEXTAUTH_URL=http://localhost:3000

LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

3. Run the app

```bash
npm run dev
```

Open http://localhost:3000

Core flows

- Create event: Home → “Create an Event” → fill form → dashboard shows QR and share link
- Join event: Open /e/{CODE} from QR/link or use “Join an Event” and enter code
- Onboarding: Optionally “Continue with LinkedIn”, then fill About/Looking For → Join
- Matching: After joining, you’re redirected to matches, with a button to re-match

API overview

- POST /api/events – create event
- GET /api/events/:id – get event
- GET /api/resolve/:code – resolve short code → event id
- POST /api/events/:id/participants – join event (generates AI profile + embeddings)
- POST /api/participants/:id/match – get top 2 matches in event
- GET /api/events/:id/participants – list participants (admin view)
- PATCH /api/admin/events/:id – update event
- POST /api/admin/events/:id – end event

Notes & ops

- OpenAI: uses gpt-4o-mini for short bios; text-embedding-3-small for embeddings
- Mongo: connection is cached for serverless; set MONGODB_URI and MONGODB_DB_NAME
- Auth: LinkedIn via NextAuth; requires NEXTAUTH_SECRET and NEXTAUTH_URL
- Images: currently via URL inputs; consider Vercel Blob/Cloudinary later

Deploying to Vercel

1. Push to GitHub and import the repo in Vercel
2. Add environment variables in Vercel Project Settings → Environment Variables:
   - MONGODB_URI, MONGODB_DB_NAME
   - OPENAI_API_KEY
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   - LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET
3. Deploy – no extra config needed. QR links point to /e/{CODE}.
