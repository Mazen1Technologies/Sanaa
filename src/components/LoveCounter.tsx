import { useEffect, useState } from 'react';
import { CalendarHeart, Pencil } from 'lucide-react';
import StartDateDialog from '@/components/StartDateDialog';
import { supabase } from '@/lib/supabase';

const DAY_MS = 86_400_000;

function daysSince(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today - Date.UTC(year, month - 1, day)) / DAY_MS));
}

type LoadStatus = 'loading' | 'ready' | 'error';

export default function LoveCounter() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStartDate() {
      setStatus('loading');
      const client = supabase;
      if (!client) {
        setStatus('error');
        return;
      }

      const { data, error } = await client
        .from('love_counter')
        .select('start_date')
        .eq('id', 1)
        .maybeSingle();

      if (!active) return;
      if (error || (data !== null && typeof data.start_date !== 'string')) {
        setStatus('error');
        return;
      }
      setStartDate(data?.start_date ?? null);
      setStatus('ready');
    }

    void loadStartDate();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (status === 'loading') return null;

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-amber-100/70">
          {supabase
            ? 'تعذّر تحميل عدّاد الأيام.'
            : 'عدّاد الأيام يحتاج إعدادات Supabase لتفعيله.'}
        </p>
        {supabase && (
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="text-sm text-amber-200 underline underline-offset-4 transition hover:text-amber-100"
          >
            حاولي مرة أخرى
          </button>
        )}
      </div>
    );
  }

  const handleSaved = (date: string) => {
    setStartDate(date);
    setIsDialogOpen(false);
  };

  return (
    <>
      {startDate ? (
        <div className="anim-fade-up flex items-center gap-3 rounded-full border border-amber-300/40 bg-black/50 py-2.5 pl-5 pr-2 text-amber-100 backdrop-blur">
          <CalendarHeart className="h-5 w-5 shrink-0 text-rose-400" />
          <p className="text-sm sm:text-base">
            Together for{' '}
            <span className="font-display text-lg text-amber-200 sm:text-xl">
              {daysSince(startDate)}
            </span>{' '}
            days
          </p>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Change start date"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="anim-fade-up flex items-center gap-2 rounded-full border border-amber-300/50 bg-black/50 px-5 py-2.5 text-sm text-amber-100 backdrop-blur transition hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <CalendarHeart className="h-4 w-4 text-rose-400" />
          صُنع هذا الموقع لأجلك
        </button>
      )}

      {isDialogOpen && (
        <StartDateDialog
          initialDate={startDate}
          onClose={() => setIsDialogOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
