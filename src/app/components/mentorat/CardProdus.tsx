import { ArrowUpRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatLoves } from '../../../lib/loves';
import type { Project } from '../../../data/projects';

interface CardProdusProps {
  project: Project;
  description: string;
  discoverLabel: string;
  loves: number;
  hasLoved: boolean;
  onLove: (projectId: string) => void;
  /** Captura produsului. Fără ea, cardul rămâne doar cu logoul mare. */
  captura?: string;
  /** Poziția în listă, afișată ca 01…10. */
  index: number;
}

/** Domeniul, curățat — e ce scrie în bara ferestrei de deasupra capturii. */
function domeniu(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

/**
 * Cardul lat al unui produs, pentru /mentorat.
 *
 * Diferit de ProjectCard de pe prima pagină, intenționat: acolo cardurile
 * stau trei pe rând și trebuie să fie înguste; aici stau unul sub altul pe
 * toată lățimea, iar captura are loc să fie dovadă în sine, nu textură.
 * Capturile alternează stânga/dreapta ca lista de zece să nu devină monotonă.
 */
export function CardProdus({
  project,
  description,
  discoverLabel,
  loves,
  hasLoved,
  onLove,
  captura,
  index,
}: CardProdusProps) {
  const { id, title, category, href, avatar } = project;
  const capturaLaStanga = index % 2 === 1;

  // Cardul întreg e un <a>, deci inima trebuie să înghită clickul ea însăși,
  // altfel un like ar naviga la produs.
  const handleLove = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLove(id);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group relative block overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neon/50 hover:bg-neutral-900/70 transition-colors duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.08fr]">

        {/* ——— Textul ——— */}
        <div
          className={`relative z-10 p-6 md:p-9 flex flex-col justify-center order-2 ${
            capturaLaStanga ? 'md:order-2' : 'md:order-1'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-neutral-600 text-lg font-bold tabular-nums group-hover:text-mov transition-colors duration-300">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 text-[10px] font-bold tracking-wider uppercase">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
              {avatar ? (
                <ImageWithFallback
                  src={avatar}
                  alt={`Logo ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-neutral-500 text-xl font-bold">
                  {title.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform duration-300">
              {title}
            </h3>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed max-w-md mb-7">{description}</p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white group-hover:bg-neon group-hover:text-black group-hover:border-neon transition-all duration-300">
              {discoverLabel}
              <ArrowUpRight size={14} />
            </span>

            {/* Nu e <button>: stă în <a>-ul cardului, deci înghite clickul. */}
            <span
              role="button"
              tabIndex={0}
              aria-pressed={hasLoved}
              aria-label={hasLoved ? `${title}: apreciat` : `Apreciază ${title}`}
              onClick={handleLove}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleLove(e);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-xs font-bold select-none transition-all duration-300 ${
                hasLoved
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white cursor-pointer'
              }`}
            >
              <Heart size={13} className={hasLoved ? 'fill-rose-500 text-rose-500' : ''} />
              {formatLoves(loves)}
            </span>
          </div>
        </div>

        {/* ——— Captura, într-o fereastră de browser ——— */}
        <div
          className={`relative order-1 p-5 md:p-7 flex items-center bg-black/25 border-b md:border-b-0 border-neutral-800/60 ${
            capturaLaStanga ? 'md:order-1 md:border-r' : 'md:order-2 md:border-l'
          }`}
        >
          {captura ? (
            <div className="w-full rounded-xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/60 bg-neutral-950">
              {/* Bara ferestrei: spune că e un ecran real, cu adresa lui. */}
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900/90 border-b border-neutral-800">
                <span className="flex gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                </span>
                <span className="flex-1 text-center text-[10px] text-neutral-500 font-medium truncate">
                  {domeniu(href)}
                </span>
                <span className="w-[26px] shrink-0" />
              </div>
              <div className="relative aspect-[8/5] overflow-hidden">
                <ImageWithFallback
                  src={captura}
                  alt={`Ecran din ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top grayscale-[0.35] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                />
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[8/5] rounded-xl border border-dashed border-neutral-800 flex items-center justify-center">
              <span className="text-neutral-700 text-xs font-bold tracking-widest uppercase">
                {domeniu(href)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}
