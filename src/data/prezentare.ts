/**
 * /prezentare — pagina cu videoul educativ. Pasul 2 din funnel.
 *
 * Arhitectura, owner, 2026-11-02, verbatim:
 *
 *   „reclame / content pentru trafic > website complet cu elemente de trust tot
 *   ce trebuie cum e acum si formularul cu titlul mare cum faci intre 200/300$
 *   > isi lasa datele > ajunge la Video Educativ pagina dedicata (video-ul nu
 *   trebuie sa aibe progress bar sa vada cat dureaza sau sa poata derula, de
 *   asemenea as pune video disponibil doar 48 de ore si dupa ce aprcurge tot
 *   video-ul sa ii dam oferta de acces la masterclass cu un bonus + plata
 *   imediata de rezervare a locului de 99 de euro care se va scade din suma
 *   finala)"
 *
 * Landing page-ul e `/mentorat` — „website complet … cum e acum". Reclamele duc
 * acolo, formularul cu titlul mare e acolo, iar înscrierea aterizează aici.
 *
 * ⛔ AICI prețul SE AFIȘEAZĂ, spre deosebire de /mentorat. Nu e o scăpare:
 * regula owner-ului din 29.10.2026 („Pretul nu l-as pune la vedere") e despre
 * pagina publică, unde cifra ar speria înainte să existe context. Pagina asta
 * e privată (`noindex`), se vede doar după înscriere, iar o rezervare nu poate
 * fi cerută fără să spui din ce se scade. Dacă /prezentare devine vreodată
 * publică, regula se aplică din nou și pagina trebuie regândită.
 */

import { OFERTA } from './mentorat';

export const ANTET = {
  eticheta: 'Pasul 2 din 2 · acces deschis 48 de ore',
  titlu: 'Ești înăuntru. Uită-te la asta înainte de orice.',
  text: 'Îți arăt pas cu pas tot procesul: ce construiești, cum ajunge la clienți și cum se plătește. Uită-te la el cap-coadă — la final îți spun și singurul pas care mai există după.',
} as const;

/**
 * Videoul.
 *
 * `url` e null până îl înregistrează owner-ul. Cât timp e null pagina nu are ce
 * livra — nu există VSL, deci nu există funnel. Zona arată locul gol, explicit.
 * Aceeași regulă ca la cele 9 carduri de recenzie de pe /mentorat: nu inventăm
 * și nu pretindem ce nu avem.
 *
 * ┌─ De ce `vimeo` și nu YouTube ───────────────────────────────────────────┐
 * │ Owner-ul cere video FĂRĂ bară de progres, fără durată vizibilă și fără   │
 * │ derulare. YouTube nu poate face asta: `controls=0` ascunde bara, dar     │
 * │ durata rămâne vizibilă la hover și derularea de la tastatură merge.      │
 * │ Vimeo, cu `controls=0` plus SDK-ul lor, raportează poziția și o poate    │
 * │ corecta — singura combinație care chiar respectă cerința.                │
 * │ Alternativă, mai ieftină la volum: Bunny Stream. Pentru ea pune          │
 * │ `provider: 'embed'`: videoul merge, dar blocarea derulării nu, fiindcă   │
 * │ n-avem de unde citi poziția. Atunci oferta se dezvăluie pe ceas, de la   │
 * │ primul play, și e o aproximare — nu o verificare.                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * `dezvaluieLaSecunda`: null înseamnă „la finalul videoului" (evenimentul
 * `ended`), adică exact ce a cerut owner-ul. Pune o secundă aici doar dacă vrei
 * oferta mai devreme — de pus fix la momentul în care, în video, o explici.
 */
export const VIDEO: {
  provider: 'vimeo' | 'embed';
  url: string | null;
  dezvaluieLaSecunda: number | null;
  durata: string;
} = {
  provider: 'vimeo',
  url: null,
  dezvaluieLaSecunda: null,
  durata: '20 – 30 de minute',
};

/**
 * Rezervarea locului. Cifra owner-ului, 2026-11-02: 99 €, care SE SCADE din
 * suma finală. Nu e un avans pierdut și nu e o taxă — pagina o spune explicit,
 * fiindcă e singura întrebare pe care și-o pune omul când vede un buton de
 * plată după un lucru gratuit.
 *
 * ⚠️ În același mesaj apare și cifra „49$". Am mers pe 99 €, care e afirmația
 * detaliată („de 99 de euro care se va scade din suma finala"). Dacă 49 era un
 * preț mai mic pentru secvența de emailuri, întreabă-te întâi dacă vrei să-ți
 * înveți publicul că prețul scade dacă aștepți.
 */
export const REZERVARE = 99;

export const OFERTA_REZERVARE = {
  eticheta: 'Ofertă cu termen limită',
  titlu: 'Îți rezervi locul cu 99 €.',
  rezervare: REZERVARE,
  total: OFERTA.pret,
  get rest() { return OFERTA.pret - REZERVARE; },
  text: 'Plătești acum 99 € și locul e al tău, scos din cele zece. Suma se scade din total — nu e o taxă în plus și nu o pierzi. Restul îl plătești înainte de zi, după ce vorbim.',
  /** Rândul care ține termenul limită pe partea bună a legii. Nu-l scoate. */
  onest: 'Masterclass-ul nu dispare când ajunge ceasul la zero și prețul rămâne același. Ce se închide e videoul și posibilitatea de a-ți ține locul cu 99 €. După termen, locul se ia plătind integral, dacă mai e liber.',
  expirat: 'Fereastra s-a închis.',
  expiratText: 'Videoul și rezervarea de 99 € nu mai sunt disponibile. Masterclass-ul și prețul rămân neschimbate — scrie-mi și vedem ce mai e liber.',
} as const;

/**
 * Bonusul din ofertă. Cerut de owner („cu un bonus"), dar nespus care.
 *
 * ⚠️ Al DOILEA bonus nedefinit din funnel — primul e „bonusul surpriză" de pe
 * fereastra de 10 minute din /mentorat. Cât timp e `null`, oferta nu pretinde
 * niciun bonus: mai bine o ofertă fără bonus decât un bonus pe care nu-l poți
 * livra. Pune aici ceva real și apare singur.
 */
export const BONUS: { titlu: string; text: string } | null = null;

/**
 * Linkul de plată a rezervării. Null până îl pune owner-ul.
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
