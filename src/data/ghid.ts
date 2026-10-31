/**
 * GHIDUL GRATUIT — lead magnetul care duce la MASTERCLASS ATELIER AI.
 *
 * Mecanica, cerută de owner pe 31.10.2026: omul își lasă datele PENTRU un
 * lucru numit în titlu, primește un video în care e învățat pas cu pas, iar
 * încrederea construită acolo îl duce la apel. Nu e o pagină de prezentare,
 * e o pagină cu o singură treabă.
 *
 * ⚠️ Titlul promite o cifră de venit și e al owner-ului, cuvânt cu cuvânt.
 * I-am spus de două ori că /mentorat scrie exact opusul — „Dacă aștepți să îți
 * garantez un venit. Nu garantez, și nu crede pe nimeni care o face" — și că o
 * afirmație de rezultat trebuie susținută cu ce obține un participant obișnuit
 * (Legea 363/2007, art. 6, practică înșelătoare; ANPC). Răspunsul a fost
 * „Lasa cum iti spun eu", deci titlul rămâne cum l-a scris. Nu-l rescrie fără
 * el. Singurul lucru pe care l-am păstrat e DISCLAIMER, rândul de subsol —
 * nu atinge titlul și există pe orice pagină de genul ăsta.
 */

export const HERO = {
  eticheta: 'Ghid video gratuit',
  /** Cuvintele owner-ului, 31.10.2026. */
  titlu: 'Învață cum poți face 200–300 $ pe zi creând și vânzând site-uri simple.',
  /** Partea a doua a frazei lui, scoasă din titlu ca titlul să încapă pe trei rânduri. */
  subtitlu:
    'Pentru clienți care ar plăti chiar și mai mult pentru asta. Îți arăt pas cu pas, pe ecran, cum le construiești și cum le vinzi.',
  nota: 'Gratis. Îl primești imediat, pe loc.',
} as const;

/** Ce e în video. Patru lucruri, nu zece — o listă lungă se citește ca umplutură. */
export const PRIMESTI = [
  {
    icon: 'tinta',
    titlu: 'Ce site se vinde cel mai ușor',
    text: 'Clientul mic nu vrea ce crezi tu că vrea. Îți arăt exact tipul de pagină pentru care scoate banii fără să se gândească o săptămână.',
  },
  {
    icon: 'ecran',
    titlu: 'Construcția, de la zero, pe ecran',
    text: 'Nu teorie. Mă uiți cum îl fac, de la pagina albă până la adresa care se deschide în browser. Fără să scrii cod de mână.',
  },
  {
    icon: 'eticheta',
    titlu: 'Cât ceri și cum spui prețul',
    text: 'Cum se formează cifra pe care o ceri și cum o spui fără să te scuzi că ai cerut-o. Partea la care pică aproape toți.',
  },
  {
    icon: 'oameni',
    titlu: 'De unde iau primii clienți',
    text: 'Zece nume reale din orașul tău, și primul mesaj pe care îl trimiți. Scris, nu „ar trebui să faci networking".',
  },
] as const;

export const PENTRU_CINE = {
  eticheta: 'Înainte să-ți lași emailul',
  titlu: 'Pentru cine e, și pentru cine nu.',
  da: [
    'Începi de la zero, fără experiență de programare.',
    'Ai două-trei ore pe săptămână pe care chiar le dai.',
    'Vrei un lucru pe care să-l poți livra unui client real, nu un curs de ascultat.',
  ],
  nu: [
    'Cauți un buton care face banii singur, fără tine.',
    'Nu ești dispus să vorbești cu niciun client.',
  ],
} as const;

/**
 * Videoul. `url` e null până îl înregistrează owner-ul.
 *
 * Cât timp e null, pagina NU are ce livra — adică magnetul nu există. Pe
 * localhost apare o bandă care spune asta; în producție, zona de livrare
 * arată locul gol, ca să fie imposibil de ratat. Aceeași regulă ca la
 * RECENZII pe /mentorat: nu inventăm ce nu avem.
 */
export const VIDEO: { url: string | null; durata: string; poster: string | null } = {
  url: null,
  durata: '90 de minute',
  poster: null,
};

/** Lista de verificare, tovarășul videoului. Ăsta e motivul pentru care nu șterge emailul. */
export const LISTA = {
  titlu: 'Lista de verificare, pe o pagină',
  text: 'Toți pașii din video, pe o singură pagină, de ținut lângă ecran în timp ce lucrezi.',
  fisier: null as string | null,
} as const;

export const LIVRARE = {
  titlu: 'Gata. E al tău.',
  text: 'Pornește videoul de aici, acum. Ți-am trimis linkul și pe email, ca să-l ai și mâine.',
  fara: 'Ți-am notat emailul. Videoul îți vine imediat ce e gata — nu mai trebuie să faci nimic.',
} as const;

/** Puntea către produs. Spune cinstit ce lipsește din ghid — de aia se crede. */
export const PUNTE = {
  eticheta: 'Pasul următor',
  titlu: 'Ai făcut un site. Hai să faci un business.',
  text: 'Ghidul te învață un lucru: cum construiești și cum vinzi un site simplu. La MASTERCLASS ATELIER AI construiești sistemul tău — produsul tău, lista de clienți, mesajul, prețul și primele 30 de zile. O zi live, zece locuri.',
  buton: 'Vezi masterclass-ul',
  href: '/mentorat',
} as const;

/** Rândul de subsol. Nu atinge titlul; există pe orice pagină de genul ăsta. */
export const DISCLAIMER =
  'Rezultatele depind de munca, priceperea și piața fiecăruia. Ghidul este material educativ și nu reprezintă o garanție de venit.';
