import { translations } from './translations';

import DYNASTY_AVATAR from '../assets/03904df2942f7c80bca73f9a396f79905354fc62.png';
import NOWWWA_AVATAR from '../assets/fc3f352a7826e110a4b12bca4410c3eb1830ab06.png';
import WIZZY_AVATAR from '../assets/fe8a4eb34aef5ff85ebcd67eb7acb7a566d3d469.png';
import CONSULT_AVATAR from '../assets/3bbc069757dad33abd5dd680bf92c4d16fa802b5.png';

// Brand logos pulled from each product's own repo / live favicon.
import NEOTRADER_LOGO from '../assets/logos/neotrader.svg';
import SWAGG_LOGO from '../assets/logos/swagg.png';
import IZZY_LOGO from '../assets/logos/izzy.png';
import BLUR_LOGO from '../assets/logos/blur.png';
import DOZAIN_LOGO from '../assets/logos/dozain.svg';

/** Keys of translations[lang].projects that hold a card description. */
export type ProjectDescKey = Exclude<keyof typeof translations.EN.projects, 'discover'>;

/**
 * An active offer, shown as a coloured flag in the marquee above the grid.
 * Only projects that define `promo` get a flag.
 */
export interface ProjectPromo {
  /** Small uppercase kicker, e.g. "LIMITED OFFER". */
  tag: string;
  /** The offer itself, e.g. "3 days PREMIUM — €29". Keep it short: one line. */
  label: string;
  /** The product's own brand colour, as #rrggbb. Drives the whole flag. */
  brand: string;
  /** Marquee position. Used to keep similar colours from sitting side by side. */
  order: number;
}

export interface Project {
  /** Stable id, used as the React key. */
  id: string;
  /** Card title, shown uppercase as designed. */
  title: string;
  /** Small pill above the card. Keep it to one or two words. */
  category: string;
  /** Where the card links to. */
  href: string;
  /** Square avatar. Omit until artwork exists — the card renders a neutral placeholder. */
  avatar?: string;
  /** Which translated description to show. */
  descKey: ProjectDescKey;
  /** Active offer. Omit when the project has nothing running. */
  promo?: ProjectPromo;
}

/**
 * The projects grid on the homepage, in display order.
 * To add a project: drop a square PNG in src/assets/, import it above,
 * add one entry here, and add its description to every language in translations.ts.
 */
export const PROJECTS: Project[] = [
  {
    id: 'dynasty',
    title: 'DYNASTY',
    category: 'Trading',
    href: 'https://dynasty.vandy.ro/',
    avatar: DYNASTY_AVATAR,
    descKey: 'dynastyDesc',
    promo: {
      tag: 'Limited offer',
      label: '3 days PREMIUM — €29',
      brand: '#9333ea',
      order: 1,
    },
  },
  {
    id: 'nowwwa',
    title: 'NOWWWA',
    category: 'Technology',
    href: 'https://nowwwa.ai/',
    avatar: NOWWWA_AVATAR,
    descKey: 'novaDesc',
    promo: {
      tag: 'Pro plan',
      label: 'Ship your MVP — from $20/mo',
      brand: '#7c5cff',
      order: 4,
    },
  },
  {
    id: 'neotrader',
    title: 'NEO TRADER',
    category: 'AI Trading',
    // Deliberate: neotrader.ai and neotrader.io are unrelated third-party
    // trading products. This .app domain is the correct one.
    href: 'https://neotrader.app/',
    avatar: NEOTRADER_LOGO,
    descKey: 'neotraderDesc',
    promo: {
      tag: 'Free account',
      label: '20% off any plan + 200 credits',
      brand: '#2cff05',
      order: 3,
    },
  },
  {
    id: 'swagg',
    title: 'SWAGG',
    category: 'Studio',
    href: 'https://swagg.studio/',
    avatar: SWAGG_LOGO,
    descKey: 'swaggDesc',
    promo: {
      tag: 'Surprise discount',
      label: 'Book a call — Academy 99€/mo',
      brand: '#ff2a1a',
      order: 2,
    },
  },
  {
    id: 'izzy',
    title: 'IZZY',
    category: 'Real Estate',
    // TODO: switch to https://izzy.estate/ once DNS resolves. The domain is
    // registered and its nameservers already point at Vercel, but the
    // delegation has not propagated yet, so the host does not resolve.
    href: 'https://izzy-seven.vercel.app/',
    avatar: IZZY_LOGO,
    descKey: 'izzyDesc',
  },
  {
    id: 'blur',
    title: 'BLUR',
    category: 'Creators',
    href: 'https://blur.fan/',
    avatar: BLUR_LOGO,
    descKey: 'blurDesc',
    promo: {
      tag: 'Founding member',
      label: 'Founding class 2026 — 5,500 keys',
      brand: '#f00a1a',
      order: 5,
    },
  },
  {
    id: 'wizzywazza',
    title: 'WIZZYWAZZA',
    category: 'AI DJ',
    href: 'https://wizzywazza.vandy.ro/#catalog',
    avatar: WIZZY_AVATAR,
    descKey: 'wizzywazzaDesc',
  },
  {
    id: 'dozain',
    title: 'DOZAIN',
    category: 'Design',
    href: 'https://dozain.com/',
    avatar: DOZAIN_LOGO,
    descKey: 'dozainDesc',
  },
  {
    id: 'consult',
    title: 'CONSULT',
    category: 'Services',
    href: 'https://calendar.app.google/VCpnWRt8HGQLPJATA',
    avatar: CONSULT_AVATAR,
    descKey: 'foundersDesc',
  },
];
