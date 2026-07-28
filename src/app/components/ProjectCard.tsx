import { ArrowUpRight, Heart } from 'lucide-react';
import { BentoCard } from './BentoCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatLoves } from '../../lib/loves';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  /** Translated description for this card. */
  description: string;
  /** Translated label for the call-to-action pill. */
  discoverLabel: string;
  /** Current love count. */
  loves: number;
  /** Whether this visitor already loved this project. */
  hasLoved: boolean;
  /** Register a love. */
  onLove: (projectId: string) => void;
}

export function ProjectCard({
  project,
  description,
  discoverLabel,
  loves,
  hasLoved,
  onLove,
}: ProjectCardProps) {
  const { id, title, category, href, avatar } = project;

  // The whole card is an <a>, so the heart must swallow the click itself,
  // otherwise loving a project would navigate away to the product site.
  const handleLove = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLove(id);
  };

  return (
    <BentoCard
      colSpan="col-span-1"
      href={href}
      className="group relative min-h-[400px] md:min-h-[450px] bg-neutral-950 border-neutral-900 hover:bg-neutral-950 hover:border-neutral-900 flex flex-col overflow-hidden"
    >
      {/* Top Section */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-neutral-900/50 backdrop-blur-sm text-neutral-300 text-[10px] font-bold tracking-wider uppercase">
          {category}
        </div>
        <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" size={20} />
      </div>

      {/* Avatar */}
      <div className="absolute top-16 left-6 w-20 h-20 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl z-20 grayscale group-hover:grayscale-0 transition-all duration-500">
        {avatar ? (
          <ImageWithFallback
            src={avatar}
            alt={`${title} Avatar`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          // No artwork yet — neutral placeholder that stays on-theme.
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-neutral-500 text-2xl font-bold">
            {title.charAt(0)}
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 p-6 mt-auto">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-neutral-500 text-xs font-medium leading-relaxed">{description}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
            {discoverLabel}
          </span>

          {/* Not a <button>: this sits inside the card's <a>, so it uses a
              role="button" span and swallows the click. */}
          <span
            role="button"
            tabIndex={0}
            aria-pressed={hasLoved}
            aria-label={hasLoved ? `${title}: loved` : `Love ${title}`}
            onClick={handleLove}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleLove(e);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-bold select-none transition-all duration-300 ${
              hasLoved
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white cursor-pointer'
            }`}
          >
            <Heart
              size={13}
              className={hasLoved ? 'fill-rose-500 text-rose-500 scale-110 transition-transform' : ''}
            />
            {formatLoves(loves)}
          </span>
        </div>
      </div>
    </BentoCard>
  );
}
