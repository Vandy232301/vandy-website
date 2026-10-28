/**
 * ATELIER AI — toate textele și setările paginii /mentorat într-un singur loc.
 *
 * Ce vei vrea să schimbi cel mai des:
 *   OFERTA.locuriLuate  — crește-l cu 1 la fiecare loc vândut. Pagina recalculează singură.
 *   OFERTA.dateText     — datele seriei, când le confirmi.
 *   OFERTA.numeProgram  — numele atelierului, dacă îl schimbi.
 *
 * Regulă pe care pagina o respectă peste tot: promitem ce PLECI CU, niciodată
 * un venit. Un venit promis în scris e afirmație comercială reglementată
 * (Legea 363/2007 privind practicile comerciale incorecte), iar produsul lui
 * de trading îl face oricum „expert" în ochii legii. Ce pleci cu e verificabil
 * și e, în plus, mai convingător.
 */

export const OFERTA = {
  numeProgram: 'ATELIER AI',

  /** Preț integral, în euro. */
  pret: 990,
  /** Varianta în două tranșe. Suma e intenționat mai mare — plata integrală trebuie să fie cea convenabilă. */
  rate: { numar: 2, suma: 545 },

  locuriTotal: 10,
  /** Crește-l pe măsură ce se ocupă locurile. */
  locuriLuate: 0,

  dateText: 'Pornește în noiembrie 2026',
  dateNota: 'Datele exacte se stabilesc la apel, cu cei 10 înscriși.',

  durata: '3 zile live',
} as const;

export const locuriLibere = OFERTA.locuriTotal - OFERTA.locuriLuate;

/** Cele trei direcții. Primești toate trei, execuți una. */
export const DIRECTII = [
  {
    id: 'agentie',
    numar: '01',
    nume: 'AGENȚIA',
    promisiune: 'Vinzi servicii făcute cu AI.',
    text: 'Cel mai scurt drum până la primul om care îți dă bani, pentru că vinzi ceva ce există deja din prima zi: rezultatul tău. Nu ai nevoie de produs, de investiție și de așteptare.',
    pleciCu: [
      'Oferta scrisă și prețurile tale',
      'Primii 10 clienți identificați pe nume',
      'Mesajul exact cu care îi contactezi',
    ],
  },
  {
    id: 'produs',
    numar: '02',
    nume: 'PRODUSUL',
    promisiune: 'Îți construiești propria aplicație.',
    text: 'Mai greu la început decât agenția, și e cinstit să o spun. Dar e singura direcție unde construiești lucrul o dată și îl vinzi de o sută de ori. Toate cele 10 aplicații de mai sus sunt direcția asta.',
    pleciCu: [
      'O aplicație publicată, la domeniul ei',
      'Plata funcțională în ea, nu „urmează"',
      'Arhitectura cu care o duci mai departe',
    ],
  },
  {
    id: 'creativ',
    numar: '03',
    nume: 'CREATIVUL',
    promisiune: 'Video cu AI pentru branduri.',
    text: 'Aici lipsa de oameni e cea mai mare: branduri care vor și au bani, foarte puțini care livrează la calitate de difuzat. Diferența nu stă în tool, stă în ce accepți să trimiți mai departe.',
    pleciCu: [
      '3 piese de portofoliu, nu teste',
      'Lanțul de producție complet',
      'Lista de branduri pe care le abordezi',
    ],
  },
] as const;

/** Ce pleci cu — baza garanției. Fiecare rând e verificabil în ziua 3. */
export const PLECI_CU = [
  { titlu: 'Lucrul tău, construit și publicat', text: 'Nu un demo, nu un plan. Ceva care funcționează și are adresă.' },
  { titlu: 'Oferta scrisă și prețul',            text: 'Ce vinzi, cu ce cuvinte, și cât ceri. Pe hârtie, nu în cap.' },
  { titlu: 'Primii 10 clienți, pe nume',         text: 'Nu „publicul țintă". Zece oameni sau firme, cu nume și contact.' },
  { titlu: 'Tot ce folosesc eu',                 text: 'Prompturile, șabloanele și fluxurile mele de lucru, așa cum sunt.' },
  { titlu: 'Comunitatea ATELIER AI, pe viață',    text: 'Acces lifetime pe Discord. Fără abonament, fără reînnoire, fără să-ți mai cer vreodată bani pentru ea.' },
] as const;

