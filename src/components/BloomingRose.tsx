import { useEffect, useRef, useState, type CSSProperties } from 'react';

const ROSE_MESSAGES = [
  'سناء، وردة جميلة لكِ',
  'مع أطيب الأمنيات يا سناء',
  'سناء، حضوركِ يضيف جمالاً',
  'لكِ يا سناء كل التقدير',
];

interface PetalLayer {
  count: number;
  length: number;
  width: number;
  offset: number;
  delay: number;
}

const LAYERS: PetalLayer[] = [
  { count: 8, length: 70, width: 32, offset: 0, delay: 0 },
  { count: 7, length: 54, width: 26, offset: 22.5, delay: 0.25 },
  { count: 6, length: 40, width: 22, offset: 0, delay: 0.5 },
  { count: 5, length: 26, width: 17, offset: 36, delay: 0.75 },
];

const CLOSED_SCALE = 0.12;

const FALLING_PETALS = Array.from({ length: 8 }, (_, i) => ({
  left: 32 + (i * 7) % 36,
  x: ((i % 4) < 2 ? -1 : 1) * (30 + (i % 3) * 22),
  y: 160 + (i % 3) * 45,
  rot: ((i % 2) < 1 ? -1 : 1) * (180 + (i % 4) * 90),
  delay: (i % 4) * 0.15,
  color: ['#9b1538', '#c41e3a', '#7a1029'][i % 3],
  size: 10 + (i % 3) * 4,
}));

export default function BloomingRose() {
  const [bloomed, setBloomed] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [petalsKey, setPetalsKey] = useState(0);

  const messageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const handleTap = () => {
    if (bloomed) {
      setBloomed(false);
      setShowMessage(false);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    } else {
      setBloomed(true);
      setMessageIndex((i) => (i + 1) % ROSE_MESSAGES.length);
      setPetalsKey((k) => k + 1);
      messageTimerRef.current = window.setTimeout(() => setShowMessage(true), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleTap}
        aria-label="وردة سناء"
        className="relative touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
      >
        <div className={`relative ${!bloomed ? 'anim-rose-bounce' : ''}`}>
          <svg width="160" height="160" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="petal-grad" cx="50%" cy="85%" r="75%">
                <stop offset="0%" stopColor="#e83e5c" />
                <stop offset="45%" stopColor="#c41e3a" />
                <stop offset="100%" stopColor="#5e0c1e" />
              </radialGradient>
              <radialGradient id="inner-petal-grad" cx="50%" cy="85%" r="75%">
                <stop offset="0%" stopColor="#ff5577" />
                <stop offset="45%" stopColor="#d4204a" />
                <stop offset="100%" stopColor="#7a1029" />
              </radialGradient>
              <radialGradient id="rose-center" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4204a" />
                <stop offset="100%" stopColor="#3a0610" />
              </radialGradient>
            </defs>

            {LAYERS.map((layer, layerIdx) => {
              const gradient = layerIdx < 2 ? 'url(#petal-grad)' : 'url(#inner-petal-grad)';
              return Array.from({ length: layer.count }, (_, i) => {
                const angle = (360 / layer.count) * i + layer.offset;
                const petalDelay = layer.delay + i * 0.06;
                const w = layer.width;
                const len = layer.length;
                const path = `M 100 100 Q ${100 - w} ${100 - len * 0.5} 100 ${100 - len} Q ${100 + w} ${100 - len * 0.5} 100 100 Z`;
                return (
                  <g
                    key={`petal-${layerIdx}-${i}`}
                    className="rose-petal"
                    style={{
                      transform: `rotate(${angle}deg) scale(${bloomed ? 1 : CLOSED_SCALE})`,
                      transitionDelay: `${bloomed ? petalDelay : layer.delay * 0.4}s`,
                    }}
                  >
                    <path d={path} fill={gradient} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
                  </g>
                );
              });
            })}

            <circle
              cx="100"
              cy="100"
              r={bloomed ? 7 : 4}
              fill="url(#rose-center)"
              style={{ transition: 'r 0.8s ease 0.9s' }}
            />
          </svg>

          {showMessage && (
            <div
              dir="rtl"
              className="anim-fade-up pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <p className="font-arabic px-3 text-center text-sm leading-tight text-amber-100 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                {ROSE_MESSAGES[messageIndex]}
              </p>
            </div>
          )}

          {petalsKey > 0 && (
            <div
              key={petalsKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {FALLING_PETALS.map((p, i) => (
                <div
                  key={i}
                  className="petal-fall absolute"
                  style={
                    {
                      left: `${p.left}%`,
                      top: '50%',
                      '--fall-x': `${p.x}px`,
                      '--fall-y': `${p.y}px`,
                      '--fall-rot': `${p.rot}deg`,
                      animationDelay: `${p.delay}s`,
                    } as CSSProperties
                  }
                >
                  <svg width={p.size + 6} height={p.size + 10} viewBox="0 0 14 20">
                    <path d="M7 0 C2 5 2 15 7 20 C12 15 12 5 7 0 Z" fill={p.color} />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>

      <p dir="rtl" className="text-xs text-amber-200/50">
        {bloomed ? 'المسي لإغلاق الوردة' : 'المسي الوردة'}
      </p>
    </div>
  );
}
