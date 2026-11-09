import { useEffect, useRef, useState, type FormEvent } from 'react';
import { RotateCcw, SendHorizontal, X } from 'lucide-react';

type Mood =
  | 'love'
  | 'happy'
  | 'laugh'
  | 'shy'
  | 'sad'
  | 'tired'
  | 'sick'
  | 'worried'
  | 'angry'
  | 'missing'
  | 'proud'
  | 'calm';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mood?: Mood;
}

const STORAGE_KEY = 'sanaa-ask-chat-v1';
const MIN_TYPING_MS = 1100;

const MOOD_FACES: Record<Mood, string[]> = {
  love: ['🥰', '❤️', '🌹'],
  happy: ['😊', '✨', '🌹'],
  laugh: ['😂', '🤭', '🌹'],
  shy: ['☺️', '🙈', '🌸'],
  sad: ['🥺', '🤍', '🌹'],
  tired: ['😌', '☕', '🌹'],
  sick: ['🤒', '🤍', '🌹'],
  worried: ['🤗', '🤍', '🌹'],
  angry: ['🥺', '🌹', '🤍'],
  missing: ['🥹', '💌', '🌹'],
  proud: ['😍', '👑', '🌹'],
  calm: ['🤍', '🕊️', '🌹'],
};

const SUGGESTIONS = ['كيف حالك؟ 🤍', 'أنا تعبانة اليوم 🥺', 'وش أطبخ اليوم؟', 'ساعدني بشيء'];

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'هلا والله بأجمل سناء 🥰🌹\nاسأليني عن أي شيء، أو قوليلي وش فيكِ وكيف حالك… أنا هنا لكِ دايمًا 🤍',
  mood: 'love',
};

function loadHistory(): ChatMessage[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AskMeChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        dir="rtl"
        className="anim-fade-up relative z-10 mt-4 flex items-center gap-3 rounded-full border border-amber-300/60 bg-gradient-to-l from-rose-900/80 to-black/60 py-2 pl-6 pr-2 text-amber-100 shadow-[0_0_25px_rgba(190,18,60,0.3)] backdrop-blur transition hover:scale-105 hover:border-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/50 bg-black/50 text-2xl">
          <span className="anim-rose-bounce">🌹</span>
          <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-[#140a0d] bg-emerald-400" />
        </span>
        <span className="font-arabic text-lg">إسئليني وأساعدك</span>
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}

function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reaction, setReaction] = useState<{ key: string; faces: string[] } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || isTyping) return;

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsTyping(true);

    const startedAt = Date.now();
    let reply: ChatMessage;
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .filter((m) => m.id !== 'welcome')
            .map(({ role, content: c }) => ({ role, content: c })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: { reply: string; mood: Mood } = await res.json();
      reply = { id: makeId(), role: 'assistant', content: data.reply, mood: data.mood };
    } catch {
      reply = {
        id: makeId(),
        role: 'assistant',
        content: 'سامحيني يا روحي، النت عندي ثقيل شوي 🥺 ارجعي اكتبي لي مرة ثانية 🌹',
        mood: 'shy',
      };
    }

    const wait = MIN_TYPING_MS - (Date.now() - startedAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

    setIsTyping(false);
    setMessages((current) => [...current, reply]);
    setReaction({ key: reply.id, faces: MOOD_FACES[reply.mood ?? 'love'] });
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setReaction(null);
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="إسئليني وأساعدك"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
        className="anim-fade-up relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0f0709] sm:h-[85dvh] sm:max-w-md sm:rounded-3xl sm:border sm:border-amber-300/30 sm:shadow-[0_0_50px_rgba(190,18,60,0.3)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(140,20,40,0.35),transparent_60%)]" />

        <header className="relative z-10 flex items-center gap-3 border-b border-amber-300/20 bg-black/40 px-4 py-3 backdrop-blur">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200/50 bg-rose-950/70 text-2xl shadow-[0_0_18px_rgba(245,214,122,0.2)]">
            🌹
            <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-[#0f0709] bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-arabic text-lg leading-tight text-amber-100">إسئليني وأساعدك</h2>
            <p className="text-xs text-emerald-300/80">{isTyping ? 'يكتب الآن…' : 'متصل الآن'}</p>
          </div>
          <button
            type="button"
            onClick={resetChat}
            aria-label="محادثة جديدة"
            title="محادثة جديدة"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amber-200/70 transition hover:bg-rose-900/60 hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amber-200 transition hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div ref={scrollRef} className="no-scrollbar relative z-10 flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex justify-end">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-amber-300/20 bg-rose-950/60 px-4 py-3">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void send(suggestion)}
                  className="rounded-full border border-amber-300/40 bg-black/40 px-3 py-1.5 text-sm text-amber-100/90 transition hover:border-amber-200 hover:bg-rose-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {reaction && (
          <div key={reaction.key} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center gap-6">
            {reaction.faces.map((face, index) => (
              <span
                key={`${reaction.key}-${index}`}
                className="anim-emoji-float text-4xl"
                style={{ animationDelay: `${index * 0.18}s`, ['--drift' as string]: `${(index - 1) * 28}px` }}
              >
                {face}
              </span>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex items-end gap-2 border-t border-amber-300/20 bg-black/50 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={1500}
            placeholder="فضفضي يا سونا، أنا بمساعدتك…"
            className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-3xl border border-amber-300/30 bg-[#1a0c10] px-4 py-2.5 text-base text-amber-50 placeholder:text-amber-100/40 focus:border-amber-200 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="إرسال"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[#2a1a05] transition hover:bg-amber-200 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
          >
            <SendHorizontal className="h-5 w-5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`anim-bubble-in flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`relative max-w-[82%] whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-7 ${
          isUser
            ? 'rounded-2xl rounded-br-md bg-amber-200 text-[#2a1405]'
            : 'rounded-2xl rounded-bl-md border border-amber-300/20 bg-rose-950/70 text-amber-50 shadow-[0_0_20px_rgba(190,18,60,0.15)]'
        }`}
      >
        {message.content}
        {!isUser && message.mood && (
          <span className="absolute -bottom-3 -left-2 flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/30 bg-[#1a0c10] text-sm shadow">
            {MOOD_FACES[message.mood][0]}
          </span>
        )}
      </div>
    </div>
  );
}
