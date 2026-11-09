import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Loader2, Plus } from 'lucide-react';
import WardrobeIcon from '@/components/WardrobeIcon';
import AddDressDialog from '@/components/closet/AddDressDialog';
import DressViewer from '@/components/closet/DressViewer';
import FloatingHearts from '@/components/FloatingHearts';
import {
  CATEGORIES,
  deleteDress,
  fetchDresses,
  HAIR_CATEGORY,
  setDressLiked,
  type Category,
  type Dress,
} from '@/lib/dresses';
import { BUNDLED_DRESSES } from '@/lib/closetImages';

const ALL = 'الكل';
const FAVORITES = 'المفضلة';
const BUNDLED_FAVORITES_KEY = 'sanaa-closet-bundled-favorites';
type Filter = typeof ALL | typeof FAVORITES | Category;

function getBundledFavorites() {
  const stored = window.localStorage.getItem(BUNDLED_FAVORITES_KEY);
  if (!stored) return new Set<string>();

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || parsed.some((key) => typeof key !== 'string')) {
    throw new Error('تعذّر قراءة المفضلة للصور المضافة إلى الموقع');
  }
  return new Set(parsed);
}

interface ClosetProps {
  onBack: () => void;
}

export default function Closet({ onBack }: ClosetProps) {
  const [dresses, setDresses] = useState<Dress[]>(BUNDLED_DRESSES);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('ready');
  const [filter, setFilter] = useState<Filter>(ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [addingCategory, setAddingCategory] = useState<Category>('سهرة');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    let bundledDresses = BUNDLED_DRESSES;
    try {
      const favorites = getBundledFavorites();
      bundledDresses = BUNDLED_DRESSES.map((dress) => ({
        ...dress,
        liked: favorites.has(dress.staticKey ?? ''),
      }));
      setDresses(bundledDresses);
    } catch {
      setActionError('تعذّر استعادة مفضلة الصور المضافة إلى الموقع.');
    }

    fetchDresses()
      .then((rows) => {
        if (!active) return;
        setDresses([...rows, ...bundledDresses]);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('ready');
        setActionError('تعذّر تحميل الصور المحفوظة من الخزانة، لكن الصور المرفقة بالموقع ما زالت ظاهرة.');
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visible = useMemo(() => {
    if (filter === ALL) return dresses;
    if (filter === FAVORITES) return dresses.filter((dress) => dress.liked);
    return dresses.filter((dress) => dress.category === filter);
  }, [dresses, filter]);

  useEffect(() => {
    if (viewerIndex !== null && viewerIndex >= visible.length) {
      setViewerIndex(visible.length > 0 ? visible.length - 1 : null);
    }
  }, [viewerIndex, visible.length]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { [ALL]: dresses.length, [FAVORITES]: 0 };
    for (const dress of dresses) {
      result[dress.category] = (result[dress.category] ?? 0) + 1;
      if (dress.liked) result[FAVORITES] += 1;
    }
    return result;
  }, [dresses]);

  const toggleLike = useCallback(async (dress: Dress) => {
    const liked = !dress.liked;
    if (dress.staticKey) {
      try {
        const favorites = getBundledFavorites();
        if (liked) favorites.add(dress.staticKey);
        else favorites.delete(dress.staticKey);
        window.localStorage.setItem(BUNDLED_FAVORITES_KEY, JSON.stringify([...favorites]));
        setDresses((list) => list.map((item) => (item.id === dress.id ? { ...item, liked } : item)));
      } catch {
        setActionError('تعذّر حفظ المفضلة على هذا الجهاز.');
      }
      return;
    }

    setDresses((list) => list.map((item) => (item.id === dress.id ? { ...item, liked } : item)));
    try {
      await setDressLiked(dress.id, liked);
    } catch {
      setDresses((list) => list.map((item) => (item.id === dress.id ? { ...item, liked: !liked } : item)));
      setActionError('تعذّر حفظ الإعجاب، تأكد من الاتصال بالإنترنت');
    }
  }, []);

  const removeDress = useCallback(
    async (dress: Dress) => {
      if (dress.staticKey) {
        setActionError('هذه الصور مضمّنة مع الموقع ولا يمكن حذفها من الخزانة.');
        return;
      }
      try {
        await deleteDress(dress.id);
        const remaining = visible.length - 1;
        setDresses((list) => list.filter((item) => item.id !== dress.id));
        setViewerIndex((current) =>
          remaining <= 0 || current === null ? null : Math.min(current, remaining - 1)
        );
      } catch {
        setActionError(
          dress.category === HAIR_CATEGORY
            ? 'تعذّر حذف قصة الشعر، حاول مرة أخرى'
            : 'تعذّر حذف الفستان، حاول مرة أخرى'
        );
      }
    },
    [visible.length]
  );

  const filters: Filter[] = [ALL, FAVORITES, ...CATEGORIES];
  const defaultCategory: Category = CATEGORIES.includes(filter as Category) ? (filter as Category) : 'سهرة';
  const openAddDialog = (category: Category) => {
    setAddingCategory(category);
    setIsAdding(true);
  };

  return (
    <main dir="rtl" className="relative min-h-[100dvh] overflow-hidden bg-[#0b0608] pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(140,20,40,0.35),transparent_60%)]" />
      <FloatingHearts />

      <header className="relative z-10 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] text-center">
        <button
          type="button"
          onClick={onBack}
          aria-label="العودة"
          className="absolute right-4 top-[max(1.25rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-black/50 text-amber-200 backdrop-blur transition hover:bg-rose-900/60"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <WardrobeIcon className="anim-fade-up mx-auto mt-10 h-28 w-28 drop-shadow-[0_8px_24px_rgba(232,199,102,0.25)] sm:mt-2 sm:h-32 sm:w-32" />
        <p className="mt-2 text-xs tracking-[0.3em] text-rose-300/80">✦ بوتيك خاص ✦</p>
        <h1 className="anim-fade-up mt-2 leading-tight">
          <span className="gold-text font-arabic block text-4xl sm:text-5xl">خزانة</span>
          <span className="gold-text font-script block text-6xl sm:text-7xl">Sanaa</span>
        </h1>
        <p className="font-arabic mx-auto mt-3 max-w-xs text-lg text-amber-100/70">
          فساتين وقصّات شعر اخترتها لأجلكِ
        </p>
      </header>

      <nav className="no-scrollbar sticky top-0 z-20 mt-6 flex gap-2 overflow-x-auto bg-[#0b0608]/80 px-4 py-3 backdrop-blur">
        {filters.map((option) => {
          const active = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                  : 'border-amber-300/25 text-amber-100/60 hover:border-amber-300/50'
              }`}
            >
              {option === FAVORITES && (
                <Heart className={`h-3.5 w-3.5 ${active ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
              )}
              {option}
              {(counts[option] ?? 0) > 0 && <span className="text-xs text-amber-100/40">{counts[option]}</span>}
            </button>
          );
        })}
      </nav>

      {actionError && (
        <button
          type="button"
          onClick={() => setActionError(null)}
          className="relative z-10 mx-auto mt-2 block rounded-full bg-rose-900/60 px-4 py-2 text-sm text-rose-100"
        >
          {actionError}
        </button>
      )}

      <section className="relative z-10 mx-auto mt-4 max-w-5xl px-4">
        {status === 'loading' && (
          <div className="flex justify-center py-20 text-amber-200/70">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-rose-300">تعذّر فتح الخزانة الآن.</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="text-amber-200 underline underline-offset-4"
            >
              حاول مرة أخرى
            </button>
          </div>
        )}

        {status === 'ready' && visible.length === 0 && (
          <div className="anim-fade-up flex flex-col items-center gap-4 py-16 text-center">
            {filter === FAVORITES ? (
              <Heart className="h-12 w-12 text-rose-400/60" />
            ) : (
              <WardrobeIcon className="h-20 w-20 opacity-70" />
            )}
            <p className="font-arabic max-w-xs text-xl text-amber-100/70">
              {filter === FAVORITES
                ? 'اضغطي على القلب في أي صورة تعجبكِ لتظهر هنا'
                : filter === ALL
                  ? 'الخزانة تنتظر أول إضافة'
                  : filter === HAIR_CATEGORY
                    ? 'لا توجد قصّات شعر بعد'
                    : `لا توجد فساتين ${filter} بعد`}
            </p>
            {filter !== FAVORITES && (
              <button
                type="button"
                onClick={() => openAddDialog(defaultCategory)}
                className="flex items-center gap-2 rounded-full border border-amber-300/50 px-5 py-2.5 text-amber-100 transition hover:bg-rose-900/50"
              >
                <Plus className="h-4 w-4" />
                {defaultCategory === HAIR_CATEGORY ? 'أضيفي قصة شعر' : 'ضيفي فستان'}
              </button>
            )}
          </div>
        )}

        {status === 'ready' && visible.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((dress, index) => {
              const itemName = dress.category === HAIR_CATEGORY ? 'قصة شعر' : 'فستان';
              return (
                <li
                  key={dress.id}
                  className="anim-fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                >
                  <div className="dress-frame group relative aspect-[3/4] overflow-hidden rounded-2xl bg-black/40">
                    <button
                      type="button"
                      onClick={() => setViewerIndex(index)}
                      aria-label={`عرض ${itemName} ${dress.category}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={dress.imageUrl}
                        alt={dress.note || `${itemName} ${dress.category}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-10 text-right">
                        <span className="font-arabic block text-lg leading-snug text-amber-100">{dress.category}</span>
                        {dress.note && (
                          <span className="block truncate text-xs text-amber-100/60">{dress.note}</span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleLike(dress)}
                      aria-label={dress.liked ? 'إزالة من المفضلة' : 'أعجبني'}
                      aria-pressed={dress.liked}
                      className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:scale-110"
                    >
                      <Heart
                        key={String(dress.liked)}
                        className={`h-5 w-5 ${dress.liked ? 'anim-like-pop fill-rose-500 text-rose-500' : 'text-white/80'}`}
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex w-[min(100%-1rem,28rem)] -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={() => openAddDialog('سهرة')}
          aria-label="إضافة فستان"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-l from-amber-300 to-amber-500 px-3 py-3.5 text-sm font-semibold text-[#2a1208] shadow-[0_8px_30px_rgba(232,199,102,0.35)] transition hover:brightness-110 sm:gap-2 sm:px-6 sm:text-base"
        >
          <Plus className="h-5 w-5 shrink-0" />
          ضيفي فستان
        </button>
        <button
          type="button"
          onClick={() => openAddDialog(HAIR_CATEGORY)}
          aria-label="إضافة صور قصّات الشعر"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-l from-amber-300 to-amber-500 px-3 py-3.5 text-sm font-semibold text-[#2a1208] shadow-[0_8px_30px_rgba(232,199,102,0.35)] transition hover:brightness-110 sm:gap-2 sm:px-6 sm:text-base"
        >
          <Plus className="h-5 w-5 shrink-0" />
          قصّات الشعر
        </button>
      </div>

      {isAdding && (
        <AddDressDialog
          defaultCategory={addingCategory}
          onClose={() => setIsAdding(false)}
          onAdded={(dress) => {
            setDresses((list) => [dress, ...list]);
            setIsAdding(false);
            if (filter !== ALL && filter !== dress.category) setFilter(ALL);
          }}
        />
      )}

      {viewerIndex !== null && (
        <DressViewer
          dresses={visible}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          onToggleLike={(dress) => void toggleLike(dress)}
          onDelete={(dress) => void removeDress(dress)}
        />
      )}
    </main>
  );
}
