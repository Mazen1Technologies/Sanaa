import { useState, type CSSProperties } from 'react';

const LETTERS = ['S', 'a', 'n', 'a', 'a'];
const START_DELAY = 2.5;
/** The other letters follow once the S has been inked. */
const REST_DELAY = START_DELAY + 0.6;
/** When the light wave across the letters starts repeating. */
const WAVE_DELAY = REST_DELAY + 3;

const SPARKLES = [
  { top: '8%', left: '4%', size: 14, delay: '0s' },
  { top: '-6%', left: '38%', size: 10, delay: '1.1s' },
  { top: '4%', left: '92%', size: 16, delay: '0.5s' },
  { top: '62%', left: '-3%', size: 10, delay: '1.7s' },
  { top: '70%', left: '97%', size: 12, delay: '0.8s' },
  { top: '88%', left: '60%', size: 9, delay: '2.2s' },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" fill="#fff3c4" />
    </svg>
  );
}

export default function SanaaName() {
  const [phase, setPhase] = useState<'intro' | 'idle' | 'push'>('intro');
  const flourishDelay = REST_DELAY + 1.4;

  return (
    <span className="relative block">
      {SPARKLES.map((sparkle, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="sparkle pointer-events-none absolute"
          style={{ top: sparkle.top, left: sparkle.left, animationDelay: sparkle.delay }}
        >
          <Sparkle size={sparkle.size} />
        </span>
      ))}

      <span className="name-glow relative block pb-2 font-script text-7xl leading-tight sm:text-8xl md:text-[9.5rem]">
        <span className="sr-only">Sanaa</span>
        <span aria-hidden="true" className="inline-flex items-baseline">
          <span
            className={`swing-s px-[0.02em] ${phase === 'intro' ? '' : `is-${phase}`}`}
            style={{ '--s-delay': `${START_DELAY}s` } as CSSProperties}
            onClick={() => {
              setPhase('idle');
              requestAnimationFrame(() => requestAnimationFrame(() => setPhase('push')));
            }}
            onAnimationEnd={(event) => {
              if (event.animationName === 's-swing' || event.animationName === 's-push') setPhase('idle');
            }}
          >
            <span className="swing-s-glyph gold-text">S</span>
          </span>
          <span className="name-write" style={{ '--write-delay': `${REST_DELAY}s` } as CSSProperties}>
            {LETTERS.slice(1).map((letter, i) => (
              <span
                key={i}
                className="name-letter gold-text inline-block px-[0.02em]"
                style={{ '--wave-delay': `${WAVE_DELAY + i * 0.25}s` } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </span>
        </span>
      </span>

      <svg
        viewBox="0 0 240 24"
        aria-hidden="true"
        className="name-flourish mx-auto -mt-2 block w-44 sm:w-56 md:w-72"
        style={{ animationDelay: `${flourishDelay}s` }}
      >
        <defs>
          <linearGradient id="flourish-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#c9a13b" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff3c4" />
            <stop offset="1" stopColor="#c9a13b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M4 12 C 50 4, 80 20, 108 12 M132 12 C 160 4, 190 20, 236 12"
          fill="none"
          stroke="url(#flourish-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          d="M120 18c-5-3.6-8-6.3-8-9.2 0-2 1.5-3.5 3.4-3.5 1.9 0 3.4 1.2 4.6 2.7 1.2-1.5 2.7-2.7 4.6-2.7 1.9 0 3.4 1.5 3.4 3.5 0 2.9-3 5.6-8 9.2z"
          fill="#e11d48"
          className="flourish-heart"
        />
      </svg>

      <span
        className="anim-fade-up font-arabic mt-1 block text-2xl text-amber-100/80 sm:text-3xl"
        style={{ animationDelay: `${flourishDelay + 0.3}s` }}
      >
        سناء
      </span>
    </span>
  );
}
