import LoveLetterIcon from '@/components/LoveLetterIcon';
import { getDailyMessage } from '@/lib/dailyMessages';

export default function DailyMessage() {
  const message = getDailyMessage(new Date());

  return (
    <figure
      dir="rtl"
      className="anim-fade-up mx-auto w-full max-w-md rounded-3xl border border-amber-300/30 bg-black/50 px-6 py-5 text-center backdrop-blur"
      style={{ animationDelay: '3s' }}
    >
      <LoveLetterIcon className="letter-float mx-auto mb-3 h-9 w-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
      <p className="text-base leading-[1.5] text-amber-100 sm:text-lg">{message}</p>
    </figure>
  );
}
