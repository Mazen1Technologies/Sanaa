import { useId } from 'react';

interface LoveLetterIconProps {
  className?: string;
}

/** Cream envelope with gold trim, sealed with a red heart wax seal. */
export default function LoveLetterIcon({ className }: LoveLetterIconProps) {
  const p = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">

  <defs>
    <linearGradient id={`${p}-paper`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fbf1dc"/>
      <stop offset="1" stopColor="#e9d6ae"/>
    </linearGradient>
    <linearGradient id={`${p}-flap`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f3e3c0"/>
      <stop offset="1" stopColor="#d9c08c"/>
    </linearGradient>
    <linearGradient id={`${p}-trim`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff3c4"/>
      <stop offset="0.5" stopColor="#d4a548"/>
      <stop offset="1" stopColor="#8a6a1f"/>
    </linearGradient>
    <radialGradient id={`${p}-wax`} cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#f43f5e"/>
      <stop offset="0.6" stopColor="#be123c"/>
      <stop offset="1" stopColor="#7f1d1d"/>
    </radialGradient>
  </defs>
  <rect x="3" y="7" width="58" height="38" rx="3" fill={`url(#${p}-paper)`} stroke={`url(#${p}-trim)`} strokeWidth="1.2"/>
  <path d="M3.6 43.5 L26 25 M60.4 43.5 L38 25" stroke="#c9ad78" strokeWidth="1" fill="none"/>
  <path d="M3.5 8.5 L32 30 L60.5 8.5" fill={`url(#${p}-flap)`} stroke={`url(#${p}-trim)`} strokeWidth="1.2" strokeLinejoin="round"/>
  <path d="M8 9.5 L32 27.5 L56 9.5" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.6"/>
  {/* wax seal */}
  <path d="M32 21.5 c3.2 0 6.4 1.2 7.4 4.1 c1.3 3.6-1.1 7.8-4.4 9 c-2 .8-4.5 .9-6.4 0 c-3.4-1.5-5.4-5.6-3.9-9 c1.1-2.8 4.1-4.1 7.3-4.1z" fill={`url(#${p}-wax)`}/>
  <path d="M32 33 c-2.6-1.9-4.2-3.3-4.2-4.9 0-1.1.8-1.9 1.8-1.9 1 0 1.8.6 2.4 1.4.6-.8 1.4-1.4 2.4-1.4 1 0 1.8.8 1.8 1.9 0 1.6-1.6 3-4.2 4.9z" fill="#ffe4e6" fillOpacity="0.85"/>
    </svg>
  );
}
