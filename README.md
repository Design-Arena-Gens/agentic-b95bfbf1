# Agentic Faceless Video Studio

Generate viral-ready, faceless short-form videos in the browser. Drop a topic, choose voice and platform, and the app delivers a full production recipe: AI-generated script, narration directions, shot list, caption timing map, and soundtrack cues.

## 🧰 Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + Framer Motion for UI polish
- Zod-powered pipeline that transforms prompts into a detailed storyboard
- Sonner toasts for inline feedback

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and craft your video brief. Leave the script blank to let the AI generate a hook-driven narrative.

## 🧠 Features
- Smart script writer that adapts structure, pacing, and CTA per platform
- Visual storyboard with cinematic prompt suggestions and camera moves
- Narration brief including pace, tone, and pronunciation hints
- Caption timing map with emphasis words for kinetic typography
- Soundtrack recommendation plus export checklist for editors

## 🗂️ Key Directories
- `app/components/video-builder.tsx` – orchestrates the UX and renders plan output
- `app/lib/pipeline.ts` – deterministic generation engine for scripts, beats, captions, and audio
- `app/api/generate/route.ts` – server route returning the full video plan as JSON

## ✅ Scripts
- `npm run dev` – Start the local dev server
- `npm run build` – Production build verification
- `npm run lint` – ESLint (Next.js core web vitals rules)

## 📦 Deployment
When you’re ready, run:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-b95bfbf1
```

Then verify once DNS propagates:

```bash
curl https://agentic-b95bfbf1.vercel.app
```

Happy creating!
