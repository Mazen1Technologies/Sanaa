import { useId } from 'react';

interface WardrobeIconProps {
  className?: string;
}

/** Ornate burgundy-and-gold armoire with open doors and dresses inside. */
export default function WardrobeIcon({ className }: WardrobeIconProps) {
  const p = useId().replace(/:/g, '');

  return (
    <svg viewBox="-6 0 132 140" className={className} aria-hidden="true">

  <defs>
    <linearGradient id={`${p}-wood`} x1="0" x2="1">
      <stop offset="0" stopColor="#3a0a14"/>
      <stop offset="0.45" stopColor="#7a1528"/>
      <stop offset="0.55" stopColor="#6a1222"/>
      <stop offset="1" stopColor="#2a060e"/>
    </linearGradient>
    <linearGradient id={`${p}-door`} x1="0" x2="1">
      <stop offset="0" stopColor="#8e1c32"/>
      <stop offset="0.5" stopColor="#5c0f1f"/>
      <stop offset="1" stopColor="#3d0913"/>
    </linearGradient>
    <linearGradient id={`${p}-doorR`} x1="1" x2="0">
      <stop offset="0" stopColor="#8e1c32"/>
      <stop offset="0.5" stopColor="#5c0f1f"/>
      <stop offset="1" stopColor="#3d0913"/>
    </linearGradient>
    <linearGradient id={`${p}-gold`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff3c4"/>
      <stop offset="0.35" stopColor="#e8c766"/>
      <stop offset="0.7" stopColor="#b8892c"/>
      <stop offset="1" stopColor="#7a5a16"/>
    </linearGradient>
    <linearGradient id={`${p}-inside`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1a0508"/>
      <stop offset="1" stopColor="#2e0a12"/>
    </linearGradient>
    <radialGradient id={`${p}-glow`} cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55"/>
      <stop offset="1" stopColor="#ffd98a" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id={`${p}-dress`} x1="0" x2="1">
      <stop offset="0" stopColor="#9f1239"/>
      <stop offset="0.5" stopColor="#f43f5e"/>
      <stop offset="1" stopColor="#881337"/>
    </linearGradient>
    <linearGradient id={`${p}-mirror`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.65"/>
      <stop offset="0.4" stopColor="#9aa8b6" stopOpacity="0.2"/>
      <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.35"/>
      <stop offset="1" stopColor="#4b5563" stopOpacity="0.4"/>
    </linearGradient>
    <radialGradient id={`${p}-shadow`}>
      <stop offset="0" stopColor="#000" stopOpacity="0.6"/>
      <stop offset="1" stopColor="#000" stopOpacity="0"/>
    </radialGradient>
  </defs>

  {/* floor shadow */}
  <ellipse cx="60" cy="133" rx="58" ry="5" fill={`url(#${p}-shadow)`}/>

  {/* crown */}
  <path d="M16 26 Q60 2 104 26 Z" fill={`url(#${p}-wood)`} stroke={`url(#${p}-gold)`} strokeWidth="1.5"/>
  <path d="M48 17 Q60 8 72 17" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="1.2"/>
  <circle cx="60" cy="9" r="3" fill={`url(#${p}-gold)`}/>
  <rect x="12" y="25" width="96" height="7" rx="1.5" fill={`url(#${p}-gold)`}/>

  {/* body */}
  <rect x="16" y="32" width="88" height="88" fill={`url(#${p}-wood)`}/>
  {/* open interior */}
  <rect x="19" y="35" width="82" height="82" fill={`url(#${p}-inside)`}/>
  <rect x="19" y="35" width="82" height="82" fill={`url(#${p}-glow)`}/>
  {/* rail */}
  <rect x="19" y="44" width="82" height="2" rx="1" fill={`url(#${p}-gold)`}/>

  {/* hanging dress */}
  <path d="M60 46 l0 3" stroke={`url(#${p}-gold)`} strokeWidth="1.2"/>
  <path d="M60 46 q-3 -3 0 -4 q3 1 1 3" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="1"/>
  <path d="M51 52 L60 49 L69 52 L66 66 Q78 92 82 108 Q60 114 38 108 Q42 92 54 66 Z" fill={`url(#${p}-dress)`}/>
  <path d="M54 66 Q60 69 66 66" fill="none" stroke="#fde68a" strokeWidth="1.4"/>
  <path d="M60 70 Q56 90 50 109 M60 70 Q64 90 70 110" fill="none" stroke="#4c0519" strokeOpacity="0.45" strokeWidth="0.8"/>
  {/* second hanger hint */}
  <path d="M31 46 v3" stroke={`url(#${p}-gold)`} strokeWidth="1"/>
  <path d="M26 51 L31 49 L36 51 L35 62 Q41 84 42 102 Q31 105 20 102 Q22 84 27 62 Z" fill="#e8c766" opacity="0.85"/>
  <path d="M27 62 Q31 64 35 62" fill="none" stroke="#7a5a16" strokeWidth="0.8"/>
  <path d="M89 46 v3" stroke={`url(#${p}-gold)`} strokeWidth="1"/>
  <path d="M84 51 L89 49 L94 51 L93 62 Q99 84 100 100 Q89 103 78 100 Q80 84 85 62 Z" fill="#1c1917"/>
  <path d="M85 62 Q89 64 93 62" fill="none" stroke="#e8c766" strokeWidth="0.8"/>

  {/* left door swung open (inside face) */}
  <path d="M16 32 L1 39 L1 113 L16 120 Z" fill={`url(#${p}-door)`} stroke={`url(#${p}-gold)`} strokeWidth="1"/>
  <path d="M13 38 L4 42.5 L4 109.5 L13 114 Z" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="0.7"/>
  <circle cx="3" cy="76" r="1.4" fill={`url(#${p}-gold)`}/>
  {/* right door swung open, with mirror */}
  <path d="M104 32 L119 39 L119 113 L104 120 Z" fill={`url(#${p}-doorR)`} stroke={`url(#${p}-gold)`} strokeWidth="1"/>
  <path d="M107 39 L116 43.5 L116 108.5 L107 113 Z" fill="#c7d2dc" stroke={`url(#${p}-gold)`} strokeWidth="0.9"/>
  <path d="M107 39 L116 43.5 L116 108.5 L107 113 Z" fill={`url(#${p}-mirror)`}/>
  <path d="M109 46 L111 47 L111 70 L109 69 Z" fill="#fff" opacity="0.7"/>
  <circle cx="117" cy="76" r="1.4" fill={`url(#${p}-gold)`}/>
  {/* hinges */}
  <rect x="15" y="44" width="2" height="5" fill={`url(#${p}-gold)`}/><rect x="15" y="103" width="2" height="5" fill={`url(#${p}-gold)`}/>
  <rect x="103" y="44" width="2" height="5" fill={`url(#${p}-gold)`}/><rect x="103" y="103" width="2" height="5" fill={`url(#${p}-gold)`}/>
  {/* inner frame shading */}
  <rect x="16" y="32" width="88" height="88" fill="none" stroke="#1a0508" strokeWidth="3" opacity="0.7"/>

  {/* base & legs */}
  <rect x="12" y="119" width="96" height="6" rx="1.5" fill={`url(#${p}-gold)`}/>
  <path d="M18 125 h8 l-2 7 h-4 z M94 125 h8 l-2 7 h-4 z" fill={`url(#${p}-gold)`}/>
    </svg>
  );
}