/* ────────────────────────────────────────────────────────────────────────
   BRANDURI PENTRU CARE A LUCRAT

   Aceleași cinci care apar la „TRUSTED BY" pe dozain.com, confirmate de
   proprietar pe 28.10.2026 ca fiind clienți reali.

   ⚠️ Două reguli, și amândouă contează:
   1. Se scriu ca TEXT, nu ca logouri. Numele unui client, folosit ca să
      descrii o colaborare reală, e uz nominativ. Logoul lui e marcă
      înregistrată și ridică o întrebare în plus pe care nu trebuie să ne-o
      punem.
   2. Formularea e „branduri pentru care am lucrat", niciodată „parteneri"
      sau ceva care sugerează că brandurile astea susțin atelierul. Ele nu
      au nicio legătură cu ATELIER AI.

   Separat: galeria de pe dozain.com marchează explicit piesele McDonald's,
   Nike și Coca-Cola drept „concept" — spec work nesolicitat. Alea NU intră
   aici și nu se amestecă niciodată cu lista de mai jos.
   ──────────────────────────────────────────────────────────────────────── */

export const BRANDURI = [
  'UNTOLD',
  'NEVERSEA',
  'VOLKSWAGEN',
  'AUDI',
  'BANCA TRANSILVANIA',
] as const;

/**
 * Comunitatea. E livrabilul care rămâne după cele trei zile, deci merită
 * spus explicit: numele ei, platforma, și că accesul nu expiră.
 *
 * Atenție la formulare: comunitatea OFERĂ lucrurile de mai jos, nu
 * GARANTEAZĂ un venit — vezi PIATA_AVERTISMENT pentru același motiv.
 */
export const COMUNITATE = {
  nume: 'ATELIER AI',
  platforma: 'Discord',
  acces: 'LIFETIME',
  lucruri: [
    {
      titlu: 'Noutățile din lumea AI',
      text: 'Ce a apărut, ce s-a schimbat și ce înseamnă pentru ce construiești tu. Filtrat, nu copiat de pe Twitter.',
    },
    {
      titlu: 'Suport la dezvoltare',
      text: 'Te blochezi, pui întrebarea, primești răspuns. De la mine și de la oamenii care au trecut prin același lucru.',
    },
    {
      titlu: 'Canalul direcției tale',
      text: 'Agenție, produs sau creativ. Separat, ca să nu cauți prin o mie de mesaje care nu te privesc.',
    },
    {
      titlu: 'Sesiune la două săptămâni',
      text: 'Live, pe ecran, cu problemele reale ale celor din serie. Nu webinar, nu prezentare.',
    },
    {
      titlu: 'Oamenii din seria ta',
      text: 'Nouă oameni care au început în aceeași zi cu tine. Din experiență, asta cântărește cel mai mult.',
    },
    {
      titlu: 'Tot ce apare după',
      text: 'Șabloanele, fluxurile și prompturile noi intră acolo pe măsură ce le fac. Le primești fără să plătești iar.',
    },
  ],
} as const;

export const ZILE = [
  {
    eticheta: 'ZIUA 1',
    nume: 'MOTORUL',
    text: 'Partea care nu se schimbă niciodată, oricâte tool-uri apar. Cum transformi o cerere vagă în caiet de sarcini pe care AI-ul îl execută corect din prima. Mediul de lucru pus la punct. Și construim primul lucru împreună, live, de la zero.',
  },
  {
    eticheta: 'ZIUA 2',
    nume: 'CONSTRUIEȘTI',
    text: 'Pe direcția pe care ai ales-o. Nu te uiți la mine cum construiesc — construiești tu, iar eu mă uit pe ecranul tău și repar. Asta e ziua pentru care locurile sunt 10 și nu 100.',
  },
  {
    eticheta: 'ZIUA 3',
    nume: 'VINZI',
    text: 'Cum se formează prețul și cum îl ceri fără să te scuzi. Oferta, primul mesaj, primii 10 clienți. Publicarea lucrului tău. Și exact ce faci în următoarele 30 de zile, zi cu zi.',
  },
] as const;

