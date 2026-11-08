import { useId } from 'react';

interface RoyalCrownProps {
  className?: string;
}

/** Jewelled gold crown with velvet cap, pearls, ruby, emeralds and sapphires. */
export default function RoyalCrown({ className }: RoyalCrownProps) {
  const p = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">

  <defs>
    <linearGradient id={`${p}-gold`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff6d0"/>
      <stop offset="0.25" stopColor="#f3d27a"/>
      <stop offset="0.55" stopColor="#c8962e"/>
      <stop offset="0.8" stopColor="#8a5f14"/>
      <stop offset="1" stopColor="#e2b955"/>
    </linearGradient>
    <linearGradient id={`${p}-goldH`} x1="0" x2="1">
      <stop offset="0" stopColor="#7a5212"/>
      <stop offset="0.2" stopColor="#d9a842"/>
      <stop offset="0.45" stopColor="#fff3c4"/>
      <stop offset="0.6" stopColor="#e0b24c"/>
      <stop offset="1" stopColor="#6e4a10"/>
    </linearGradient>
    <linearGradient id={`${p}-velvet`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9f1239"/>
      <stop offset="1" stopColor="#4c0519"/>
    </linearGradient>
    <radialGradient id={`${p}-ruby`} cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#ffd1d9"/>
      <stop offset="0.25" stopColor="#f43f5e"/>
      <stop offset="0.7" stopColor="#9f1239"/>
      <stop offset="1" stopColor="#4c0519"/>
    </radialGradient>
    <radialGradient id={`${p}-emerald`} cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#d1fae5"/>
      <stop offset="0.3" stopColor="#10b981"/>
      <stop offset="1" stopColor="#064e3b"/>
    </radialGradient>
    <radialGradient id={`${p}-sapph`} cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#dbeafe"/>
      <stop offset="0.3" stopColor="#3b82f6"/>
      <stop offset="1" stopColor="#1e3a8a"/>
    </radialGradient>
    <radialGradient id={`${p}-pearl`} cx="0.35" cy="0.3" r="0.7">
      <stop offset="0" stopColor="#ffffff"/>
      <stop offset="0.6" stopColor="#f1e7d6"/>
      <stop offset="1" stopColor="#b8a78a"/>
    </radialGradient>
  </defs>
  {/* velvet cap */}
  <path d="M26 66 Q24 30 60 26 Q96 30 94 66 Z" fill={`url(#${p}-velvet)`}/>
  <path d="M40 60 Q42 38 60 34" fill="none" stroke="#fda4af" strokeOpacity="0.25" strokeWidth="3"/>
  {/* arches */}
  <path d="M22 70 Q30 30 60 22 Q90 30 98 70" fill="none" stroke={`url(#${p}-goldH)`} strokeWidth="5"/>
  <path d="M60 22 L60 70" stroke={`url(#${p}-goldH)`} strokeWidth="4.5"/>
  {/* points with pearls */}
  <path d="M14 72 L18 40 L32 58 L45 32 L60 54 L75 32 L88 58 L102 40 L106 72 Z" fill={`url(#${p}-gold)`} stroke="#6e4a10" strokeWidth="0.8" strokeLinejoin="round"/>
  <path d="M18 44 L30 60 M45 36 L58 55 M75 36 L86 58 M102 44" fill="none" stroke="#fff6d0" strokeOpacity="0.6" strokeWidth="0.8"/>
  <circle cx="18" cy="38" r="4" fill={`url(#${p}-pearl)`}/>
  <circle cx="45" cy="30" r="4" fill={`url(#${p}-pearl)`}/>
  <circle cx="75" cy="30" r="4" fill={`url(#${p}-pearl)`}/>
  <circle cx="102" cy="38" r="4" fill={`url(#${p}-pearl)`}/>
  {/* orb & cross on top */}
  <circle cx="60" cy="16" r="6" fill={`url(#${p}-gold)`} stroke="#6e4a10" strokeWidth="0.6"/>
  <path d="M60 2 v8 M56 6 h8" stroke={`url(#${p}-goldH)`} strokeWidth="2.6" strokeLinecap="round"/>
  <circle cx="58" cy="14" r="1.6" fill="#fff" opacity="0.8"/>
  {/* small gems on points */}
  <path d="M45 44 l3 4 -3 4 -3 -4z" fill={`url(#${p}-sapph)`}/>
  <path d="M75 44 l3 4 -3 4 -3 -4z" fill={`url(#${p}-sapph)`}/>
  {/* band */}
  <rect x="12" y="68" width="96" height="18" rx="3" fill={`url(#${p}-gold)`} stroke="#6e4a10" strokeWidth="0.8"/>
  <rect x="12" y="69" width="96" height="3" rx="1.5" fill="#fff6d0" opacity="0.55"/>
  <rect x="12" y="83" width="96" height="3" rx="1.5" fill="#6e4a10" opacity="0.45"/>
  {/* pearl rows */}
  <g fill={`url(#${p}-pearl)`}>
    <circle cx="18" cy="70.5" r="1.4"/><circle cx="26" cy="70.5" r="1.4"/><circle cx="34" cy="70.5" r="1.4"/><circle cx="86" cy="70.5" r="1.4"/><circle cx="94" cy="70.5" r="1.4"/><circle cx="102" cy="70.5" r="1.4"/>
  </g>
  {/* band jewels */}
  <ellipse cx="60" cy="77" rx="7" ry="6" fill={`url(#${p}-ruby)`} stroke={`url(#${p}-goldH)`} strokeWidth="1.4"/>
  <ellipse cx="38" cy="77" rx="4.5" ry="4" fill={`url(#${p}-emerald)`} stroke={`url(#${p}-goldH)`} strokeWidth="1.2"/>
  <ellipse cx="82" cy="77" rx="4.5" ry="4" fill={`url(#${p}-emerald)`} stroke={`url(#${p}-goldH)`} strokeWidth="1.2"/>
  <ellipse cx="22" cy="77" rx="3" ry="3" fill={`url(#${p}-sapph)`} stroke={`url(#${p}-goldH)`} strokeWidth="1"/>
  <ellipse cx="98" cy="77" rx="3" ry="3" fill={`url(#${p}-sapph)`} stroke={`url(#${p}-goldH)`} strokeWidth="1"/>
  <circle cx="57.5" cy="74.5" r="1.6" fill="#fff" opacity="0.85"/>
  <circle cx="36.8" cy="75.5" r="1" fill="#fff" opacity="0.8"/>
  <circle cx="80.8" cy="75.5" r="1" fill="#fff" opacity="0.8"/>
  {/* twinkle on the ruby */}
  <path className="crown-twinkle" d="M57.5 70 l1 3.5 3.5 1 -3.5 1 -1 3.5 -1 -3.5 -3.5 -1 3.5 -1z" fill="#fff"/>
    </svg>
  );
}
