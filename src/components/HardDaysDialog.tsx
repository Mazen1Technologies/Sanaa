import { useEffect, useState } from 'react';
import { ArrowRight, Crown, RefreshCw, Sparkles, X } from 'lucide-react';
import sadImage from '../../images.jfif';
import tiredImage from '../../imagesm.jfif';
import anxiousImage from '@/assets/anxious.jpg';
import {
  HARD_DAY_FOOTER,
  HARD_DAY_MESSAGES,
  MOODS,
  type Mood,
} from '@/lib/hardDayMessages';

interface HardDaysDialogProps {
  onClose: () => void;
}

export default function HardDaysDialog({ onClose }: HardDaysDialogProps) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const messages = mood ? HARD_DAY_MESSAGES[mood] : [];

  const selectMood = (id: Mood) => {
    setMood(id);
    setMessageIndex(0);
  };

  const nextMessage = () => {
    setMessageIndex((index) => (index + 1) % messages.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hard-days-title"
        dir="rtl"
        className="anim-fade-up max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-3xl border border-amber-300/30 bg-[#140a0d] p-6 shadow-[0_0_40px_rgba(190,18,60,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="hard-days-title" className="font-display text-xl text-amber-100">
              لأيام الصعوبة
            </h2>
            <p className="mt-2 text-sm leading-[1.5] text-amber-100/70">
              {mood ? 'خذي لحظة لنفسك، وهذه رسالة لكِ' : 'كيف حالك الآن؟'}
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

        {mood === null ? (
          <div className="grid grid-cols-2 gap-3">
            {MOODS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectMood(item.id)}
                className="rounded-2xl border border-amber-300/40 bg-black/50 px-3 py-4 text-sm text-amber-100 transition hover:border-amber-300 hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {mood === 'sad' && (
              <div
                key="sad-image"
                aria-hidden="true"
                className="anim-smile relative mx-auto h-16 w-16 rounded-2xl border border-amber-200/50 shadow-[0_0_30px_rgba(245,214,122,0.2)]"
              >
                <img src={sadImage} alt="" className="h-full w-full rounded-[0.9rem] object-cover" />
                <Sparkles className="anim-smile-sparkle absolute h-5 w-5 text-amber-200" />
              </div>
            )}
            {mood === 'confidence' && messageIndex === 0 ? (
              <div
                key="confidence-message"
                aria-live="polite"
                className="confidence-backdrop anim-fade-up relative isolate overflow-hidden rounded-2xl border border-amber-200/30 p-4 text-sm leading-7 text-amber-50"
              >
                <div className="relative z-10 mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-200/50 bg-amber-100/10 text-amber-200 shadow-[0_0_24px_rgba(245,214,122,0.2)]">
                    <Crown className="h-6 w-6" />
                  </span>
                  <p>{messages[messageIndex]}</p>
                </div>

                <h3 className="relative z-10 mb-2 font-arabic text-lg font-bold text-amber-200">
                  عزّزي أنوثتكِ وثقتكِ بنفسك
                </h3>

                <ul className="relative z-10 space-y-3">
                  <li>
                    <strong className="text-amber-100">امنحي نفسكِ وقتًا مستقطعًا:</strong> ابتعدي قليلًا عن صخب العالم وضغوطه، وتفرّغي لتدليل تفاصيلكِ الصغيرة. ركّزي على ما يمنح روحكِ السكينة والبهجة.
                  </li>
                  <li>
                    <strong className="text-amber-100">اعتصمي بلينكِ وعذوبتكِ:</strong> لا تدعي قسوة الحياة تُنسيكِ نعومتكِ؛ فقوتكِ تظهر في قدرتكِ على مواجهة الصعاب بقلب رقيق لا يكسره الزمن.
                  </li>
                  <li>
                    <strong className="text-amber-100">جدّدي طاقتكِ من الداخل:</strong> تذكّري إنجازاتكِ الصغيرة والكبيرة، واحتفي بكونكِ امرأة تجمع بين صلابة العقل وعذوبة المشاعر ببراعة وسحر.
                  </li>
                </ul>
              </div>
            ) : mood === 'anxious' && messageIndex === 0 ? (
              <div key="anxious-message" aria-live="polite" className="anim-fade-up space-y-4 text-sm leading-7 text-amber-50">
                <div className="flex items-center gap-3">
                  <img
                    src={anxiousImage}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-2xl border border-amber-200/50 object-cover shadow-[0_0_24px_rgba(245,214,122,0.16)]"
                  />
                  <p>{messages[messageIndex]}</p>
                </div>

                <h3 className="font-arabic text-lg font-bold text-amber-200">
                  كيف تتعاملين مع القلق برقة واحتواء، فأنتِ كالقوارير؟
                </h3>

                <ul className="space-y-3">
                  <li>
                    <strong className="text-amber-100">تنفّسي بعمق:</strong> عندما يشعر جسدكِ بالتوتر، يكون التنفس البطيء أول رسالة طمأنينة لقلبكِ. خذي نفسًا يحمل معه الهدوء، وأخرجي مع الزفير ما تشعرين به من خوف أو توتر.
                  </li>
                  <li>
                    <strong className="text-amber-100">ميّزي بين ما تستطيعين فعله وما لا يمكنكِ التحكم به:</strong> الأقدار مكتوبة، وما فاتكِ لم يكن ليصيبكِ، وما كتبه الله لكِ آتٍ لا محالة. كوني لطيفة مع نفسكِ، ولا تحمّليها فوق طاقتها بالتفكير.
                  </li>
                  <li>
                    <strong className="text-amber-100">عيشي اللحظة الحالية:</strong> يعود القلق غالبًا إلى الخوف من المستقبل. عودي إلى هذه اللحظة، وتأمّلي ما حولكِ من نِعم، وخذي الأمور خطوةً هادئة بعد خطوة.
                  </li>
                </ul>
              </div>
            ) : mood === 'tired' && messageIndex === 0 ? (
              <div key="tired-message" aria-live="polite" className="anim-fade-up space-y-4 text-sm leading-7 text-amber-50">
                <div className="flex items-center gap-3">
                  <img
                    src={tiredImage}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-2xl border border-amber-200/50 object-cover shadow-[0_0_24px_rgba(245,214,122,0.16)]"
                  />
                  <p>
                    أعلني هدنةً قصيرة مع العالم، وضعي مهامكِ جانبًا قليلًا. التعب ليس نقصًا في طاقتكِ، بل رسالة رقيقة من جسدكِ وروحكِ تطلب منكِ الحنان والدلال.
                  </p>
                </div>

                <h3 className="font-arabic text-lg font-bold text-amber-200">امنحي نفسكِ حقّ الراحة</h3>

                <ul className="space-y-3">
                  <li>
                    <strong className="text-amber-100">أغمضي عينيكِ:</strong> لا داعي لأن تكوني مثالية طوال الوقت. يحقّ لكِ أن تتوقفي وتسترخي وتكتفي بالراحة لبعض الوقت.
                  </li>
                  <li>
                    جهّزي لنفسكِ مكانًا دافئًا ومريحًا، واستمعي إلى صوت هادئ، أو تنفّسي بعمق. تخيّلي ثقل التعب يغادر كتفيكِ مع كل زفير.
                  </li>
                  <li>
                    <strong className="text-amber-100">كل شيء يستطيع الانتظار:</strong> العالم لن يتوقف إن أخذتِ استراحة قصيرة، وأنتِ تستحقينها لتعودي أكثر نشاطًا وراحة.
                  </li>
                </ul>
              </div>
            ) : (
              <p
                key={`${mood}-${messageIndex}`}
                aria-live="polite"
                className="anim-fade-up min-h-[7rem] text-base leading-[1.5] text-amber-50"
              >
                {mood === 'sad' && messageIndex === 0 ? (
                  <>
                    {messages[messageIndex]}{' '}
                    <strong className="font-bold text-amber-200">
                      جميلة، وطيبة، وأنكِ تستحقين كل السعادة في هذا العالم.
                    </strong>
                  </>
                ) : (
                  messages[messageIndex]
                )}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMood(null)}
                className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-amber-100/80 transition hover:text-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <ArrowRight className="h-4 w-4" />
                تغيير الحالة
              </button>
              <button
                type="button"
                onClick={nextMessage}
                className="flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-medium text-[#2a1a05] transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
              >
                <RefreshCw className="h-4 w-4" />
                رسالة أخرى
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 border-t border-amber-300/20 pt-4 text-xs leading-[1.5] text-amber-100/60">
          {HARD_DAY_FOOTER}
        </p>
      </div>
    </div>
  );
}