export const NU_E_PENTRU = [
  'Dacă vrei bani fără să construiești nimic. Aici se muncește trei zile.',
  'Dacă intenționezi să te uiți la înregistrări „când am timp". Atelierul e live dintr-un motiv.',
  'Dacă aștepți să îți garantez un venit. Nu garantez, și nu ar trebui să crezi pe nimeni care o face.',
] as const;

export const INTREBARI = [
  {
    q: 'Trebuie să știu să programez?',
    a: 'Nu. Niciuna din cele 10 aplicații nu a fost scrisă de mână, linie cu linie. Dar nu e nici magie: în cele trei zile muncești, iar în ziua 2 construiești tu, nu te uiți.',
  },
  {
    q: 'Cât o să câștig?',
    a: 'Nu îți promit niciun venit, și te rog să nu crezi pe nimeni care îți promite unul în scris. Ce îți promit e ce pleci cu: lucrul construit și publicat, oferta, prețul și primii 10 clienți. Cât ceri și cât închizi depinde de tine și de piața ta.',
  },
  {
    q: 'De ce doar 10 locuri?',
    a: 'Din cauza zilei 2. Ca să mă uit pe ecranul fiecăruia și să repar pe loc, nu pot fi 50 de oameni. La 50 devine un curs, iar cursuri despre AI există deja cu sutele și nu produc nimic.',
  },
  {
    q: 'Ce se întâmplă dacă pierd o zi?',
    a: 'Toate cele trei zile sunt înregistrate și le ai. Dar dacă știi de pe acum că nu poți fi prezent live, îți spun cinstit să aștepți seria următoare — valoarea e în timpul pe care ți-l dau eu, nu în fișierele video.',
  },
  {
    q: 'Cu ce tool-uri lucrăm?',
    a: 'Cu cele care sunt cele mai bune în ziua atelierului, și ți le arăt pe ecranul meu. Nu construim lecția în jurul unui tool, pentru că tool-ul se schimbă în trei luni. Metoda nu.',
  },
  {
    q: 'Primesc factură?',
    a: 'Da, pe firmă sau pe persoană fizică, cum ai nevoie. Plata se face integral sau în două tranșe.',
  },
] as const;

/** Opțiunile din formularul de aplicare. Trebuie să coincidă cu cele din api/aplica-mentorat.js. */
export const OPTIUNI_DIRECTIE = [
  { value: 'agentie', label: 'Agenția — vând servicii cu AI' },
  { value: 'produs',  label: 'Produsul — îmi construiesc aplicația' },
  { value: 'creativ', label: 'Creativul — video cu AI pentru branduri' },
  { value: 'nu-stiu', label: 'Nu știu încă — ajută-mă să aleg' },
] as const;

export const OPTIUNI_STADIU = [
  { value: 'zero',    label: 'Nu am început nimic' },
  { value: 'incercat', label: 'Am încercat singur, m-am blocat' },
  { value: 'clienti', label: 'Am deja clienți, vreau să livrez cu AI' },
  { value: 'firma',   label: 'Am firmă și echipă' },
] as const;

/* ────────────────────────────────────────────────────────────────────────
   PREȚURILE PIEȚEI

   Regula care face secțiunea asta legală ȘI mai convingătoare decât o
   promisiune: afișăm CÂT SE VINDE PE PIAȚĂ, cu sursă, niciodată cât va
   câștiga cititorul. Un preț verificabil e mai greu de respins decât o
   cifră inventată, iar „vei face X pe lună" ar fi afirmație comercială
   reglementată (Legea 363/2007).

   Dacă schimbi cifrele, schimbă și sursa. Niciun număr fără sursă.
   Verificate pe 28.10.2026.
   ──────────────────────────────────────────────────────────────────────── */

export interface RandPiata {
  ce: string;
  pret: string;
  detaliu: string;
}

export interface PiataDirectie {
  /** Trebuie să coincidă cu un id din DIRECTII. */
  id: string;
  nume: string;
  randuri: RandPiata[];
  /** Aritmetică pe prețurile de mai sus. Niciodată o estimare de venit. */
  acopera: string;
  sursa: { text: string; href: string };
}

