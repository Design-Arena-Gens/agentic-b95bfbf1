import { Metadata } from 'next';
import { VideoBuilder } from './components/video-builder';
import { FloatingOrbs } from './components/visuals/floating-orbs';

export const metadata: Metadata = {
  title: 'Agentic Faceless Video Studio',
  description: 'Transform text prompts into cinematic faceless vertical videos with AI-driven scriptwriting, narration, captions, and visuals.'
};

export default function Page() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14">
      <div className="relative z-10 flex flex-col gap-6">
        <span className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs tracking-[0.3em] uppercase text-slate-200">
          AI Video Pipeline
        </span>
        <h1 className="text-balance text-5xl font-semibold leading-tight text-white sm:text-6xl">
          Build viral-ready faceless videos in seconds.
        </h1>
        <p className="max-w-3xl text-balance text-lg text-slate-300">
          Feed a topic, vibe, and platform goals — we deliver a cinematic script, AI narration, matching backgrounds, animated captions, and export-ready video timeline.
        </p>
      </div>
      <VideoBuilder />
      <FloatingOrbs />
    </div>
  );
}
