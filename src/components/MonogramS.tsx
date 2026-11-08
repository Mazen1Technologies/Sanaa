import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import RoyalCrown from '@/components/RoyalCrown';
import roseHeartWreath from '../../1793716690638.jpg';
import rose from '../../1793716690701.jpg';
import roseMonogram from '../../1793716690747.jpg';
import ornateMonogram from '../../1793716518459.jpg';

const ROSES = [
  {
    src: roseHeartWreath,
    position: 'top-[4%] -left-[6%] h-28 w-28 md:h-36 md:w-36',
    pull: 'translate(75%, 70%)',
    delay: '1.1s',
  },
  {
    src: rose,
    position: 'top-[40%] -right-[8%] h-24 w-24 md:h-32 md:w-32',
    pull: 'translate(-75%, 0%)',
    delay: '1.3s',
  },
  {
    src: roseMonogram,
    position: 'bottom-[10%] -left-[4%] h-24 w-24 md:h-32 md:w-32',
    pull: 'translate(80%, -50%)',
    delay: '1.5s',
  },
  {
    src: ornateMonogram,
    position: 'bottom-[-2%] right-[6%] h-20 w-20 md:h-28 md:w-28',
    pull: 'translate(-66%, -120%)',
    delay: '1.7s',
  },
];

const GEMS = [
  { position: 'top-[20%] right-[14%]', color: 'text-red-500', delay: '0s' },
  { position: 'top-[52%] left-[16%]', color: 'text-sky-400', delay: '0.6s' },
  { position: 'top-[58%] right-[18%]', color: 'text-emerald-400', delay: '1.2s' },
  { position: 'bottom-[12%] left-[22%]', color: 'text-rose-400', delay: '1.8s' },
];

const PULL_DURATION_MS = 1400;

export default function MonogramS() {
  const [pulled, setPulled] = useState(false);

  useEffect(() => {
    if (!pulled) return;
    const timer = window.setTimeout(() => setPulled(false), PULL_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [pulled]);

  return (
    <div className="relative flex h-[min(110vw,460px)] w-[min(80vw,340px)] items-center justify-center md:h-[540px] md:w-[420px]">
      <div
        className="anim-draw-in relative"
        style={{ animationDelay: '0.2s' }}
        onPointerDown={() => setPulled(true)}
      >
        <span className="gold-text anim-glow-pulse block select-none font-display text-[min(70vw,300px)] leading-none md:text-[340px]">
          S
        </span>
        <div className="absolute bottom-[calc(100%-1.5rem)] left-1/2 -translate-x-1/2">
          <div className="anim-drop-in" style={{ animationDelay: '0.9s' }}>
            <RoyalCrown className="h-[4.5rem] w-[5.6rem] drop-shadow-[0_0_14px_rgba(212,175,55,0.5)] md:h-24 md:w-[7.5rem]" />
          </div>
        </div>
      </div>

      {ROSES.map((rose) => (
        <div
          key={rose.src}
          className={`absolute ${rose.position} transition-transform duration-[1200ms] ease-out`}
          style={{ transform: pulled ? rose.pull : 'none' }}
        >
          <div
            className="anim-bloom h-full w-full overflow-hidden rounded-full ring-2 ring-amber-300/60 shadow-[0_0_30px_rgba(190,18,60,0.45)]"
            style={{ animationDelay: rose.delay }}
          >
            <img src={rose.src} alt="" className="anim-sway h-full w-full object-cover" />
          </div>
        </div>
      ))}

      {GEMS.map((gem) => (
        <div
          key={gem.position}
          className={`anim-drop-in absolute ${gem.position} rounded-full bg-black/60 p-1.5 ring-1 ring-amber-300/70`}
          style={{ animationDelay: `${1.6 + parseFloat(gem.delay)}s` }}
        >
          <Heart
            className={`anim-heartbeat h-7 w-7 fill-current md:h-9 md:w-9 ${gem.color}`}
            style={{ animationDelay: gem.delay }}
          />
        </div>
      ))}
    </div>
  );
}
