import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Caseta } from './Bucati';

interface IntrebareProps {
  q: string;
  a: string;
  /** Prima întrebare stă deschisă, ca secțiunea să nu pară goală la prima vedere. */
  deschisaInitial?: boolean;
}

/**
 * O întrebare pliabilă.
 *
 * Mai multe pot fi deschise în același timp — un acordeon care închide
 * răspunsul citit când deschizi altul enervează pe cineva care compară două.
 * E <button>, nu <div> cu onClick: se ajunge la el cu Tab, se deschide cu
 * Enter sau spațiu, iar aria-expanded/aria-controls spun cititoarelor de
 * ecran ce controlează.
 */
export function Intrebare({ q, a, deschisaInitial = false }: IntrebareProps) {
  const [deschisa, setDeschisa] = useState(deschisaInitial);
  const idRaspuns = useId();

  return (
    <Caseta className="overflow-hidden">
      <button
        type="button"
        onClick={() => setDeschisa((d) => !d)}
        aria-expanded={deschisa}
        aria-controls={idRaspuns}
        className="group w-full flex items-start justify-between gap-5 p-6 text-left cursor-pointer"
      >
        <span
          className={`text-[15px] md:text-base font-bold tracking-tight transition-colors ${
            deschisa ? 'text-mov' : 'text-white group-hover:text-neutral-300'
          }`}
        >
          {q}
        </span>
        <span
          aria-hidden
          className={`shrink-0 mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
            deschisa
              ? 'border-mov/60 text-mov rotate-180'
              : 'border-neutral-700 text-neutral-400 group-hover:border-neutral-500 group-hover:text-white'
          }`}
        >
          <ChevronDown size={16} strokeWidth={2.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {deschisa && (
          <motion.div
            key="raspuns"
            id={idRaspuns}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-neutral-400 text-sm md:text-[15px] leading-relaxed masura-lat md:columns-2 md:gap-10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Caseta>
  );
}
