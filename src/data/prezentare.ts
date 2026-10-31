/**
 * /prezentare — pagina pe care aterizează omul imediat ce s-a înscris pe
 * /mentorat. Nu e o pagină de aterizare, e pasul 2 dintr-un funnel.
 *
 * Arhitectura, cerută de owner pe 31.10.2026, verbatim:
 *
 *   „vreau pe pagina asta sa fie sa apara titlul ala, apoi dupa ce omul se
 *   inscrie sa ajunga pe o pagina dedicata unde poate vedea acel video VSL
 *   unde ii prezint pas cu pas conceptul si tot si dupa aia ii voi face o
 *   oferta in video de nerefuzat pentru a se inscrie la masterclass cu termen
 *   limita si cu plata unui avans automat."
 *
 * ⛔ AICI prețul SE AFIȘEAZĂ, spre deosebire de /mentorat. Nu e o scăpare:
 * regula owner-ului din 29.10.2026 („Pretul nu l-as pune la vedere") e despre
 * pagina publică, unde cifra ar speria înainte să existe context. Pagina asta
 * e privată, se vede doar după înscriere, iar un avans nu poate fi cerut fără
 * să spui cât e. Dacă vreodată /prezentare devine publică, regula se aplică
 * din nou și pagina trebuie regândită.
 */

import { OFERTA } from './mentorat';

export const ANTET = {
  eticheta: 'Pasul 2 din 2 · acces deschis',
  titlu: 'Ești înăuntru. Uită-te la asta înainte de orice.',
  text: 'Îți arăt pas cu pas conceptul: ce construiești, cum ajunge la clienți și cum se plătește. La final ai o ofertă pe care o poți accepta direct de aici.',
} as const;

/**
 * Videoul. `url` e null până îl înregistrează owner-ul.
 *
 * Cât timp e null pagina nu are ce livra — nu există VSL, deci nu există
 * funnel. Zona arată locul gol, explicit, ca să fie imposibil de ratat.
 * Aceeași regulă ca la cele 9 carduri de recenzie de pe /mentorat: nu
 * inventăm și nu pretindem ce nu avem.
 */
export const VIDEO: { url: string | null; durata: string } = {
  url: null,
  durata: '20 – 30 de minute',
};

/**
 * Oferta cu termen limită.
 *
 * `avans` e singura cifră pe care trebuie s-o confirmi — am pus 290 € ca să
 * poți vedea pagina întreagă, nu e o cifră discutată cu tine. Schimb-o aici și
 * se schimbă peste tot, inclusiv în emailuri.
 *
 * `total` vine din OFERTA.pret, ca să nu existe două surse de adevăr pentru
 * preț. Restul de plată se calculează, nu se scrie de mână.
 */
export const AVANS = 290;

export const OFERTA_AVANS = {
  eticheta: 'Ofertă cu termen limită',
  titlu: 'Îți ții locul cu un avans.',
  avans: AVANS,
  total: OFERTA.pret,
  get rest() { return OFERTA.pret - AVANS; },
  text: 'Plătești acum doar avansul și locul e al tău, scos din cele zece. Restul îl plătești înainte de zi, după apelul cu echipa.',
  /** Rândul care ține termenul limită pe partea bună a legii. Nu-l scoate. */
  onest: 'Masterclass-ul nu dispare când ajunge ceasul la zero și prețul rămâne același. Ce expiră e posibilitatea de a-ți ține locul cu avans — după termen, locul se ia plătind integral, dacă mai e liber.',
  expirat: 'Fereastra de avans s-a închis.',
  expiratText: 'Locul și prețul rămân neschimbate. Vorbește cu echipa la apel și vezi ce mai e liber.',
} as const;

/**
 * Linkul de plată a avansului. Null până îl pune owner-ul.
 *
 * ⚠️ Când îl pui: linkul trebuie să EXPIRE și pe partea de procesator, nu doar
 * să dispară butonul din pagină. Un buton ascuns în timp ce linkul rămâne
 * activ înseamnă că termenul limită nu e real — vezi regula 4 din
 * lib/fereastraOferta.ts. La Stripe: un Payment Link cu dată de expirare sau
 * un checkout session generat la cerere, cu `expires_at`.
 */
export const PLATA: { url: string | null; procesator: string | null } = {
  url: null,
  procesator: null,
};

/** Ce intră în preț. Scurt — omul a citit deja /mentorat, aici doar confirmi. */
export const INCLUDE = [
  'O zi întreagă live, cu mine, în grup de maximum zece.',
  'Pleci cu lucrul tău construit și publicat, nu cu notițe.',
  'Oferta, lista de clienți, mesajul și prețul — scrise în sală.',
  'Înregistrarea rămâne la tine, fără termen.',
] as const;

/** Ce se întâmplă imediat după plată. Omul trebuie să știe înainte să apese. */
export const DUPA_PLATA = [
  { titlu: 'Primești confirmarea pe email', text: 'Cu factura și locul rezervat pe numele tău.' },
  { titlu: 'Te sună echipa în 24 de ore', text: 'Stabiliți ziua și ce construiești tu, concret.' },
  { titlu: 'Restul se plătește înainte de zi', text: 'După apel, când știi exact pe ce te-ai înscris.' },
] as const;

/** Rândul de subsol. Vezi și DISCLAIMER-ul de pe formularul din /mentorat. */
export const DISCLAIMER =
  'Rezultatele depind de munca, priceperea și piața fiecăruia. Este un program de formare practică: nu reprezintă consultanță financiară sau de investiții și nu garantează niciun venit.';
