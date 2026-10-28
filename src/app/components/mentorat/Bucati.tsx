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
export function Eticheta({ children, ton = 'neutral' }: { children: ReactNode; ton?: 'neutral' | 'alb' }) {
  const culoare = ton === 'alb' ? 'text-white' : 'text-neutral-500';
  return (
    <span className={`block text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold ${culoare}`}>
      {children}
    </span>
  );
}

export function TitluSecvenca({ eticheta, titlu }: { eticheta: string; titlu: ReactNode }) {
  return (
    <div className="space-y-3 mb-6">
      <Eticheta>{eticheta}</Eticheta>
      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug max-w-2xl">
        {titlu}
      </h2>
    </div>
  );
}

/** Butonul alb, ca în emailurile brandului. */
export function Buton({
  children,
  href,
  onClick,
  variant = 'alb',
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'alb' | 'contur';
  className?: string;
}) {
  const baza =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-tight transition-colors text-center';
  const stil =
    variant === 'alb'
      ? 'bg-white text-black hover:bg-neutral-200'
      : 'border border-neutral-700 text-white hover:bg-neutral-800/60';
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
