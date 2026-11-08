import { useRef, useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setError('تعذّر تشغيل ملف النغمة. أعيدي تحميل الصفحة وحاولي مرة أخرى.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <audio
        ref={audioRef}
        src="/audio/rose-petals.mp3"
        loop
        preload="none"
        onError={() => setError('تعذّر تحميل ملف النغمة.')}
        aria-hidden="true"
        className="hidden"
      />
      {error && (
        <p role="alert" className="max-w-64 rounded-xl border border-rose-300/30 bg-black/80 px-3 py-2 text-right text-xs text-rose-200">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={() => void togglePlayback()}
        aria-label={isPlaying ? 'إيقاف النغمة' : 'تشغيل النغمة'}
        aria-pressed={isPlaying}
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-amber-300/50 bg-black/70 px-4 text-amber-200 shadow-[0_0_18px_rgba(232,199,102,0.15)] backdrop-blur transition hover:scale-105 hover:bg-rose-900/60 hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        {isPlaying ? <VolumeX className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
        <span className="text-sm">{isPlaying ? 'إيقاف النغمة' : 'تشغيل النغمة'}</span>
      </button>
    </div>
  );
}
