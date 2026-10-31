/**
 * Fereastra ofertei de pe /prezentare: termenul limită al avansului.
 *
 * ⚠️ Aceleași reguli ca la fereastraBonus.ts, din același motiv. Un termen
 * limită e pe lista neagră din Directiva 2005/29/CE, preluată în Legea
 * 363/2007 (Anexa 1, pct. 7), dacă afirmi FALS că ceva e disponibil doar o
 * perioadă scurtă. Cuvântul care decide totul e „fals". Varianta de aici e
 * construită să fie adevărată și rămâne adevărată doar dacă:
 *
 *   1. MASTERCLASS-ul nu dispare la zero. Ce expiră e CONDIȚIA DE AVANS —
 *      posibilitatea de a-ți ține locul plătind doar o parte. După termen,
 *      locul se ia plătind integral, dacă mai e liber. Pagina spune asta
 *      explicit, lângă ceas. Nu scoate rândul.
 *   2. Ceasul pornește o singură dată per om și se ține minte. Un reload NU
 *      dă alte 48 de ore. Varianta care se resetează la fiecare reîncărcare e
 *      exact minciuna pe care o interzice legea.
 *   3. Când ajunge la zero, chiar se închide: butonul de avans dispare și
 *      rămâne varianta normală.
 *   4. Dacă omul plătește avansul după termen pentru că i-ai lăsat linkul
 *      activ, tot ce e mai sus devine decor. Linkul de plată cu avans trebuie
 *      să expire și el, pe partea de procesator — nu doar butonul din pagină.
 *      Vezi nota din data/prezentare.ts.
 *
 * `localStorage`, nu `sessionStorage` ca la bonus: o fereastră de 48 de ore
 * trebuie să supraviețuiască închiderii filei, altfel omul care se întoarce
 * mâine primește alte 48 de ore și promisiunea devine falsă. Dacă storage-ul
 * e blocat, cădem pe memorie: ceasul merge cât ține fila deschisă și nu dă
 * niciodată o fereastră nouă în aceeași vizită.
 */

export const OFERTA_ORE = 48;
const OFERTA_SECUNDE = OFERTA_ORE * 3600;
const CHEIE = 'vandy-oferta-avans';

let inMemorie: number | null = null;

function citesteStart(): number | null {
  // Fiecare ieșire cade pe `inMemorie`, nu pe `null` — vezi fereastraBonus.ts:
  // un `null` aici ar însemna „fereastra abia a început" la fiecare secundă,
  // adică un ceas înghețat care nu expiră niciodată.
  let brut: string | null = null;
  try {
    brut = localStorage.getItem(CHEIE);
  } catch {
    return inMemorie;
  }
  if (brut === null) return inMemorie;
  const n = Number(brut);
  return Number.isFinite(n) && n > 0 && n <= Date.now() ? n : inMemorie;
}

function scrieStart(ms: number) {
  inMemorie = ms;
  try {
    localStorage.setItem(CHEIE, String(ms));
  } catch {
    /* rămâne în memorie: se pierde la reload, dar nu dă 48 de ore noi într-o
       filă deschisă — ceasul merge înainte cât timp stă omul pe pagină. */
  }
}

/** Pornește fereastra dacă nu a pornit deja. Întoarce momentul de start. */
export function porneste(): number {
  const existent = citesteStart();
  if (existent !== null) return existent;
  const acum = Date.now();
  scrieStart(acum);
  return acum;
}

/** Câte secunde au mai rămas. 0 înseamnă închisă. */
export function secundeRamase(): number {
  const start = citesteStart();
  if (start === null) return OFERTA_SECUNDE;
  const trecute = Math.floor((Date.now() - start) / 1000);
  return Math.max(0, OFERTA_SECUNDE - trecute);
}

/** `41:07:55` — ore, minute, secunde. La 48 de ore, minutele singure n-ar spune nimic. */
export function format(secunde: number): string {
  const o = Math.floor(secunde / 3600);
  const m = Math.floor((secunde % 3600) / 60);
  const s = secunde % 60;
  return `${String(o).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
