'use client';

import { motion } from 'framer-motion';

const ORBS = [
  {
    size: 360,
    x: '-15%',
    y: '10%',
    gradient: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.45), rgba(59,130,246,0.12) 55%, transparent 70%)'
  },
  {
    size: 240,
    x: '70%',
    y: '12%',
    gradient: 'radial-gradient(circle at 60% 40%, rgba(236,72,153,0.5), rgba(168,85,247,0.18) 60%, transparent 75%)'
  },
  {
    size: 420,
    x: '30%',
    y: '65%',
    gradient: 'radial-gradient(circle at 40% 30%, rgba(6,182,212,0.38), rgba(37,99,235,0.16) 55%, transparent 80%)'
  }
];

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, background: orb.gradient }}
          initial={{ opacity: 0.4, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.7, 0.45],
            scale: [0.85, 1, 0.9],
            rotate: [0, 12, -8, 0]
          }}
          transition={{ duration: 16 + index * 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.65)_0%,_rgba(15,23,42,0.95)_70%)]" />
    </div>
  );
}
