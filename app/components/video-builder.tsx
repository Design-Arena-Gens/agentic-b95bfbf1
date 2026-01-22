'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { platformOptions, voiceGenders, voiceTones, avatarStyles, type VideoPlan } from '@/app/lib/pipeline';
import { cn } from '@/app/lib/utils';

interface FormState {
  topic: string;
  script: string;
  duration: number;
  platform: (typeof platformOptions)[number]['value'];
  voiceGender: (typeof voiceGenders)[number]['value'];
  voiceTone: (typeof voiceTones)[number]['value'];
  avatarStyle: string;
}

const defaultState: FormState = {
  topic: '',
  script: '',
  duration: 30,
  platform: 'youtube-shorts',
  voiceGender: 'female',
  voiceTone: 'high-energy',
  avatarStyle: 'bokeh-silhouette'
};

export function VideoBuilder() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [pending, setPending] = useState(false);
  const [plan, setPlan] = useState<VideoPlan | null>(null);

  const wordsHint = useMemo(() => {
    const words = form.script.trim() ? form.script.split(/\s+/).length : 0;
    if (!words) return 'No custom script — AI will generate one.';
    const seconds = Math.round(words / 2.6);
    return `${words} words (~${seconds}s at conversational pace).`;
  }, [form.script]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      const json = (await response.json()) as VideoPlan;
      setPlan(json);
      toast.success('Generation pipeline ready.');
    } catch (error) {
      console.error(error);
      toast.error('Could not generate video plan — check inputs and retry.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative z-10 grid gap-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-panel backdrop-blur-2xl md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <Toaster richColors position="top-right" />
      <section className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Input blueprint</h2>
          <p className="text-sm text-slate-300">
            Describe the story and delivery. Leave the script empty to auto-generate a viral hook.
          </p>
        </header>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="topic">
              Video topic
            </label>
            <input
              id="topic"
              name="topic"
              required
              value={form.topic}
              onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/40"
              placeholder="e.g. AI side hustle that prints cash"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200" htmlFor="script">
                Custom script
              </label>
              <span className="text-xs text-slate-400">{wordsHint}</span>
            </div>
            <textarea
              id="script"
              name="script"
              rows={6}
              value={form.script}
              onChange={(event) => setForm((prev) => ({ ...prev, script: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/40"
              placeholder={`Optional. Paste a script or leave blank to auto-generate.`}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
              <label className="text-sm font-medium text-slate-200" htmlFor="duration">
                Duration: {form.duration}s
              </label>
              <input
                id="duration"
                type="range"
                min={15}
                max={60}
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: Number(event.target.value) }))}
              />
              <p className="text-xs text-slate-400">
                Short-form sweet spot. We balance beats to hit the algorithm-friendly pacing.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
              <label className="text-sm font-medium text-slate-200" htmlFor="platform">
                Platform
              </label>
              <select
                id="platform"
                value={form.platform}
                onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value as FormState['platform'] }))}
                className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-white outline-none"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                We align aspect ratio, pacing, and hooks to each platform&apos;s algorithm.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <InfoChip
              label="Voice gender"
              value={form.voiceGender}
              options={voiceGenders.map((voice) => ({ label: voice.label, value: voice.value }))}
              onSelect={(value) => setForm((prev) => ({ ...prev, voiceGender: value as FormState['voiceGender'] }))}
            />
            <InfoChip
              label="Voice tone"
              value={form.voiceTone}
              options={voiceTones.map((tone) => ({ label: tone.label, value: tone.value }))}
              onSelect={(value) => setForm((prev) => ({ ...prev, voiceTone: value as FormState['voiceTone'] }))}
            />
            <InfoChip
              label="Avatar"
              value={form.avatarStyle}
              options={avatarStyles.map((style) => ({ label: style.label, value: style.value }))}
              onSelect={(value) => setForm((prev) => ({ ...prev, avatarStyle: value }))}
            />
          </div>

          <motion.button
            type="submit"
            disabled={pending || !form.topic.trim()}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-blue-500/30 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Synthesizing...' : plan ? 'Rebuild plan' : 'Generate pipeline'}
          </motion.button>
        </form>
      </section>

      <aside className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Production timeline</h2>
          <p className="text-sm text-slate-300">Auto-built storyboard, narration map, and caption timing.</p>
        </header>
        {plan ? <PlanView plan={plan} /> : <EmptyState />}
      </aside>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-8 text-center text-slate-400">
      <motion.div
        className="relative h-24 w-24"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-transparent" />
      </motion.div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium text-white">No plan yet</p>
        <p className="text-sm text-slate-400">
          Configure your request and we will spin up a beat-by-beat AI production checklist.
        </p>
      </div>
    </div>
  );
}

function PlanView({ plan }: { plan: VideoPlan }) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.25em] text-sky-300">Hook</span>
        <p className="text-lg font-semibold text-white">{plan.hook}</p>
        <p className="text-sm text-slate-300">{plan.summary}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Timeline beats</h3>
        <div className="flex flex-col gap-3">
          {plan.segments.map((segment) => (
            <div
              key={segment.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">{segment.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{segment.text}</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300">
                  {segment.start.toFixed(1)}s — {segment.end.toFixed(1)}s
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
                <p>
                  <strong className="mr-1 text-sky-300">Visuals:</strong>
                  {segment.visualPrompt}
                </p>
                <p>
                  <strong className="mr-1 text-sky-300">Camera:</strong>
                  {segment.cameraAction}
                </p>
                <p>
                  <strong className="mr-1 text-sky-300">Caption pop:</strong>
                  {segment.captionStyle.emphasisWords.join(', ') || '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Voice direction</h3>
        <p className="text-sm text-slate-300">
          {plan.voice.gender} · {plan.voice.tone} · {plan.voice.pace} pace
        </p>
        <ul className="flex flex-wrap gap-2 text-xs text-slate-400">
          {plan.voice.pronunciationHints.map((hint, index) => (
            <li key={index} className="rounded-full border border-slate-700 px-3 py-1">
              {hint}
            </li>
          ))}
        </ul>
        <blockquote className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm leading-relaxed text-slate-200">
          {plan.voice.script}
        </blockquote>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Caption map</h3>
        <div className="flex flex-col gap-2">
          {plan.captions.map((caption, index) => (
            <div key={`${caption.text}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
              <span>
                {caption.at.toFixed(1)}s → {caption.duration.toFixed(1)}s
              </span>
              <span className={cn('uppercase tracking-widest', caption.emphasis && 'text-sky-300 font-semibold')}>
                {caption.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Soundtrack</h3>
        <p className="text-sm text-slate-300">{plan.soundtrack.trackName}</p>
        <p className="text-xs text-slate-400">{plan.soundtrack.vibe}</p>
      </section>

      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Export checklist</h3>
        <ul className="flex flex-col gap-2 text-xs text-slate-300">
          {plan.exportChecklist.map((item) => (
            <li key={item} className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface Option {
  label: string;
  value: string;
}

function InfoChip({ label, value, options, onSelect }: { label: string; value: string; options: Option[]; onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition',
                active
                  ? 'border-sky-400 bg-sky-400/20 text-sky-100 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                  : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-sky-400/60 hover:text-white'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
