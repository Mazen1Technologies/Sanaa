import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StartDateDialogProps {
  initialDate: string | null;
  onClose: () => void;
  onSaved: (date: string) => void;
}

export default function StartDateDialog({ initialDate, onClose, onSaved }: StartDateDialogProps) {
  const [value, setValue] = useState(initialDate ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todayIso = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value || value > todayIso) return;
    if (!supabase) {
      setError('إعدادات Supabase غير متوفرة، تعذّر حفظ التاريخ.');
      return;
    }

    setIsSaving(true);
    setError(null);
    const { error: saveError } = await supabase.from('love_counter').upsert({
      id: 1,
      start_date: value,
      updated_at: new Date().toISOString(),
    });
    setIsSaving(false);

    if (saveError) {
      setError('تعذّر حفظ التاريخ، حاولي مرة أخرى.');
      return;
    }
    onSaved(value);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-date-title"
        dir="rtl"
        className="anim-fade-up w-full max-w-sm rounded-3xl border border-amber-300/30 bg-[#140a0d] p-6 shadow-[0_0_40px_rgba(190,18,60,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="start-date-title" className="font-display text-xl text-amber-100">
              هدية لك
            </h2>
            <p className="mt-2 text-sm leading-[1.5] text-amber-100/70">
              اختاري يومك، وسأواصل عدّ كل يوم جميل
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="date"
            value={value}
            max={todayIso}
            onChange={(event) => setValue(event.target.value)}
            required
            className="w-full rounded-xl border border-amber-300/40 bg-black/50 px-4 py-3 text-amber-50 [color-scheme:dark] focus:border-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          />

          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm text-amber-100/80 transition hover:text-amber-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!value || isSaving}
              className="rounded-full bg-amber-300 px-6 py-2.5 text-sm font-medium text-[#2a1a05] transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'جارٍ الحفظ...' : 'حفظ التاريخ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
