/**
 * Starea de vizionare a videoului educativ de pe /prezentare.
 *
 * Owner, 2026-11-02: *„video-ul nu trebuie sa aibe progress bar sa vada cat
 * dureaza sau sa poata derula … dupa ce aprcurge tot video-ul sa ii dam oferta"*.
 *
 * Trei reguli, și motivul fiecăreia:
 *
 * 1. **Nu se poate derula înainte.** Playerul raportează poziția; dacă sare
 *    peste ce n-a văzut, îl aducem înapoi la maximul atins. Înapoi poate sări
 *    oricât — a văzut deja partea aia, iar a-l împiedica să revină peste ceva
 *    ce n-a înțeles e ostilitate fără câștig.
 *
 * 2. **Progresul se ține minte.** Fără asta, cineva care închide fila la
 *    minutul 25 dintr-un video fără derulare ar trebui să reia tot de la zero.
 *    Nimeni nu face asta — ai pierdut exact omul care era aproape convins.
 *
 * 3. **Deblocarea e permanentă.** Odată ce a ajuns la final o dată, oferta
 *    rămâne deschisă (cât ține fereastra de 48h). Nu-l pui să demonstreze a
 *    doua oară.
 *
 * ⚠️ Ce NU face fișierul ăsta: nu e o măsură de securitate. Cine deschide
 * consola poate scrie `vandy-vsl-deblocat` cu mâna. Și e în regulă — scopul
 * nu e să ții oamenii afară, e ca oferta să apară la momentul în care, în
 * video, tocmai ai explicat-o. Cineva suficient de motivat încât să umble în
 * localStorage ca să vadă un buton de plată e un client, nu o problemă.
 *
 * `localStorage`, ca la fereastraOferta.ts: trebuie să supraviețuiască
 * închiderii filei. Dacă e blocat, cădem pe memorie — se pierde la reload, dar
 * în vizita curentă funcționează normal.
 */

const CHEIE_PROGRES = 'vandy-vsl-progres';
const CHEIE_DEBLOCAT = 'vandy-vsl-deblocat';

/** Cât înapoi îl lăsăm să alunece fără să-l corectăm. Playerele raportează
 *  poziția cu mici salturi; fără toleranță, l-am smuci la fiecare secundă. */
const TOLERANTA = 2;

let progresInMemorie = 0;
let deblocatInMemorie = false;

function citesteNumar(cheie: string): number | null {
  try {
    const brut = localStorage.getItem(cheie);
    if (brut === null) return null;
    const n = Number(brut);
    return Number.isFinite(n) && n >= 0 ? n : null;
  } catch {
    return null;
  }
}

/** Cea mai înaintată secundă la care a ajuns vreodată. */
export function progres(): number {
  const salvat = citesteNumar(CHEIE_PROGRES);
  return Math.max(progresInMemorie, salvat ?? 0);
}

/** Înregistrează poziția curentă. Doar înainte — maximul nu scade niciodată. */
export function noteazaProgres(secunde: number) {
  if (!Number.isFinite(secunde) || secunde < 0) return;
  const nou = Math.floor(secunde);
  if (nou <= progres()) return;
  progresInMemorie = nou;
  try {
    localStorage.setItem(CHEIE_PROGRES, String(nou));
  } catch {
    /* rămâne în memorie pentru vizita curentă */
  }
}

/**
 * Unde are voie să fie, dat fiind unde a ajuns.
 *
 * Întoarce `null` dacă poziția cerută e în regulă, sau secunda la care trebuie
 * adus înapoi dacă a sărit înainte.
 */
export function corectiePozitie(cerut: number): number | null {
  const maxim = progres();
  return cerut > maxim + TOLERANTA ? maxim : null;
}

export function esteDeblocat(): boolean {
  if (deblocatInMemorie) return true;
  try {
    if (localStorage.getItem(CHEIE_DEBLOCAT) === '1') {
      deblocatInMemorie = true;
      return true;
    }
  } catch {
    /* storage blocat — rămâne pe memorie */
  }
  return false;
}

export function deblocheaza() {
  if (deblocatInMemorie) return;
  deblocatInMemorie = true;
  try {
    localStorage.setItem(CHEIE_DEBLOCAT, '1');
  } catch {
    /* rămâne în memorie pentru vizita curentă */
  }
}

/**
 * Încarcă SDK-ul Vimeo o singură dată, de pe CDN-ul lor.
 *
 * Nu e pus în package.json intenționat: e singurul loc din proiect care are
 * nevoie de el, iar pachetul npm ar intra în bundle-ul tuturor paginilor. Aici
 * se încarcă doar dacă există chiar un video Vimeo de redat.
 */
export function incarcaVimeo(): Promise<unknown> {
  const w = window as typeof window & { Vimeo?: unknown; __vimeoPromise?: Promise<unknown> };
  if (w.Vimeo) return Promise.resolve(w.Vimeo);
  if (w.__vimeoPromise) return w.__vimeoPromise;
  w.__vimeoPromise = new Promise((rezolva, respinge) => {
    const s = document.createElement('script');
    s.src = 'https://player.vimeo.com/api/player.js';
    s.async = true;
    s.onload = () => rezolva(w.Vimeo);
    s.onerror = () => respinge(new Error('Nu s-a putut încărca playerul Vimeo.'));
    document.head.appendChild(s);
  });
  return w.__vimeoPromise;
}
