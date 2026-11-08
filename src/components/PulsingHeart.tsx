import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Heart } from 'lucide-react';

const HOLD_THRESHOLD_MS = 1300;
const RING_RADIUS = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const BURST_PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const distance = 70 + (i % 5) * 25;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    size: 12 + (i % 5) * 5,
    delay: (i % 4) * 0.05,
  };
});

export default function PulsingHeart() {
  const [tapBoost, setTapBoost] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [bursting, setBursting] = useState(false);

  const rafRef = useRef<number | null>(null);
  const holdStartRef = useRef(0);
  const burstTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tapBoost) return;
    const timer = window.setTimeout(() => setTapBoost(false), 2500);
    return () => window.clearTimeout(timer);
  }, [tapBoost]);

  useEffect(() => {
    if (!holding) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    holdStartRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_THRESHOLD_MS, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        setBurstKey((k) => k + 1);
        setBursting(true);
        setHolding(false);
        setHoldProgress(0);
        if (navigator.vibrate) navigator.vibrate([30, 50, 80]);
        burstTimerRef.current = window.setTimeout(() => setBursting(false), 1800);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding]);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    };
  }, []);

  const handlePointerDown = () => {
    setTapBoost(true);
    setHolding(true);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handlePointerUp = () => {
    if (holdProgress < 1) {
      setHolding(false);
      setHoldProgress(0);
    }
  };

  const scale = 1 + holdProgress * 0.45;
  const glowOpacity = 0.2 + holdProgress * 0.6;
  const ringOffset = RING_CIRCUMFERENCE * (1 - holdProgress);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-label="قلب سناء النابض"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative flex h-44 w-44 touch-none select-none items-center justify-center rounded-full [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(220,38,38,${glowOpacity}) 0%, rgba(190,18,60,${glowOpacity * 0.4}) 35%, transparent 70%)`,
            filter: 'blur(16px)',
          }}
        />

        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
          <circle
            cx="80"
            cy="80"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(244,67,54,0.85)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={holding ? ringOffset : RING_CIRCUMFERENCE}
            style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>

        <div
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transition: holding ? 'transform 16ms linear' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg
            width="88"
            height="80"
            viewBox="0 0 120 110"
            className={tapBoost ? 'anim-heartbeat-fast' : 'anim-heartbeat-real'}
          >
            <defs>
              <radialGradient id="heart-grad" cx="35%" cy="28%" r="80%">
                <stop offset="0%" stopColor="#ff6b7a" />
                <stop offset="35%" stopColor="#e02130" />
                <stop offset="75%" stopColor="#a01020" />
                <stop offset="100%" stopColor="#5e0810" />
              </radialGradient>
              <filter id="heart-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M60 100 C60 100, 10 65, 10 35 C10 18, 24 8, 38 8 C48 8, 55 14, 60 22 C65 14, 72 8, 82 8 C96 8, 110 18, 110 35 C110 65, 60 100, 60 100 Z"
              fill="url(#heart-grad)"
              filter="url(#heart-glow)"
            />
            <ellipse cx="38" cy="26" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-30 38 26)" />
          </svg>
        </div>

        {bursting && (
          <div
            key={burstKey}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
          >
            {BURST_PARTICLES.map((p, i) => (
              <Heart
                key={i}
                className="heart-burst absolute fill-rose-500 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                style={
                  {
                    width: p.size,
                    height: p.size,
                    animationDelay: `${p.delay}s`,
                    '--burst-x': `${p.x}px`,
                    '--burst-y': `${p.y}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
      </button>

      <p dir="rtl" className="text-xs text-amber-200/50">
        {holding ? 'استمري بالضغط...' : 'اضغطي واستمري على القلب'}
      </p>
    </div>
  );
}
