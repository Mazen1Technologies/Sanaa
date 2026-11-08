import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
}

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installed, setInstalled] = useState(isStandalone);
  const ios = isIos();

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || (!promptEvent && !ios)) return null;

  const handleClick = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setPromptEvent(null);
      return;
    }
    setShowIosHint(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        dir="rtl"
        className="anim-fade-up absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-amber-300/50 bg-black/50 px-4 py-2 text-sm text-amber-100 backdrop-blur transition hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:right-6 sm:top-6"
      >
        <Download className="h-4 w-4 text-rose-400" />
        ثبّت التطبيق
      </button>

      {showIosHint && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowIosHint(false)}
        >
          <div
            dir="rtl"
            role="dialog"
            aria-label="طريقة تثبيت التطبيق"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-amber-300/40 bg-[#14090c] p-6 text-amber-100 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowIosHint(false)}
              aria-label="إغلاق"
              className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="mb-4 font-display text-xl text-amber-200">ثبّت التطبيق على جهازك</h2>
            <ol className="space-y-3 text-sm leading-relaxed">
              <li className="flex items-center gap-2">
                <span>١. اضغط على زر المشاركة</span>
                <Share className="h-4 w-4 text-sky-400" />
                <span>في أسفل Safari</span>
              </li>
              <li>٢. اختر «إضافة إلى الشاشة الرئيسية»</li>
              <li>٣. اضغط «إضافة» وسيظهر التطبيق بين تطبيقاتك 🌹</li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
