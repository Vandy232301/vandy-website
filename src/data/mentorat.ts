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
  seria: 'SERIA 1',

  /** Preț integral, în euro. */
  pret: 990,
  /** Varianta în două tranșe. Suma e intenționat mai mare — plata integrală trebuie să fie cea convenabilă. */
  rate: { numar: 2, suma: 545 },

  locuriTotal: 10,
  /** Crește-l pe măsură ce se ocupă locurile. */
  locuriLuate: 0,

  dateText: 'Seria 1 pornește în noiembrie 2026',
  dateNota: 'Datele exacte se stabilesc la apel, cu cei 10 înscriși.',

  durata: '3 zile live',
} as const;

export const locuriLibere = OFERTA.locuriTotal - OFERTA.locuriLuate;

/** Cele 10 aplicații live. Dovada centrală a paginii — fiecare are URL public. */
export const DOVEZI = [
  { nume: 'NOWWWA',       ce: 'Platformă de development',   href: 'https://nowwwa.ai/' },
  { nume: 'IZZY',         ce: 'Agent imobiliar AI',         href: 'https://izzy.estate/' },
  { nume: 'ELYA',         ce: 'Asistenți AI de vânzări',    href: 'https://elya.app/' },
  { nume: 'BLUR',         ce: 'Pay-per-view pentru creatori', href: 'https://blur.fan/' },
  { nume: 'NEO TRADER',   ce: 'Indicatori din limbaj natural', href: 'https://neotrader.app/' },
  { nume: 'DOZAIN',       ce: 'Design pe abonament',        href: 'https://dozain.com/' },
  { nume: 'PWAS',         ce: 'Piață autonomă de software', href: 'https://pwas.dev/' },
  { nume: 'SWAGG',        ce: 'Studio pe abonament',        href: 'https://swagg.studio/' },
  { nume: 'WIZZYWAZZA',   ce: 'DJ AI audio-reactiv',        href: 'https://wizzywazza.vandy.ro/#catalog' },
  { nume: 'CHINA DIRECT', ce: 'Agent de achiziții din China', href: 'https://china-direct-app.vercel.app/' },
] as const;

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
  { titlu: 'Comunitatea, permanent',             text: 'Canalul direcției tale și oamenii din seria ta. Fără abonament.' },
] as const;

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
