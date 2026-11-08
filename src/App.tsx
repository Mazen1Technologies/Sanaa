import { useEffect, useState, type MouseEvent } from 'react';
import BloomingRose from '@/components/BloomingRose';
import Closet from '@/components/closet/Closet';
import WardrobeIcon from '@/components/WardrobeIcon';
import DailyMessage from '@/components/DailyMessage';
import FloatingHearts from '@/components/FloatingHearts';
import HardDaysButton from '@/components/HardDaysButton';
import HeartBurst from '@/components/HeartBurst';
import InstallButton from '@/components/InstallButton';
import LoveCounter from '@/components/LoveCounter';
import MonogramS from '@/components/MonogramS';
import MusicToggle from '@/components/MusicToggle';
import PulsingHeart from '@/components/PulsingHeart';
import SanaaName from '@/components/SanaaName';
import { speakName } from '@/lib/speakName';

const DOUBLE_TAP_DETAIL = 2;
const CLOSET_HASH = '#closet';

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function App() {
  const [burstKey, setBurstKey] = useState(0);
  const hash = useHash();

  if (hash === CLOSET_HASH) {
    return (
      <Closet
        onBack={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  const handleNameClick = (event: MouseEvent<HTMLButtonElement>) => {
    speakName();
    if (event.detail === DOUBLE_TAP_DETAIL) setBurstKey((key) => key + 1);
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#0b0608] px-4 py-12 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(140,20,40,0.35),transparent_65%)]" />
      <FloatingHearts />

      <button
        type="button"
        onClick={handleNameClick}
        aria-label="Tap to hear the name"
        className="relative z-10 flex cursor-pointer touch-manipulation select-none flex-col items-center gap-6 rounded-3xl transition-transform duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [-webkit-tap-highlight-color:transparent]"
      >
        <MonogramS />
        <span className="anim-fade-up block select-none" style={{ animationDelay: '2.4s' }}>
          <span className="name-frame block px-5 py-2 md:px-10">
            <HeartBurst burstKey={burstKey} />
            <SanaaName />
          </span>
        </span>
      </button>

      <div className="relative z-10 mt-8">
        <LoveCounter />
      </div>

      <a
        href={CLOSET_HASH}
        dir="rtl"
        className="anim-fade-up relative z-10 mt-5 flex items-center gap-2 rounded-full border border-amber-300/60 bg-gradient-to-l from-rose-950/80 to-black/60 py-2 pl-6 pr-3 text-amber-100 shadow-[0_0_25px_rgba(190,18,60,0.25)] backdrop-blur transition hover:scale-105 hover:border-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <WardrobeIcon className="h-11 w-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
        <span className="font-arabic text-lg">خزانة Sanaa</span>
      </a>

      <div className="relative z-10 mt-6 w-full px-2">
        <DailyMessage />
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-20">
        <PulsingHeart />
        <BloomingRose />
      </div>

      <MusicToggle />
      <HardDaysButton />
      <InstallButton />
    </main>
  );
}

export default App;
