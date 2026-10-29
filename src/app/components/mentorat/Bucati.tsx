import { ReactNode } from 'react';
import { motion } from 'motion/react';

/** Caseta standard a site-ului: aceleași colțuri, aceeași bordură, același fundal. */
export function Caseta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

/** Secțiune care apare la scroll. Un singur prag pentru toată pagina, ca ritmul să fie egal. */
export function Secventa({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/** Eticheta mică, majuscule rărite — elementul care leagă pagina de restul site-ului. */
export function Eticheta({
  children,
  ton = 'neutral',
}: {
  children: ReactNode;
  ton?: 'neutral' | 'alb' | 'neon' | 'mov';
}) {
  // Verdele e rezervat etichetelor care anunță bani, locuri sau garanție;
  // movul, celor care numesc structura programului.
  const culoare =
    ton === 'neon' ? 'text-neon'
    : ton === 'mov' ? 'text-mov'
    : ton === 'alb' ? 'text-white'
    : 'text-neutral-500';
  return (
    <span className={`block text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold ${culoare}`}>
      {children}
    </span>
  );
}

export function TitluSecvenca({ eticheta, titlu }: { eticheta: string; titlu: ReactNode }) {
  return (
    <div className="space-y-3 mb-6">
      {/* Kickerul numește secțiunea — e structură, deci mov. */}
      <Eticheta ton="mov">{eticheta}</Eticheta>
      <h2 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-[1.15] max-w-3xl">
        {titlu}
      </h2>
    </div>
  );
}

/**
 * Butonul paginii. Varianta implicită e verde fosforescent cu text negru:
 * pe negru e singurul element care se aprinde, deci ochiul merge la el.
 * Textul rămâne negru — alb pe verde n-ar avea contrast.
 */
export function Buton({
  children,
  href,
  onClick,
  variant = 'neon',
  className = '',
  padding = 'px-6 py-3.5 text-sm',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'neon' | 'alb' | 'contur';
  className?: string;
  /** Separat de className fiindcă Tailwind nu rezolvă conflictele după ordinea claselor:
   *  un `px-4` pus în className ar pierde în fața lui `px-6` din bază. */
  padding?: string;
}) {
  const baza =
    `inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all text-center ${padding}`;
  const stil =
    variant === 'neon'
      ? 'bg-neon text-black hover:brightness-110 lumina-bloc'
      : variant === 'alb'
        ? 'bg-white text-black hover:bg-neutral-200'
        : 'border border-neon/40 text-neon hover:bg-neon/10 hover:border-neon/70';
  const clase = `${baza} ${stil} ${className}`;

  if (href) {
    return (
      <a href={href} className={clase}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={clase}>
      {children}
    </button>
  );
}
