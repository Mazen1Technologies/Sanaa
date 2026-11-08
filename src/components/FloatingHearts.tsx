import { Heart } from 'lucide-react';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 43) % 100,
  delay: (i * 1.7) % 14,
  duration: 13 + (i % 6) * 2.5,
  size: 10 + (i % 4) * 6,
  rose: i % 3 !== 0,
}));

export default function FloatingHearts() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <Heart
          key={i}
          className={`anim-rise absolute bottom-0 fill-current ${
            p.rose ? 'text-rose-600/50' : 'text-amber-300/40'
          }`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
