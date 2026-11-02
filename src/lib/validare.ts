/**
 * Regulile de validare pentru formularul de pe /mentorat.
 *
 * Sursa de adevăr e fișierul ăsta. `api/aplica-mentorat.js` repetă aceleași
 * reguli în JS simplu, pentru că rulează ca funcție Vercel și nu compilează TS
 * — dacă schimbi ceva aici, schimbă și acolo (e scris în comentariu și acolo).
 *
 * Scopul lor nu e să fie severe, e să nu intre în inbox date cu care nu poți
 * suna pe nimeni: cifre în nume, numere inventate, adrese temporare, un rând
 * de tastatură apăsat la întâmplare.
 */

/** Litere, semne diacritice, spațiu, cratimă și apostrof. Nimic altceva. */
const DOAR_LITERE = /^[\p{L}\p{M}'’\-. ]+$/u;

const EMAIL = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/;

/** Adrese care se autodistrug — cu ele nu ai pe cine suna peste o săptămână. */
const DOMENII_TEMPORARE = [
  'mailinator.com', 'yopmail.com', 'yopmail.fr', '10minutemail.com', 'guerrillamail.com',
  'sharklasers.com', 'grr.la', 'temp-mail.org', 'tempmail.com', 'tempmailo.com',
  'trashmail.com', 'throwawaymail.com', 'getnada.com', 'maildrop.cc', 'dispostable.com',
  'mailnesia.com', 'spam4.me', 'moakt.com', 'emailondeck.com', 'inboxkitten.com',
  'mail.tm', '1secmail.com', 'fakemail.net', 'tempr.email', 'mohmal.com',
];

/** Secvențe de pe rândurile tastaturii — semnul cel mai ieftin de date inventate. */
const TASTATURA = ['qwert', 'werty', 'asdf', 'sdfg', 'zxcv', 'xcvb', 'hjkl', 'uiop', '1234', '2345', 'abcd'];

function areTastaturaApasata(v: string) {
  const t = v.toLowerCase().replace(/\s+/g, '');
  return TASTATURA.some((s) => t.includes(s));
}

/** Aceeași literă de trei ori la rând („Aaaa", „Popeescuuu"). */
function areLiterePrelungite(v: string) {
  return /(\p{L})\1{2,}/u.test(v);
}

export function curataNume(v: string) {
  return v.replace(/\s+/g, ' ').trim();
}

export function validNume(brut: string): string | null {
  const v = curataNume(brut);
  if (!v) return 'Scrie-ți numele.';
  if (/\d/.test(v)) return 'Numele nu poate conține cifre.';
  if (!DOAR_LITERE.test(v)) return 'Numele poate conține doar litere, cratimă și apostrof.';
  if (v.length < 5) return 'Scrie numele complet, nu doar inițiala.';
  if (v.length > 80) return 'Numele e prea lung.';

  const cuvinte = v.split(' ').filter((c) => c.replace(/[^\p{L}]/gu, '').length >= 2);
  if (cuvinte.length < 2) return 'Scrie și numele, și prenumele.';
  if (new Set(cuvinte.map((c) => c.toLowerCase())).size < cuvinte.length)
    return 'Numele ăsta nu pare real.';
  if (areLiterePrelungite(v) || areTastaturaApasata(v)) return 'Numele ăsta nu pare real.';
  return null;
}

/**
 * Doar prenumele, pentru formularul scurt de pe /gratuit.
 *
 * Separat de `validNume` fiindcă acela cere nume ȘI prenume — corect pe
 * formularul de pe /mentorat, unde urmează un apel telefonic, dar greșit pe
 * trafic rece din reclame: acolo fiecare cerință în plus costă înscrieri, iar
 * un prenume e tot ce trebuie ca să scrii „Andrei, uite linkul".
 */
export function validPrenume(brut: string): string | null {
  const v = curataNume(brut);
  if (!v) return 'Scrie-ți prenumele.';
  if (/\d/.test(v)) return 'Prenumele nu poate conține cifre.';
  if (!DOAR_LITERE.test(v)) return 'Prenumele poate conține doar litere, cratimă și apostrof.';
  if (v.replace(/[^\p{L}]/gu, '').length < 2) return 'Prenumele e prea scurt.';
  if (v.length > 40) return 'Prenumele e prea lung.';
  if (areLiterePrelungite(v) || areTastaturaApasata(v)) return 'Prenumele ăsta nu pare real.';
  return null;
}

export function curataEmail(v: string) {
  return v.trim().toLowerCase();
}

export function validEmail(brut: string): string | null {
  const v = curataEmail(brut);
  if (!v) return 'Scrie o adresă de email.';
  if (v.length > 160) return 'Adresa e prea lungă.';
  if (v.includes('..')) return 'Adresa are două puncte unul după altul.';
  if (!EMAIL.test(v)) return 'Adresa nu e validă. Verifică @ și ce e după punct.';

  const domeniu = v.split('@')[1];
  if (DOMENII_TEMPORARE.includes(domeniu))
    return 'Adresele temporare nu merg aici. Dă-mi una pe care chiar o citești.';
  if (areTastaturaApasata(v.split('@')[0])) return 'Adresa asta nu pare reală.';
  return null;
}

/**
 * Aduce orice fel de scriere la formatul cu care poți suna:
 * `+40 721…`, `0040721…`, `40721…` și `0721 234 567` devin toate `0721234567`.
 */
export function curataTelefon(brut: string) {
  let t = brut.replace(/[^\d+]/g, '');
  if (t.startsWith('00')) t = '+' + t.slice(2);
  if (t.startsWith('+40')) t = '0' + t.slice(3);
  else if (/^40[237]\d{8}$/.test(t)) t = '0' + t.slice(2);
  return t;
}

/**
 * O singură cifră repetată, sau opt cifre crescătoare la rând — numere pe
 * care le scrie cine nu vrea să fie sunat.
 *
 * Pragul e opt dinadins. La cinci, `0721234567` — un număr perfect valid —
 * pica, pentru că are „1234567" în el. Un număr real cu opt cifre consecutive
 * crescătoare practic nu există.
 */
function cifreInventate(cifre: string) {
  // Aceeași cifră pe aproape toate pozițiile: 0700000000, 0777777777.
  // Pragul e 9 din 10, nu 8 — un număr „de aur" ca 0744444444 chiar există
  // și e exact genul de om căruia îi vindem, nu vreau să îl dau afară.
  const frecvente = new Map<string, number>();
  for (const c of cifre) frecvente.set(c, (frecvente.get(c) || 0) + 1);
  if (Math.max(...frecvente.values()) >= 9) return true;

  let crescator = 0;
  for (let i = 1; i < cifre.length; i++) {
    crescator = +cifre[i] === +cifre[i - 1] + 1 ? crescator + 1 : 0;
    if (crescator >= 7) return true;
  }
  return false;
}

export function validTelefon(brut: string): string | null {
  const v = curataTelefon(brut);
  if (!v) return 'Scrie un număr de telefon.';
  if (/[^\d+]/.test(v)) return 'Numărul poate conține doar cifre.';

  const international = v.startsWith('+');
  if (international) {
    if (!/^\+[1-9]\d{7,14}$/.test(v)) return 'Numărul internațional trebuie scris cu + și prefixul țării.';
  } else if (!/^0[237]\d{8}$/.test(v)) {
    return 'Scrie un număr din România, 10 cifre: 07xx xxx xxx.';
  }

  if (cifreInventate(v.replace(/\D/g, ''))) return 'Numărul ăsta nu pare real.';
  return null;
}

/** Afișat în emailul către proprietar: `0721 234 567`, nu `0721234567`. */
export function formateazaTelefon(brut: string) {
  const v = curataTelefon(brut);
  return /^0\d{9}$/.test(v) ? `${v.slice(0, 4)} ${v.slice(4, 7)} ${v.slice(7)}` : v;
}

export function validDescriere(brut: string): string | null {
  const v = brut.replace(/\s+/g, ' ').trim();
  if (!v) return 'Scrie câteva cuvinte aici — pe baza lor pregătim apelul.';
  if (v.length < 25) return 'Mai scrie puțin: din două-trei rânduri înțelegem de la ce pornim.';
  if (v.length > 3000) return 'E prea lung. Spune-ne esențialul, restul discutăm la telefon.';

  const litere = (v.match(/\p{L}/gu) || []).length;
  if (litere < 15) return 'Scrie în cuvinte, te rog.';
  const cuvinte = v.split(' ').filter((c) => c.length >= 2);
  if (cuvinte.length < 5) return 'Scrie o propoziție întreagă, nu două cuvinte.';
  if (areTastaturaApasata(v) || /(.)\1{4,}/.test(v)) return 'Răspunsul ăsta nu spune nimic.';
  return null;
}