export const PIATA: PiataDirectie[] = [
  {
    id: 'agentie',
    nume: 'AGENȚIA',
    randuri: [
      { ce: 'Site de prezentare', pret: '500 – 2.500 €', detaliu: 'mediana pieței: ~1.000 €' },
      { ce: 'Magazin online', pret: '4.000 – 10.000 €', detaliu: '20.000 – 50.000 lei' },
      { ce: 'Oră de development în România', pret: '30 – 50 €', detaliu: 'tarif profesionist curent' },
    ],
    acopera: 'Un singur site de prezentare, vândut la mediana pieței, acoperă atelierul.',
    sursa: { text: 'webforge.org.ro — cât costă un site web', href: 'https://webforge.org.ro/blog/cat-costa-un-site-web' },
  },
  {
    id: 'produs',
    nume: 'PRODUSUL',
    randuri: [
      { ce: 'MVP: autentificare + un flux principal', pret: '3.000 – 7.000 €', detaliu: 'livrat în 4 – 8 săptămâni' },
      { ce: 'Aplicație cu roluri, integrări și plăți', pret: '10.000 – 30.000 €', detaliu: 'livrată în 2 – 5 luni' },
      { ce: 'Aplicație enterprise', pret: 'peste 30.000 €', detaliu: 'microservicii, conformitate, SLA' },
    ],
    acopera: 'Cel mai ieftin MVP din piață costă de trei ori cât atelierul. Aici nu cumperi unul — înveți să îl construiești.',
    sursa: { text: 'webforge.org.ro — cât costă o aplicație web', href: 'https://webforge.org.ro/blog/cat-costa-o-aplicatie-web' },
  },
  {
    id: 'creativ',
    nume: 'CREATIVUL',
    randuri: [
      { ce: 'Reclame UGC făcute cu AI', pret: 'de la 450 lei', detaliu: 'pentru un set de 3' },
      { ce: 'Pachet lunar de 12 clipuri', pret: '1.800 lei / lună', detaliu: '4 clipuri: 800 lei · 8 clipuri: 1.500 lei' },
      { ce: 'Editare pe materialul clientului', pret: 'de la 600 lei', detaliu: 'pentru 10 clipuri' },
    ],
    acopera: 'Trei clienți pe pachetul lunar de 12 clipuri înseamnă 5.400 lei pe lună, la prețurile afișate azi în piață.',
    sursa: { text: 'tezeumedia.ro — marketing video', href: 'https://tezeumedia.ro/marketing-video' },
  },
];

/** Apare sub tabele. Nu o șterge — ea e diferența dintre preț de piață și promisiune de câștig. */
export const PIATA_AVERTISMENT =
  'Cifrele de mai sus sunt prețuri publicate de furnizori din piață în octombrie 2026, nu veniturile mele și nu o estimare a veniturilor tale. Câți clienți închizi, la ce preț și în cât timp depinde de tine, de piața ta și de cât muncești. Nimeni nu îți poate promite un termen, și nu ar trebui să crezi pe cineva care o face.';

/* ────────────────────────────────────────────────────────────────────────
   CAPTURI — dovada vizuală. Fiecare e un ecran real, luat de pe site-ul
   live al produsului pe 28.10.2026, nu un mockup și nu o imagine de stoc.
   ──────────────────────────────────────────────────────────────────────── */

import CAP_NOWWWA from '../assets/capturi/nowwwa.jpg';
import CAP_IZZY from '../assets/capturi/izzy.jpg';
import CAP_ELYA from '../assets/capturi/elya.jpg';
import CAP_BLUR from '../assets/capturi/blur.jpg';
import CAP_NEOTRADER from '../assets/capturi/neotrader.jpg';
import CAP_SWAGG from '../assets/capturi/swagg.jpg';
import CAP_PWAS from '../assets/capturi/pwas.jpg';
import CAP_WIZZY from '../assets/capturi/wizzywazza.jpg';
import CAP_DOZAIN from '../assets/capturi/dozain.jpg';
import CAP_CHINA from '../assets/capturi/chinadirect.jpg';

