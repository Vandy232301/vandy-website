/**
 * SESIUNEA LIVE GRATUITĂ — lead magnetul.
 *
 * Decizia owner-ului, 2026-11-02: funnelul nu mai stă pe un VSL înregistrat, ci
 * pe o sesiune live gratuită. Motivul e în `ops/funnel.md`, dar pe scurt:
 * VSL-ul nu exista și fără el funnelul ducea într-o cameră goală, în timp ce o
 * sesiune live nu are nimic de înregistrat și montat, creează un termen limită
 * ADEVĂRAT (data sesiunii), permite vânzarea la final — și produce chiar
 * înregistrarea care devine VSL pentru rundele următoare.
 *
 * Fișierul ăsta e singura sursă de adevăr pentru dată și oră. Îl citesc și
 * `/gratuit` (ca să spună când e) și `/prezentare` (ca să știe dacă sesiunea a
 * trecut). Nu scrie data a doua oară nicăieri.
 *
 * ⚠️ `data` e `null` până o stabilește owner-ul. Cât timp e null, ambele pagini
 * spun „îți trimit data pe email" — nu inventăm o dată și nu afișăm un
 * cronometru spre nimic. Aceeași regulă ca la `VIDEO.url` și `PLATA.url`.
 */

/**
 * Când e sesiunea. Format ISO cu fus orar explicit, ca să nu depindă de ceasul
 * vizitatorului: `'2026-11-20T19:00:00+02:00'`.
 *
 * România e pe +02:00 iarna (EET) și +03:00 vara (EEST). Scrie decalajul
 * corect pentru data aleasă, altfel sesiunea pare cu o oră mai târziu.
 */
export const EVENIMENT: {
  data: string | null;
  durata: string;
  platforma: string | null;
  linkIntrare: string | null;
} = {
  data: null,
  durata: 'aproximativ 90 de minute',
  platforma: null,
  linkIntrare: null,
};

/** Ce se acoperă live. Mapează pe MOTOR + DISTRIBUTIE din masterclass, deliberat:
 *  lucrul gratuit e o felie adevărată din cel plătit, nu o momeală care duce
 *  altundeva. Dacă rescrii astea, verifică să rămână așa. */
export const ACOPERA = [
  'Cum arată un site pentru care o firmă plătește mii de euro — și prin ce diferă, concret, de unul de câteva sute.',
  'Caietul de sarcini: ce îi ceri AI-ului ca să iasă corect din prima, nu din a douăzecea.',
  'Unde sunt clienții — tipuri de firme din România care au nevoie acum și încă nu caută.',
  'Primul mesaj de contact, scris în fața ta, pe un caz real.',
  'Cum se formează prețul și cum îl ceri fără să te scuzi.',
] as const;

/** Momentul de referință. Separat ca funcție ca să poată fi testat. */
function acum() {
  return Date.now();
}

export type StareEveniment = 'nestabilit' | 'viitor' | 'trecut';

/**
 * În ce stare e sesiunea. Cele trei stări conduc tot ce se afișează pe
 * `/prezentare`, deci sunt singurul loc unde se decide asta.
 *
 * `nestabilit` — nu există dată (acum)
 * `viitor`     — e înscris, sesiunea n-a avut loc încă
 * `trecut`     — sesiunea a avut loc; urmează înregistrarea și oferta
 */
export function stareEveniment(): StareEveniment {
  if (!EVENIMENT.data) return 'nestabilit';
  const t = Date.parse(EVENIMENT.data);
  // O dată scrisă greșit nu are voie să producă un cronometru aberant: dacă
  // nu se poate interpreta, ne purtăm ca și când n-ar fi stabilită.
  if (Number.isNaN(t)) return 'nestabilit';
  return t > acum() ? 'viitor' : 'trecut';
}

/** Secunde până la sesiune. 0 dacă a trecut sau nu e stabilită. */
export function secundePanaLa(): number {
  if (!EVENIMENT.data) return 0;
  const t = Date.parse(EVENIMENT.data);
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((t - acum()) / 1000));
}

/**
 * Data, scrisă pe românește: „joi, 20 noiembrie, ora 19:00".
 *
 * Folosește `Intl` cu fusul României, nu al vizitatorului: cineva care
 * deschide pagina din Spania trebuie să vadă ora la care chiar începe
 * sesiunea, nu ora lui locală — altfel intră cu o oră întârziere.
 */
export function dataScrisa(): string | null {
  if (!EVENIMENT.data) return null;
  const t = Date.parse(EVENIMENT.data);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Bucharest',
  }).format(new Date(t));
}

/**
 * Link „adaugă în calendar" (Google Calendar).
 *
 * Nu e un moft: la un eveniment live gratuit, cea mai mare pierdere nu e la
 * înscriere, e la prezență — oamenii se înscriu și uită. Un memento în
 * calendarul lor e cel mai ieftin lucru care mută prezența în sus.
 *
 * Întoarce null dacă nu există dată, ca butonul să nu se randeze deloc.
 */
export function linkCalendar(): string | null {
  if (!EVENIMENT.data) return null;
  const start = Date.parse(EVENIMENT.data);
  if (Number.isNaN(start)) return null;
  // Două ore, acoperitor pentru cele ~90 de minute: un eveniment care se
  // termină în calendar înainte să se termine în realitate e mai rău decât
  // unul cu un sfert de oră în plus.
  const sfarsit = start + 2 * 3600 * 1000;
  const ceas = (t: number) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Sesiune live gratuită — site-uri performante cu AI · VANDY',
    dates: `${ceas(start)}/${ceas(sfarsit)}`,
    details: EVENIMENT.linkIntrare
      ? `Link de intrare: ${EVENIMENT.linkIntrare}`
      : 'Linkul de intrare vine pe email înainte de sesiune.',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** Cronometrul mare: `3z 04:12:09` sau `04:12:09` în ultima zi. */
export function formatRamas(secunde: number): string {
  const z = Math.floor(secunde / 86400);
  const o = Math.floor((secunde % 86400) / 3600);
  const m = Math.floor((secunde % 3600) / 60);
  const s = secunde % 60;
  const dd = (n: number) => String(n).padStart(2, '0');
  return z > 0 ? `${z}z ${dd(o)}:${dd(m)}:${dd(s)}` : `${dd(o)}:${dd(m)}:${dd(s)}`;
}
