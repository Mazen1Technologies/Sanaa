import { useState } from 'react';
import { Feather } from 'lucide-react';
import HardDaysDialog from '@/components/HardDaysDialog';

export default function HardDaysButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="لأيام الصعوبة"
        className="absolute bottom-6 left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-black/40 text-amber-200/60 backdrop-blur transition duration-300 hover:scale-110 hover:bg-rose-900/60 hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <Feather className="h-4 w-4" />
      </button>

      {isOpen && <HardDaysDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