/**
 * Captura fiecărui produs, pe id-ul lui din PROJECTS.
 * Cardurile de pe /mentorat sunt aceleași componente ca pe prima pagină,
 * doar că primesc captura ca fundal.
 */
export const CAPTURI: Record<string, string> = {
  nowwwa: CAP_NOWWWA,
  neotrader: CAP_NEOTRADER,
  izzy: CAP_IZZY,
  pwas: CAP_PWAS,
  elya: CAP_ELYA,
  blur: CAP_BLUR,
  swagg: CAP_SWAGG,
  wizzywazza: CAP_WIZZY,
  dozain: CAP_DOZAIN,
  chinadirect: CAP_CHINA,
};

/**
 * Ce produse apar ca dovadă pe /mentorat, în ordinea asta.
 * Lipsesc intenționat `dynasty` (comunitate de trading, nu aplicație) și
 * `consult` (serviciu) — titlul secțiunii spune „zece aplicații", deci
 * trebuie să fie exact zece aplicații.
 */
export const PRODUSE_DOVADA = [
  'nowwwa', 'neotrader', 'izzy', 'pwas', 'elya',
  'blur', 'swagg', 'wizzywazza', 'dozain', 'chinadirect',
] as const;

/* ────────────────────────────────────────────────────────────────────────
   RECENZII

   ⚠️ NUMAI RECENZII REALE, de la clienți reali, cu acordul lor.
   Lista e goală intenționat: pagina nu afișează secțiunea până nu pui
   recenzii adevărate aici. O recenzie inventată pusă ca reală nu se scrie
   și nu se publică — e fraudă, nu copywriting, și e exact genul de lucru
   pe care publicul românesc îl caută ([[vandy-reactia-ro-la-bogatie]]:
   60,1% presupun deja că e ceva necurat la mijloc).

   Ca să o completezi, un obiect per client:
     {
       nume: 'Andrei Popescu',
       rol: 'fondator, Firma SRL',          // rolul real, nu „antreprenor"
       text: 'textul lor, cuvintele lor',   // nerescris de tine
       lucrare: 'ce i-ai construit',
       href: 'https://link-ul-firmei.ro',   // opțional, dar cel mai puternic
     }

   Cel mai puternic element de încredere din tot setul e linkul: o recenzie
   cu nume, firmă și adresă verificabilă valorează cât zece anonime.
   ──────────────────────────────────────────────────────────────────────── */

export interface Recenzie {
  nume: string;
  rol: string;
  text: string;
  lucrare: string;
  href?: string;
}

export const RECENZII: Recenzie[] = [];

/* ────────────────────────────────────────────────────────────────────────
   ÎNCREDERE — numai lucruri verificabile sau pe care le controlezi tu.
   ──────────────────────────────────────────────────────────────────────── */

/** Completeaz-o și apare în subsol. În România, datele firmei pe pagină cântăresc mult. */
export const FIRMA: { denumire: string; cui: string; sediu: string } | null = null;

export const INCREDERE = [
  { titlu: 'Nu plătești până nu vorbim', text: 'Aplici, te sun, și abia după ce îți confirm locul se discută plata.' },
  { titlu: 'Returnare integrală', text: 'Dacă la finalul zilei 3 nu ai construit și publicat lucrul tău, primești toți banii înapoi.' },
  { titlu: 'Factură fiscală', text: 'Pe firmă sau pe persoană fizică. Plata integral sau în două tranșe.' },
  { titlu: 'Răspund eu, nu un chatbot', text: 'Pe Instagram și pe Telegram, la aceleași conturi de pe care postez.' },
  { titlu: '10 aplicații cu adresă publică', text: 'Nu capturi de ecran: adrese pe care le poți deschide acum și verifica.' },
  { titlu: 'Branduri mari, lucrări reale', text: 'UNTOLD, NEVERSEA, Volkswagen, Audi, Banca Transilvania. Nu lucrări de portofoliu — clienți.' },
  { titlu: '11 ani în branding', text: 'Nu am început cu AI. AI-ul e unealta din urmă, nu meseria.' },
] as const;
