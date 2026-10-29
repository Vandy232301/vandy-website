/**
 * Fereastra de bonus: zece minute de la prima deschidere a paginii.
 *
 * ⚠️ Citește înainte să umbli aici.
 *
 * Owner a cerut pe 29.10.2026: „Vreau si o oferta cu countdown timer de 10
 * minute daca se inscrie sa primeasca un Surprice Bonus."
 *
 * Un cronometru de urgență e pe lista neagră din Directiva 2005/29/CE, preluată
 * în Legea 363/2007 (Anexa 1, pct. 7): e interzis să afirmi FALS că un produs e
 * disponibil doar o perioadă foarte scurtă, ca să smulgi o decizie pe loc.
 * Cuvântul care decide totul e „fals". Varianta de aici e construită să fie
 * adevărată, și rămâne adevărată doar dacă respecți cele patru reguli:
 *
 *   1. Masterclass-ul NU expiră și prețul NU se schimbă când ajunge la zero.
 *      Doar bonusul ține de fereastră. Pagina spune asta explicit, lângă
 *      cronometru — nu scoate rândul ăla.
 *   2. Ceasul pornește o singură dată per sesiune și se ține minte în
 *      `sessionStorage`. Un reload NU dă alte zece minute. Varianta care se
 *      resetează la fiecare reîncărcare e exact minciuna pe care o interzice
 *      legea.
 *   3. Când ajunge la zero, chiar se închide: blocul schimbă textul și
 *      formularul trimite `bonus: false`. Nu „se redeschide discret".
 *   4. Bonusul trebuie să existe și să fie livrat. Emailul intern spune pentru
 *      fiecare înscriere dacă a intrat în fereastră. Dacă nu-l dai, tot ce e
 *      mai sus devine decor și afirmația redevine falsă.
 *
 * Nu păstrăm momentul în `localStorage`: acolo ar rămâne luni de zile, iar un om
 * care revine peste o săptămână ar găsi o fereastră închisă pe care nu și-o
 * amintește. `sessionStorage` moare odată cu fila — a doua vizită, altă zi,
 * pornește cinstit de la capăt.
 */

export const BONUS_MINUTE = 10;
const BONUS_SECUNDE = BONUS_MINUTE * 60;
const CHEIE = 'vandy-mentorat-bonus';

/** Rezerva pentru navigare privată sau cookie-uri blocate, unde `sessionStorage` aruncă. */
let inMemorie: number | null = null;

function citesteStart(): number | null {
  // Fiecare ieșire cade pe `inMemorie`, nu pe `null`. Prinsă pe 29.10.2026, în
  // browser: când scrierea în `sessionStorage` eșuează fără să arunce, citirea
  // întoarce mereu nimic, iar un `null` aici ar fi însemnat „fereastra abia a
  // început" la fiecare secundă — cronometru înghețat la 10:00, care nu expiră
  // niciodată și trimite `bonus: true` oricui. Adică exact afirmația falsă pe
  // care tot fișierul ăsta încearcă s-o evite.
  let brut: string | null = null;
  try {
    brut = sessionStorage.getItem(CHEIE);
  } catch {
    return inMemorie;
  }
  if (brut === null) return inMemorie;
  const n = Number(brut);
  // Un număr aiurea în storage (editat, corupt) nu e un start valid.
  return Number.isFinite(n) && n > 0 && n <= Date.now() ? n : inMemorie;
}

function scrieStart(ms: number) {
  inMemorie = ms;
  try {
    sessionStorage.setItem(CHEIE, String(ms));
  } catch {
    /* rămâne doar în memorie; se pierde la reload, dar nu dă zece minute noi
       într-o filă deschisă — ceasul merge înainte cât timp stă omul pe pagină. */
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
  if (start === null) return BONUS_SECUNDE;
  const trecute = Math.floor((Date.now() - start) / 1000);
  return Math.max(0, BONUS_SECUNDE - trecute);
}

/** `9:04`. Minute fără zero în față, secunde cu — cum arată un ceas. */
export function format(secunde: number): string {
  const m = Math.floor(secunde / 60);
  const s = secunde % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
