# WitBuddy Clearance

A mobile-first chatbot that guides Western Institute of Technology students through the clearance process:
next office, locations, document checklists, a persistent progress tracker, and Official / Verify badges.

**Stack:** React + Vite, Tailwind CSS, Lucide icons, Vercel serverless function (`api/chat.js`), Google Gemini (or Groq), localStorage. All free tiers.

## Project layout

```
api/chat.js                  Secure AI endpoint (key stays on the server, guardrails, fallback)
shared/clearanceData.js      Offices, locations, requirements (edit this to update everything)
shared/fallback.js           Rule-based answers used if the AI is down or rate limited
src/App.jsx                  Layout, collapsible sidebar, persisted state
src/components/ChatWindow.jsx
src/components/ClearanceTracker.jsx
```

## 1. Get a free API key (pick one)

**Google Gemini (recommended)**
1. Open https://aistudio.google.com/apikey and sign in with a Google account.
2. Click **Create API key** and copy it.
3. Free-tier limits change, so check the current limits shown in AI Studio.

**Groq (alternative)**
1. Sign up at https://console.groq.com, open **API Keys**, create a key.
2. Use `GROQ_API_KEY` instead of `GEMINI_API_KEY` below.

If both are set, Gemini is used. If neither is set (or the API fails), the app still works using the built-in fallback answers.

## 2. Run locally

```bash
npm install
cp .env.example .env        # then paste your key into .env
npx vercel dev              # runs the frontend AND /api/chat at http://localhost:3000
```

`npm run dev` runs only the frontend. Chat then uses the offline fallback because `/api/chat` is not served.

## 3. Deploy free on Vercel

1. Push the project to a GitHub repository (`.env` is git-ignored, never commit keys).
2. Go to https://vercel.com, sign up with GitHub, click **Add New > Project**, and import the repo.
3. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
4. Under **Environment Variables**, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL=gemini-2.5-flash`).
5. Click **Deploy**. You get a URL like `https://witbuddy-clearance.vercel.app`.
6. After changing variables later, redeploy from the **Deployments** tab.

(Render or Railway also work, but you would convert `api/chat.js` into an Express route. Vercel needs no changes.)

## 4. Share with students

- **Link:** post the Vercel URL in class group chats and the student council page.
- **QR code:** paste the URL into a free generator such as https://www.qr-code-generator.com or https://goqr.me, download the PNG, and print it on posters near the clearance offices.
- **Phone home screen:** students can use the browser menu > **Add to Home Screen**.

## How the survey needs are covered

| Need | Where |
|---|---|
| Next office and prerequisites | "Next office" button, tracker banner, system prompt uses student progress |
| Locations and directions | `shared/clearanceData.js`, shown in tracker and answers |
| Document checklist per office | "See what to bring" in tracker, quick-action buttons |
| Progress tracker, % and no reset | `useLocalStorage('witbuddy.completed')`, separate from chat history |
| Natural language Q&A | Gemini/Groq with the knowledge base as its only source |
| Trust badges and Where to verify | `official` flag per answer; false triggers the verify notice |

## Guardrails

- API key is server-side only; per-IP rate limit; input and history length caps.
- Model must answer from the knowledge base only, set `official: false` when unsure, refuse off-topic requests, ignore instructions to change its rules, and never request personal data.
- Any API error, quota hit, or bad output degrades to `shared/fallback.js`; if the server is unreachable the browser uses the same fallback.

## Before going live

- The office data is the sample you provided. Have the Registrar confirm it, and fill in missing items such as the lost-form procedure, hours, and room numbers.
- The in-memory rate limiter resets on cold starts; for stricter limits use Vercel's firewall or an Upstash Redis free tier.
- Optional Supabase persistence is not included. localStorage is per device, so progress does not sync across devices.
