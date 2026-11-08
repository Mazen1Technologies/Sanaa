import type { CSSProperties } from 'react';
import { Heart } from 'lucide-react';

const BURST_HEARTS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 110 + (i % 3) * 40;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    size: 14 + (i % 4) * 4,
    delay: (i % 3) * 0.05,
  };
});

interface HeartBurstProps {
  burstKey: number;
}

export default function HeartBurst({ burstKey }: HeartBurstProps) {
  if (burstKey === 0) return null;

  return (
    <div key={burstKey} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {BURST_HEARTS.map((heart, i) => (
        <Heart
          key={i}
          className="heart-burst absolute left-0 top-0 fill-current text-amber-300 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={
            {
              width: heart.size,
              height: heart.size,
              animationDelay: `${heart.delay}s`,
              '--burst-x': `${heart.x}px`,
              '--burst-y': `${heart.y}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
