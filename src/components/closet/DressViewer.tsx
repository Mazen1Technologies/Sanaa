import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Trash2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { HAIR_CATEGORY, type Dress } from '@/lib/dresses';

interface DressViewerProps {
  dresses: Dress[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onToggleLike: (dress: Dress) => void;
  onDelete: (dress: Dress) => void;
}

const SWIPE_PX = 50;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const MAX_PAN = 360;

interface Point {
  x: number;
  y: number;
}

function distance(first: Point, second: Point) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export default function DressViewer({
  dresses,
  index,
  onIndexChange,
  onClose,
  onToggleLike,
  onDelete,
}: DressViewerProps) {
  const dress = dresses[index];
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const gestureStart = useRef<{ point: Point; pan: Point } | null>(null);
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);
  const didPinch = useRef(false);
  const hasPrev = index > 0;
  const hasNext = index < dresses.length - 1;
  const itemName = dress?.category === HAIR_CATEGORY ? 'قصة شعر' : 'فستان';

  useEffect(() => setConfirmDelete(false), [index]);

  useEffect(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    pointers.current.clear();
    gestureStart.current = null;
    pinchStart.current = null;
    didPinch.current = false;
  }, [index]);

  const updateZoom = (value: number) => {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
    setZoom(nextZoom);
    if (nextZoom === MIN_ZOOM) setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      pinchStart.current = { distance: distance(first, second), zoom };
      didPinch.current = true;
      gestureStart.current = null;
    } else {
      gestureStart.current = { point, pan };
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size >= 2 && pinchStart.current) {
      const [first, second] = [...pointers.current.values()];
      updateZoom(pinchStart.current.zoom * (distance(first, second) / pinchStart.current.distance));
      return;
    }

    if (zoom > MIN_ZOOM && gestureStart.current) {
      setPan({
        x: Math.max(-MAX_PAN, Math.min(MAX_PAN, gestureStart.current.pan.x + point.x - gestureStart.current.point.x)),
        y: Math.max(-MAX_PAN, Math.min(MAX_PAN, gestureStart.current.pan.y + point.y - gestureStart.current.point.y)),
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = gestureStart.current;
    const end = pointers.current.get(event.pointerId);
    pointers.current.delete(event.pointerId);

    if (pointers.current.size === 1) {
      const [remaining] = pointers.current.values();
      gestureStart.current = { point: remaining, pan };
      pinchStart.current = null;
    } else {
      gestureStart.current = null;
      pinchStart.current = null;
    }

    if (pointers.current.size === 0) {
      if (start && end && zoom === MIN_ZOOM && !didPinch.current) {
        const delta = end.x - start.point.x;
        if (delta > SWIPE_PX && hasNext) onIndexChange(index + 1);
        if (delta < -SWIPE_PX && hasPrev) onIndexChange(index - 1);
      }
      didPinch.current = false;
    }
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    gestureStart.current = null;
    pinchStart.current = null;
    if (pointers.current.size === 0) didPinch.current = false;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      // RTL: left arrow moves forward
      if (event.key === 'ArrowLeft' && hasNext) onIndexChange(index + 1);
      if (event.key === 'ArrowRight' && hasPrev) onIndexChange(index - 1);
      if (event.key === '+' || event.key === '=') updateZoom(zoom + 0.5);
      if (event.key === '-') updateZoom(zoom - 0.5);
      if (event.key === '0') updateZoom(MIN_ZOOM);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, hasNext, hasPrev, onClose, onIndexChange, zoom]);

  if (!dress) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label={`${itemName} ${dress.category}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#0b0608]/97 backdrop-blur"
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <span className="text-sm text-amber-100/50">
          {index + 1} / {dresses.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="flex h-10 w-10 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden px-4"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onWheel={handleWheel}
      >
        <img
          key={dress.id}
          src={dress.imageUrl}
          alt={dress.note || `${itemName} ${dress.category}`}
          draggable={false}
          className="anim-fade-up dress-frame max-h-full max-w-full select-none rounded-2xl object-contain transition-transform duration-150"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        />
        <div className="absolute bottom-4 right-1/2 z-10 flex translate-x-1/2 items-center gap-2 rounded-full border border-amber-200/20 bg-black/60 p-1.5 backdrop-blur">
          <button
            type="button"
            onClick={() => updateZoom(zoom - 0.5)}
            onPointerDown={(event) => event.stopPropagation()}
            disabled={zoom === MIN_ZOOM}
            aria-label="تصغير الصورة"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amber-100 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="min-w-12 text-center text-xs text-amber-100/80">{Math.round(zoom * 100)}٪</span>
          <button
            type="button"
            onClick={() => updateZoom(zoom + 0.5)}
            onPointerDown={(event) => event.stopPropagation()}
            disabled={zoom === MAX_ZOOM}
            aria-label="تكبير الصورة"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amber-100 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
        {hasPrev && (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            aria-label="السابق"
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-amber-200 backdrop-blur transition hover:bg-rose-900/70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            aria-label="التالي"
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-amber-200 backdrop-blur transition hover:bg-rose-900/70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="mx-auto w-full max-w-lg px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center">
        <h2 className="gold-text font-arabic text-3xl leading-snug">{dress.category}</h2>
        {dress.note && <p className="font-arabic mt-2 text-lg leading-relaxed text-amber-100/80">{dress.note}</p>}

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onToggleLike(dress)}
            aria-pressed={dress.liked}
            className={`flex items-center gap-2 rounded-full border px-6 py-2.5 transition ${
              dress.liked
                ? 'border-rose-500 bg-rose-600/25 text-rose-100'
                : 'border-amber-300/40 text-amber-100 hover:bg-rose-900/40'
            }`}
          >
            <Heart
              key={String(dress.liked)}
              className={`h-5 w-5 ${dress.liked ? 'anim-like-pop fill-rose-500 text-rose-500' : 'text-rose-300'}`}
            />
            {dress.liked ? 'في المفضلة' : 'أعجبني'}
          </button>

          {!dress.staticKey &&
            (confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => onDelete(dress)}
                  className="rounded-full bg-rose-700 px-4 py-2.5 text-white"
                >
                  حذف نهائياً
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-2 text-amber-100/70">
                  إلغاء
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label="حذف الفستان"
                className="flex h-11 w-11 items-center justify-center rounded-full text-amber-100/40 transition hover:bg-rose-900/40 hover:text-rose-300"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
