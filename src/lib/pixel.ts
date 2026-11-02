/**
 * Evenimentele de pixel pentru funnelul de reclame.
 *
 * Fără ele, campania optimizează pe nimic: Meta și TikTok au nevoie să afle
 * CARE click a devenit înscriere, altfel „obiectiv: Conversii" nu are ce
 * conversii să numere și algoritmul livrează către cine dă click, nu către
 * cine se înscrie. Vezi `ops/funnel.md` §2.
 *
 * ┌─ ⚠️ GDPR / ePrivacy — de citit înainte de a publica ───────────────────┐
 * │ Pixelul Meta și cel TikTok scriu cookie-uri și trimit date către terți. │
 * │ În UE (deci și în România) asta cere CONSIMȚĂMÂNT prealabil, nu doar o  │
 * │ mențiune în politica de confidențialitate. Site-ul nu are încă banner   │
 * │ de cookie-uri.                                                         │
 * │                                                                        │
 * │ De aceea tot modulul trece prin `activeaza()`: când apare bannerul, îl  │
 * │ chemi la „accept" și ștergi apelul automat din `porneste()`. Până       │
 * │ atunci pixelul pornește la încărcare, ca să nu livrez un funnel care    │
 * │ nu măsoară nimic — dar e o datorie deschisă, nu o soluție.             │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * ID-urile vin din variabile de build. Dacă lipsesc, tot modulul e inert: nu
 * se încarcă nimic, nu se trimite nimic, nicio eroare. Așa pot exista paginile
 * înainte să existe conturile de reclame.
 *
 *   VITE_META_PIXEL_ID=123...
 *   VITE_TIKTOK_PIXEL_ID=ABC...
 */

const META_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const TIKTOK_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;

/** Evenimentele funnelului, în ordinea în care se întâmplă. */
export type Eveniment =
  | 'PageView'
  /** S-a înscris la sesiunea gratuită. Ăsta e evenimentul pe care optimizezi. */
  | 'Lead'
  /** A ajuns pe pagina cu detaliile / înregistrarea. */
  | 'ViewContent'
  /** A apăsat butonul de plată a avansului. */
  | 'InitiateCheckout'
  | 'Purchase';

/** Numele TikTok pentru aceleași evenimente — taxonomia lui diferă de a Meta. */
const NUME_TIKTOK: Record<Eveniment, string> = {
  PageView: 'Pageview',
  Lead: 'CompleteRegistration',
  ViewContent: 'ViewContent',
  InitiateCheckout: 'InitiateCheckout',
  Purchase: 'CompletePayment',
};

type Fereastra = typeof window & {
  fbq?: (...a: unknown[]) => void;
  _fbq?: unknown;
  ttq?: Record<string, unknown> & { track?: (n: string, p?: unknown) => void };
  TiktokAnalyticsObject?: string;
};

let pornit = false;

/** Nu rulăm pe server și nu rulăm de două ori. */
const disponibil = () => typeof window !== 'undefined';

/** Forma pe care `fbevents.js` o completează după ce se încarcă. */
type Fbq = ((...a: unknown[]) => void) & {
  queue: unknown[];
  loaded: boolean;
  version: string;
  callMethod?: (...a: unknown[]) => void;
};

function incarcaMeta(id: string) {
  const w = window as Fereastra;
  if (w.fbq) return;
  /* Fragmentul oficial Meta, rescris ca să treacă prin TypeScript. Coada
     (`queue`) e partea care contează: evenimentele trimise înainte ca
     scriptul să se încarce nu se pierd, se execută după — iar aici chiar se
     întâmplă, fiindcă `Lead` poate pleca la o secundă după prima vizită. */
  const f = function (this: unknown, ...args: unknown[]) {
    if (f.callMethod) f.callMethod.apply(f, args);
    else f.queue.push(args);
  } as Fbq;
  f.queue = [];
  f.loaded = true;
  f.version = '2.0';
  w.fbq = f;
  w._fbq = f;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  w.fbq('init', id);
}

function incarcaTiktok(id: string) {
  const w = window as Fereastra;
  if (w.ttq) return;
  w.TiktokAnalyticsObject = 'ttq';
  const metode = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
  const coada: unknown[][] = [];
  const ttq: Record<string, unknown> = { _i: {}, _t: {}, _o: {}, _partner: undefined, _q: coada };
  for (const m of metode) {
    ttq[m] = (...args: unknown[]) => coada.push([m, ...args]);
  }
  w.ttq = ttq as Fereastra['ttq'];
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(id)}&lib=ttq`;
  document.head.appendChild(s);
}

/**
 * Pornește pixelii. Idempotent — poate fi chemat de pe orice pagină.
 *
 * Aici se leagă consimțământul: când apare bannerul de cookie-uri, chemi
 * funcția asta la „accept" și scoți apelul automat de la montarea paginilor.
 */
export function activeaza() {
  if (!disponibil() || pornit) return;
  if (!META_ID && !TIKTOK_ID) return;
  pornit = true;
  if (META_ID) incarcaMeta(META_ID);
  if (TIKTOK_ID) incarcaTiktok(TIKTOK_ID);
}

/**
 * Trimite un eveniment către ambii pixeli configurați.
 *
 * Nu aruncă niciodată: un pixel blocat de un ad-blocker e normal, iar o
 * excepție de aici ar opri randarea paginii pentru care ai plătit click-ul.
 */
export function trimite(ev: Eveniment, date?: Record<string, unknown>) {
  if (!disponibil()) return;
  activeaza();
  const w = window as Fereastra;
  try {
    w.fbq?.('track', ev, date);
  } catch {
    /* pixel blocat sau neîncărcat — nu e treaba paginii */
  }
  try {
    w.ttq?.track?.(NUME_TIKTOK[ev], date);
  } catch {
    /* idem */
  }
}

/** Scurtătura pentru montarea unei pagini: pornește și raportează vizita. */
export function vizita() {
  trimite('PageView');
}
