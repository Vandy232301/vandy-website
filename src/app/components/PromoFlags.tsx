import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PROJECTS } from '../../data/projects';

/**
 * Auto-scrolling marquee of promo "flags" — one per project that has an
 * active offer. Each flag wears its own product's brand colour.
 *
 * The track renders the list twice and the CSS animation translates it by
 * exactly -50%, so it loops seamlessly. Hover/focus pauses it (see index.css),
 * and it is disabled entirely under prefers-reduced-motion.
 */
export function PromoFlags() {
  // Sorted by promo.order so two similarly-coloured brands never sit adjacent.
  const promoted = PROJECTS.filter((p) => p.promo).sort(
    (a, b) => a.promo!.order - b.promo!.order,
  );
  if (promoted.length === 0) return null;

  // Keep a roughly constant speed regardless of how many flags there are.
  const duration = Math.max(28, promoted.length * 9);

  return (
    <section
      className="marquee-viewport relative overflow-hidden py-2"
      aria-label="Current offers"
    >
      {/* Fade the edges so flags slide in and out instead of getting clipped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-black to-transparent" />

      <div
        className="marquee-track flex gap-3"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) =>
          promoted.map((project) => (
            <Flag
              key={`${copy}-${project.id}`}
              project={project}
              // The second pass is purely visual filler for the loop.
              ariaHidden={copy === 1}
            />
          )),
        )}
      </div>
    </section>
  );
}

function Flag({
  project,
  ariaHidden,
}: {
  project: (typeof PROJECTS)[number];
  ariaHidden: boolean;
}) {
  const promo = project.promo!;
  const brand = promo.brand;

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
      className="group/flag relative flex shrink-0 items-center gap-3.5 rounded-2xl border px-5 py-3.5 transition-all duration-300"
      style={{
        borderColor: `${brand}40`,
        background: `linear-gradient(110deg, ${brand}1f 0%, ${brand}0a 45%, rgba(10,10,10,0) 100%), #0a0a0a`,
        boxShadow: `inset 0 1px 0 0 ${brand}20`,
      }}
    >
      {/* Brand glow, revealed on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover/flag:opacity-100"
        style={{ boxShadow: `0 0 26px -4px ${brand}66, inset 0 0 22px -12px ${brand}` }}
      />

      {/* Product mark. Some marks are dark 3D portraits that turn to mud at
          this size, so they sit on a brand-tinted plate and get a light lift. */}
      {project.avatar && (
        <span
          className="relative z-10 h-9 w-9 shrink-0 overflow-hidden rounded-lg border"
          style={{ borderColor: `${brand}55`, background: `${brand}26` }}
        >
          <ImageWithFallback
            src={project.avatar}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(1.25) contrast(1.05)' }}
          />
        </span>
      )}

      <span className="relative z-10 flex flex-col leading-tight">
        {/* Brand name leads — the offer is meaningless without knowing whose it is. */}
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          <span style={{ color: brand }}>{project.title}</span>
          <span className="text-neutral-500"> · {promo.tag}</span>
        </span>
        <span className="whitespace-nowrap text-sm font-bold text-white">{promo.label}</span>
      </span>

      <ArrowUpRight
        size={16}
        className="relative z-10 shrink-0 text-neutral-600 transition-colors duration-300 group-hover/flag:text-white"
      />
    </a>
  );
}
