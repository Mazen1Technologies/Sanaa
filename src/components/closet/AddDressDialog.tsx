import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { addDress, CATEGORIES, compressImage, HAIR_CATEGORY, type Category, type Dress } from '@/lib/dresses';

interface AddDressDialogProps {
  defaultCategory: Category;
  onClose: () => void;
  onAdded: (dress: Dress) => void;
}

export default function AddDressDialog({ defaultCategory, onClose, onAdded }: AddDressDialogProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const isHairStyle = category === HAIR_CATEGORY;
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, isSaving]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    if (picked) {
      setFile(picked);
      setError(null);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError(isHairStyle ? 'اختاري صورة قصة الشعر أولاً' : 'اختر صورة الفستان أولاً');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const image = await compressImage(file);
      onAdded(await addDress({ image, category, note }));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذّر حفظ الصورة');
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => !isSaving && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-dress-title"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
        className="anim-fade-up max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-amber-300/30 bg-[#140a0d] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_0_40px_rgba(190,18,60,0.25)] sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="add-dress-title" className="font-arabic text-2xl text-amber-100">
            {isHairStyle ? 'قصة شعر جديدة للخزانة' : 'فستان جديد للخزانة'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="إغلاق"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input ref={fileInput} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className={`dress-frame relative mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 text-amber-200/80 transition hover:bg-black/60 ${
              preview ? 'aspect-[3/4] h-[min(34dvh,240px)]' : 'h-32 w-full'
            }`}
          >
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2">
                <ImagePlus className="h-8 w-8 text-rose-400" />
                <span className="text-sm">اضغطي لاختيار صورة من الجوال</span>
              </span>
            )}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="-mt-2 text-sm text-amber-200/80 underline underline-offset-4"
            >
              تغيير الصورة
            </button>
          )}

          <fieldset className="flex flex-col gap-2 text-sm text-amber-100/80">
            <legend className="mb-1.5">التصنيف</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={category === option}
                  className={`rounded-full border px-4 py-1.5 transition ${
                    category === option
                      ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                      : 'border-amber-300/25 text-amber-100/60 hover:border-amber-300/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1.5 text-sm text-amber-100/80">
            {isHairStyle ? 'وصف قصة الشعر' : 'وصف الفستان'}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder={
                isHairStyle
                  ? 'مثلاً: قصة شعر قصيرة بطبقات ناعمة'
                  : 'مثلاً: فستان سهرة أحمر طويل بتطريز ذهبي'
              }
              className="resize-none rounded-xl border border-amber-300/30 bg-black/40 px-4 py-3 text-base text-amber-50 placeholder:text-amber-100/30 focus:border-amber-300/70 focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-amber-300 to-amber-500 px-6 py-3 font-semibold text-[#2a1208] transition hover:brightness-110 disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? 'جارٍ الحفظ…' : isHairStyle ? 'أضيفيها إلى الخزانة' : 'ضيفيه إلى الخزانة'}
          </button>
        </form>
      </div>
    </div>
  );
}
