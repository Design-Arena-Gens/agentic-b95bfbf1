import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

const sans = Figtree({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Agentic Faceless Video Studio',
  description: 'Generate viral-ready faceless videos with AI scripting, voice, captions, and cinematic visuals.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="bg-slate-950 text-slate-100">
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </main>
      </body>
    </html>
  );
}
