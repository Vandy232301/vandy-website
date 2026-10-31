/**
 * ATELIER AI — toate textele și setările paginii /mentorat într-un singur loc.
 *
 * Ce vei vrea să schimbi cel mai des:
 *   OFERTA.locuriLuate  — crește-l cu 1 la fiecare loc vândut. Pagina recalculează singură.
 *   OFERTA.dateText     — datele seriei, când le confirmi.
 *   OFERTA.numeProgram  — numele programului, dacă îl schimbi.
 *
 * ⛔ PREȚUL NU SE AFIȘEAZĂ NICĂIERI PE PAGINĂ. Decizie owner, 29.10.2026:
 * „Pretul nu l-as pune la vedere." Rămâne în fișier pentru că e nevoie de el
 * la apel și în emailul intern, dar nicio componentă nu îl randează. Dacă
 * adaugi vreodată `{OFERTA.pret}` în JSX, încalci decizia asta.
 * Omul îl află la apel; în formular e întrebat doar cât ar fi dispus să
 * investească (OPTIUNI_BUGET), ca să știm cu ce venim la discuție.
 *
 * Regulă pe care pagina o respectă peste tot: promitem ce PLECI CU, niciodată
 * un venit. Un venit promis în scris e afirmație comercială reglementată
 * (Legea 363/2007 privind practicile comerciale incorecte), iar produsul lui
 * de trading îl face oricum „expert" în ochii legii. Ce pleci cu e verificabil
 * și e, în plus, mai convingător.
 */

export const OFERTA = {
  numeProgram: 'ATELIER AI',

  /**
   * Poziționarea, cerută de owner pe 29.10.2026, verbatim:
   * „Vreau pozitiinarea sa fie MASTERCLASS Exclusiv pentru Antreprenorii si
   * Fondatorii care vor sa performeze in era AI."
   * `tip` e cuvântul de deasupra numelui peste tot; `pentruCine` e rândul care
   * spune din prima cui i se adresează și, implicit, cui nu.
   */
  tip: 'MASTERCLASS',
  pentruCine: 'Exclusiv pentru antreprenorii și fondatorii care vor să performeze în era AI.',

  /**
   * ⛔ NU se afișează pe pagină. Se spune la apel. Vezi antetul fișierului.
   *
   * Owner, 29.10.2026: „Vreau MASTERCLASS-ul sa fie de fapt 3 bucati fiecare
   * la cate 990 euro (ca idee pretul nu uil afisezi pe website), dar vreau sa
   * le vand separat la 990 sau toate doua la 1490 sau toate 3 la 1990 euro."
   *
   * Nu sunt trei produse diferite cu trei pagini: e un singur masterclass cu
   * trei zile care se pot cumpăra separat. De aia pagina vorbește despre „cele
   * trei", nu despre „pachetul X".
   */
  pachete: [
    { bucati: 1, pret: 990,  eticheta: 'un masterclass' },
    { bucati: 2, pret: 1490, eticheta: 'oricare două' },
    { bucati: 3, pret: 1990, eticheta: 'toate trei' },
  ],
  /** Prețul unui singur masterclass. Păstrat separat: îl cere emailul intern. */
  pret: 990,
  /** Varianta în două tranșe, pentru un singur masterclass. */
  rate: { numar: 2, suma: 545 },

  locuriTotal: 10,
  /** Crește-l pe măsură ce se ocupă locurile. Owner, 29.10.2026: „Pune doar 7
   *  locuri mai sunt libere." Cifra e a lui, din vânzări — eu n-am de unde s-o
   *  verific. Dacă nu e reală, tot ce se sprijină pe ea (punctele, `notaLocuri`,
   *  rândul din final) devine raritate inventată, adică exact practica
   *  interzisă de Legea 363/2007. Ține-o la zi. */
  locuriLuate: 3,

  dateText: 'Pornește în noiembrie 2026',
  dateNota: 'Datele exacte se stabilesc la apel, cu cei 10 înscriși.',

  /**
   * Rândul al doilea din bara flotantă.
   *
   * ⚠️ Owner a cerut pe 29.10.2026 „Locurile se ocupa rapid". L-am lăsat
   * deocamdată pe varianta de mai jos, care spune același lucru și e
   * adevărată cu 0 locuri vândute. „Se ocupă rapid" e o afirmație despre
   * viitor pe care nimic nu o susține încă, iar urgența falsă e exact ce
   * contrazice „nu există ofertă care expiră în zece minute" de pe aceeași
   * pagină — și e pe lista neagră din Directiva 2005/29/CE (Legea 363/2007).
   * 29.10.2026: s-au ocupat primele trei locuri, deci rândul poate spune acum
   * câte au rămas. Se scrie singur din `locuriLuate` — vezi `notaLocuri` de sub
   * `OFERTA` — ca să nu rămână o cifră veche în bară când se mai vinde unul.
   */

  /**
   * Durata UNUI masterclass. Owner a ales pe 29.10.2026 varianta „1 zi live
   * fiecare": cumperi unul, vii o zi; le iei pe toate trei, vii trei zile.
   * Garanția e pe ziua ta, nu pe „ziua 3" — vezi `garantie`.
   */
  durata: '1 zi live',
  durataTotal: '3 zile, dacă le iei pe toate trei',
  garantie:
    'Dacă la finalul zilei tale nu ai construit și publicat lucrul tău, îți returnez toți banii. Fără motive.',
} as const;

export const locuriLibere = OFERTA.locuriTotal - OFERTA.locuriLuate;

/** Rândul al doilea din bara flotantă, scris din cifra de mai sus. */
export const notaLocuri =
  `Au mai rămas ${locuriLibere} locuri din ${OFERTA.locuriTotal}. Când se ocupă, se închide.`;

/* ────────────────────────────────────────────────────────────────────────
   FEREASTRA DE BONUS

   Owner, 29.10.2026, verbatim: „Vreau si o oferta cu countdown timer de 10
   minute daca se inscrie sa primeasca un Surprice Bonus."

   ⚠️ Regulile care fac cronometrul legal, și de ce, sunt scrise în
   `src/lib/fereastraBonus.ts`. Pe scurt: fereastra se aplică DOAR bonusului,
   nu masterclass-ului și nu prețului, ceasul nu se resetează la reload, iar
   bonusul trebuie chiar dat. Emailul intern spune, la fiecare înscriere, dacă
   omul a intrat în fereastră.

   ⚠️ Ce ESTE bonusul nu scrie nicăieri, pentru că owner nu l-a stabilit încă.
   „Surpriză" e o alegere de marketing validă — nu promite nimic anume, deci nu
   e nimic de dovedit — dar trebuie să existe ceva real în spate înainte de
   prima înscriere. Când îl stabilește, nu e obligatoriu să-l scrii aici; e
   obligatoriu să-l livreze.
   ──────────────────────────────────────────────────────────────────────── */
export const BONUS = {
  eticheta: 'Bonus surpriză',
  /** Owner, 30.10.2026: „textul mai scurt si mai la obiect". Trei rânduri, nu
   *  trei paragrafe: ce primești, ce nu-ți spun dinainte, și rândul cinstit.
   *  Minutele nu se mai scriu în titlu — le arată ceasul de lângă. */
  titlu: 'Lași datele până la zero, primești un bonus.',
  text: 'Nu anunț dinainte ce e. Îl afli la apel, înainte să decizi ceva.',
  /** Rândul care ține cronometrul cinstit. Nu-l scoate. */
  onest: 'Masterclass-ul nu expiră și prețul nu se schimbă. Doar bonusul ține de fereastra asta.',
  expirat: 'Fereastra de bonus s-a închis.',
  expiratText: 'Locul și prețul rămân neschimbate. Datele tot le poți lăsa.',
} as const;

/**
 * Cele trei masterclass-uri. Owner, 29.10.2026, verbatim:
 *   1. „Investi sa dezvolti Website-uri, Aplicatii si Softwuri custom — care
 *       ulterior le poti vinde cu X si poti face un business din asta."
 *   2. „Investi sa faci marketing cu Agenti adica iti dezvolti singur agentia
 *       de marketing."
 *   3. „Investi sa dezvolti automatizari si sa eficientizezi afaceri."
 *
 * ⚠️ Direcția CREATIVUL (video cu AI pentru branduri) a fost SCOASĂ odată cu
 * schimbarea asta, la cererea owner-ului. Dacă o vrei înapoi, textul ei e în
 * istoricul git, la commitul de dinainte de 29.10.2026 — și atunci are nevoie
 * și de un preț pentru pachetul de patru, care acum nu există.
 *
 * ⚠️ Niciun rând de aici nu promite un venit. „Poți face un business din
 * asta" e model de afaceri, nu cifră; cifrele stau în PIATA, cu sursă, și
 * sunt prețuri de piață, nu câștigurile cuiva.
 */
export const DIRECTII = [
  {
    id: 'software',
    numar: '01',
    nume: 'SOFTWARE',
    icon: 'blocuri',
    promisiune: 'Construiești site-uri, aplicații și software la comandă.',
    text: 'Construiești o dată și vinzi de zece ori: același flux de lucru livrează și site-ul de prezentare, și aplicația cu plăți în ea. Cele 11 aplicații de mai sus sunt direcția asta.',
    pleciCu: [
      'Primul lucru construit și publicat, la domeniul lui',
      'Oferta scrisă și prețurile tale',
      'Primii 10 clienți identificați pe nume',
    ],
  },
  {
    id: 'agenti',
    numar: '02',
    nume: 'AGENȚI',
    icon: 'portavoce',
    promisiune: 'Îți faci agenția de marketing cu agenți AI.',
    text: 'Nu angajezi oameni ca să livrezi — construiești agenții care fac munca și vinzi rezultatul. E singura dintre cele trei care se vinde ca abonament lunar, nu ca proiect.',
    pleciCu: [
      'Primul agent care livrează singur, nu un prompt',
      'Pachetul lunar pe care îl vinzi, scris',
      'Primii 10 clienți identificați pe nume',
    ],
  },
  {
    id: 'automatizari',
    numar: '03',
    nume: 'AUTOMATIZĂRI',
    icon: 'unelte',
    promisiune: 'Automatizezi și eficientizezi afaceri.',
    text: 'Firmele plătesc ca să nu mai facă ceva cu mâna. Tu le dai fluxul care o face singur, și rămâi cu el: se construiește o dată și se întreține lunar.',
    pleciCu: [
      'O automatizare care rulează, nu un demo',
      'Harta proceselor pe care le vinzi mai departe',
      'Primii 10 clienți identificați pe nume',
    ],
  },
] as const;

/**
 * Ce pleci cu — baza garanției. Fiecare rând e verificabil în ziua 3.
 * `icon` e o cheie din harta ICOANE din Mentorat.tsx. Iconițe diferite, nu
 * aceeași bifă de cinci ori: lista se citește mai repede dacă fiecare rând
 * are un semn propriu.
 */
export const PLECI_CU = [
  { icon: 'rachetă',   titlu: 'Lucrul tău, construit și publicat', text: 'Nu un demo, nu un plan. Ceva care funcționează și are adresă.' },
  { icon: 'etichetă',  titlu: 'Oferta scrisă și prețul',           text: 'Ce vinzi, cu ce cuvinte, și cât ceri. Pe hârtie, nu în cap.' },
  { icon: 'oameni',    titlu: 'Primii 10 clienți, pe nume',        text: 'Nu „publicul țintă". Zece oameni sau firme, cu nume și contact.' },
  { icon: 'unelte',    titlu: 'Tot ce folosesc eu',                text: 'Prompturile, șabloanele și fluxurile mele de lucru, așa cum sunt.' },
  { icon: 'infinit',   titlu: 'Comunitatea ATELIER AI, pe viață',  text: 'Acces lifetime pe Discord. Fără abonament, fără reînnoire, plătit o singură dată.' },
  // Al șaselea, cerut de owner pe 29.10.2026 („Aici vreau 6 chestii nu 5").
  // Nu e inventat ca să umple grila: e exact ce scrie deja în hero — „în ziua
  // 2 mă uit pe ecranul fiecăruia și repar pe loc" — și e singurul rând din
  // listă pe care zece locuri îl fac posibil, deci justifică și numărul mic.
  { icon: 'ochi',      titlu: 'Ochii mei pe ecranul tău',          text: 'La mijlocul zilei mă uit pe lucrul fiecăruia și repar pe loc. De asta sunt zece locuri, nu o sută.' },
] as const;

/**
 * Cele patru meserii din spatele lui. Cerute de owner pe 29.10.2026, verbatim:
 * „Pune la mine peste 16 ani de experienta in Branding Strategic, Marketing si
 * Distributie, Vanzari si Persuasiune si dezvoltare Tehnologie."
 *
 * Stau ca bandă sub hero, nu înghesuite în rândul de sub nume: patru domenii
 * scrise unul după altul într-un rând de 11px devin o frază pe care n-o
 * citește nimeni. Separate, fiecare cu semnul lui, se citesc dintr-o privire.
 */
export const EXPERTIZA = {
  ani: 'Peste 16 ani de experiență în',
  /** Rândul de sub nume, în hero. Cerut de owner pe 29.10.2026: „Aici sub eu
   *  vreau alta descriere … Ceva scurt legat de expertiza mea." Înainte scria
   *  „11 aplicații live · peste 16 ani de experiență" — o fișă de produs, nu o
   *  descriere a omului; aplicațiile își au oricum locul în lista de dovezi.
   *  Trei cuvinte, nu patru și fără ani: la 11px, orice peste atât trece pe al
   *  treilea rând sub nume și nu mai e o semnătură, e un paragraf. Anii și
   *  lista exactă, cu toate patru domeniile, sunt în banda de dedesubt. */
  semnatura: 'Branding, marketing și tehnologie',
  /** Owner, 30.10.2026, despre banda asta: „sa fie mai bine aranjat". Rândul
   *  al doilea e ce face diferența: patru nume singure sunt patru etichete,
   *  patru nume cu câte trei lucruri sub ele sunt un CV. Nu e nicio promisiune
   *  nouă aici — enumeră ce conține fiecare meserie, nu ce obții din ea.
   *  Toate cele patru `ce` au între 23 și 29 de caractere, ca să stea pe un rând. */
  domenii: [
    { icon: 'busolă',    nume: 'Branding Strategic',       ce: 'Identitate, poziționare, nume' },
    { icon: 'portavoce', nume: 'Marketing și Distribuție', ce: 'Canale, campanii, audiență' },
    { icon: 'țintă',     nume: 'Vânzări și Persuasiune',   ce: 'Ofertă, preț, închidere' },
    { icon: 'cod',       nume: 'Dezvoltare Tehnologie',    ce: 'Aplicații, automatizări, AI' },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────
   PENTRU CINE E

   Perechea pozitivă a lui NU_E_PENTRU. Patru profiluri, nu zece: trei
   corespund celor trei masterclass-uri, al patrulea prinde pe oricine conduce
   ceva. Dacă adaugi al cincilea, întreabă-te pe cine excluzi — o listă
   care include pe toată lumea nu mai spune nimic.
   ──────────────────────────────────────────────────────────────────────── */
export const PENTRU_CINE = [
  {
    icon: 'cutie',
    titlu: 'Ai un produs în cap și n-ai apucat să-l faci',
    text: 'La finalul zilei e publicat, la domeniul lui, cu plata funcțională în el. Nu un prototip.',
  },
  {
    icon: 'servietă',
    titlu: 'Ai firmă de servicii și livrezi tot manual',
    text: 'Site-uri, campanii, conținut, oferte. Pleci cu fluxul care le face de câteva ori mai repede, cu aceiași oameni.',
  },
  {
    icon: 'portavoce',
    titlu: 'Vinzi marketing și nu mai poți crește fără să angajezi',
    text: 'Agenții care livrează în locul oamenilor pe care nu-i ai. Același pachet lunar, cu o fracțiune din efort.',
  },
  {
    icon: 'echipă',
    titlu: 'Conduci o echipă rămasă în urmă cu AI',
    text: 'Pleci cu prompturile și fluxurile pe care le dai mai departe luni dimineață, nu cu o listă de tool-uri.',
  },
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
      sau ceva care sugerează că brandurile astea susțin masterclass-ul. Ele nu
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

  /**
   * Canalele, afișate ca panou pe pagină. Fiecare corespunde unui rând din
   * `lucruri` de mai jos — nu promit nimic în plus față de ce scrie acolo.
   * Dacă schimbi unul, schimbă și perechea lui.
   */
  canale: [
    'noutati-ai',
    'suport-dezvoltare',
    'software',
    'agenti-ai',
    'automatizari',
    'sesiuni-live',
    'sabloane-noi',
  ],

  lucruri: [
    {
      icon: 'ziar',
      titlu: 'Noutățile din lumea AI',
      text: 'Ce a apărut și ce înseamnă pentru ce construiești tu. Filtrat, nu copiat de pe Twitter.',
    },
    {
      icon: 'colac',
      titlu: 'Suport la dezvoltare',
      text: 'Te blochezi, întrebi, primești răspuns. De la mine și de la cine a trecut prin asta.',
    },
    {
      icon: 'diez',
      titlu: 'Canalul masterclass-ului tău',
      text: 'Software, agenți sau automatizări. Separat, ca să nu cauți prin mesaje care nu te privesc.',
    },
    {
      icon: 'video',
      titlu: 'Sesiune la două săptămâni',
      text: 'Live, pe ecran, cu problemele reale ale seriei. Nu webinar, nu prezentare.',
    },
    {
      icon: 'oameni',
      titlu: 'Oamenii din seria ta',
      text: 'Nouă oameni care au început în aceeași zi cu tine. Asta cântărește cel mai mult.',
    },
    {
      icon: 'straturi',
      titlu: 'Tot ce apare după',
      text: 'Șabloanele și prompturile noi intră acolo pe măsură ce le fac. Fără să plătești iar.',
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────
   PROBLEMA — diagnosticul de la începutul paginii.

   Textele stăteau în JSX până pe 30.10.2026. Au venit aici fiindcă fișierul
   ăsta e locul unde owner-ul le caută, iar cele trei trebuie ținute la aceeași
   lungime ca să nu iasă trei cartonașe inegale: toate au 99 sau 100 de
   caractere. Dacă rescrii unul, remăsoară.
   ──────────────────────────────────────────────────────────────────────── */
export const PROBLEMA = [
  {
    icon: 'cod',
    titlu: 'Ai testat',
    text: 'Ai deschis ChatGPT, ai cerut ceva, ai primit ceva aproape bun. A rămas un tab deschis, nu un proces.',
  },
  {
    icon: 'echipă',
    titlu: 'Ai delegat',
    text: 'Ai pus pe cineva din echipă să se uite peste AI. S-a întors cu entuziasm și cu niciun flux schimbat.',
  },
  {
    icon: 'ceas',
    titlu: 'Și cifrele sunt aceleași',
    text: 'Aceleași costuri, aceleași termene, aceiași oameni pe aceleași task-uri. Nimic de pus pe masă acum.',
  },
] as const;

/* ────────────────────────────────────────────────────────────────────────
   MOTORUL — cele trei piese ale mecanismului.

   Aduse din JSX pe 30.10.2026, la cererea owner-ului ca textele să aibă
   „numarul de caractere la fel": toate trei au 111–112 caractere, deci cele
   trei coloane se termină pe același rând. Ține măsura dacă le rescrii.
   ──────────────────────────────────────────────────────────────────────── */
export const MOTOR = [
  {
    numar: '1',
    titlu: 'Traduci cererea',
    text: 'Cum transformi o cerere vagă în caiet de sarcini pe care AI-ul îl execută corect din prima, nu din a douăzecea.',
  },
  {
    numar: '2',
    titlu: 'Construiești de livrat',
    text: 'Diferența dintre un demo care impresionează și un lucru pentru care cineva plătește. Aici se pierde toată lumea.',
  },
  {
    numar: '3',
    titlu: 'Publici și ceri bani',
    text: 'Cum pui lucrul în fața oamenilor, cum se formează prețul și cum îl ceri fără să te scuzi, pentru că face treaba.',
  },
] as const;

/* ────────────────────────────────────────────────────────────────────────
   DISTRIBUȚIA ȘI VÂNZAREA — partea a treia a motorului, desfăcută.

   Cerută de owner pe 30.10.2026, verbatim: „sa inteleaga clientul ca il
   sistemul prezentat in masterclass include si partea de distributie si
   vanzare care este cea mai grea chestie de facut adica sa stie ce sa faca ca
   sa isi vanda mai departe produsul sau serviciile ca sa faca baniu."

   ⚠️ Linia roșie, aceeași ca în tot fișierul: secțiunea asta promite CE PLECI
   CU la capitolul vânzare — oferta scrisă, lista de nume, mesajul, prețul,
   planul de 30 de zile — și NU promite că vinzi, că faci bani sau cât. Un
   venit promis în scris e afirmație comercială reglementată (Legea 363/2007),
   iar aici tentația e cea mai mare, fiindcă exact asta vrea omul să audă.
   Rândul `onest` de la final e cel care ține secțiunea cinstită; nu-l scoate.

   Fiecare pas e deja promis altundeva pe pagină (PLECI_CU și ZILE partea 3) —
   aici sunt doar așezate în ordinea în care se întâmplă.
   ──────────────────────────────────────────────────────────────────────── */
export const DISTRIBUTIE = {
  eticheta: 'Distribuție și vânzare',
  titlu: 'Partea grea nu e să construiești.',
  intro:
    'Să construiești ceva poate oricine, acum. Greul e să știi cui îl vinzi, cu ce cuvinte și la ce preț — ' +
    'și ăsta e motivul pentru care majoritatea rămân cu un lucru bun pe care nu îl cumpără nimeni. ' +
    'A treia parte a zilei e despre exact asta, și e jumătate din motor, nu un bonus de la final.',
  pasi: [
    { icon: 'etichetă',  titlu: 'Oferta',                 text: 'Ce vinzi, în cuvintele clientului, nu în ale tale. Scrisă, nu ținută în cap.' },
    { icon: 'oameni',    titlu: 'Lista',                  text: 'Zece nume reale: firme sau oameni care au deja problema pe care o rezolvi.' },
    { icon: 'portavoce', titlu: 'Mesajul',                text: 'Primul mesaj de contact, scris în sală. Îl trimiți înainte să pleci acasă.' },
    { icon: 'țintă',     titlu: 'Prețul',                 text: 'Cum se formează cifra și cum o ceri fără să te scuzi că ai cerut-o.' },
    { icon: 'busolă',    titlu: 'Următoarele 30 de zile', text: 'Ce faci luni, ce urmărești săptămâna a doua, când schimbi mesajul.' },
  ],
  /** Rândul care ține secțiunea pe partea bună a legii. Nu-l scoate. */
  onest:
    'Nu îți garantez că vinzi — asta depinde de ce construiești și de câte mesaje trimiți. ' +
    'Îți dau exact ce ai de trimis, cui, și la ce preț.',
} as const;

/**
 * Arcul UNEI zile de masterclass. Nu mai sunt „zilele 1-2-3" ale unui program
 * de trei zile: de pe 29.10.2026 fiecare masterclass ține o zi, iar ziua are
 * aceleași trei părți indiferent pe care dintre cele trei o iei.
 */
export const ZILE = [
  {
    eticheta: 'PARTEA 1',
    nume: 'MOTORUL',
    text: 'Partea care nu se schimbă, oricâte tool-uri apar: cum transformi o cerere vagă în caiet de sarcini pe care AI-ul îl execută corect din prima. Și pornim primul lucru împreună, live.',
  },
  {
    eticheta: 'PARTEA 2',
    nume: 'CONSTRUIEȘTI',
    text: 'Nu te uiți la mine cum construiesc — construiești tu, iar eu mă uit pe ecranul tău și repar. Pentru partea asta locurile sunt 10, nu 100.',
  },
  {
    eticheta: 'PARTEA 3',
    nume: 'VINZI',
    text: 'Cum se formează prețul și cum îl ceri fără să te scuzi. Oferta, primul mesaj, primii 10 clienți. Și exact ce faci în următoarele 30 de zile.',
  },
] as const;

export const NU_E_PENTRU = [
  'Dacă nu conduci încă nimic — nici firmă, nici proiect, nici echipă. Pornim de la ceva ce ai deja.',
  'Dacă vrei bani fără să construiești nimic. Aici se muncește, ziua întreagă, pe ecranul tău.',
  'Dacă ai de gând să te uiți la înregistrări „când am timp". E live dintr-un motiv.',
  'Dacă aștepți să îți garantez un venit. Nu garantez, și nu crede pe nimeni care o face.',
] as const;

export const INTREBARI = [
  {
    q: 'Pot să iau doar unul dintre cele trei?',
    a: 'Da, și e varianta normală: fiecare e un masterclass întreg, de o zi, cu lucrul tău publicat la final. Dacă le vrei pe două sau pe toate trei, prețul scade — cifrele exacte le primești la apel.',
  },
  {
    q: 'Trebuie să știu să programez?',
    a: 'Nu. Niciuna din cele 11 aplicații de mai sus nu a fost scrisă linie cu linie. Dar nu e nici magie: în partea a doua a zilei construiești tu, nu te uiți.',
  },
  {
    q: 'Cât o să câștig?',
    a: 'Nu îți promit niciun venit, și nu crede pe nimeni care îți promite unul în scris. Îți promit ce pleci cu: lucrul construit și publicat, oferta, prețul, primii 10 clienți. Cât ceri și cât închizi depinde de tine și de piața ta.',
  },
  {
    q: 'De ce doar 10 locuri?',
    a: 'Din cauza părții a doua: ca să mă uit pe ecranul fiecăruia, nu pot fi 50. La 50 devine un curs, iar cursuri despre AI există cu sutele și nu produc nimic.',
  },
  {
    q: 'Cum aleg între cele trei?',
    a: 'După ce ai deja. Ai un produs în cap sau clienți care îți cer site-uri — software. Vinzi marketing și nu mai poți crește fără să angajezi — agenți. Vezi zilnic muncă făcută cu mâna într-o firmă — automatizări. Dacă nu ești sigur, la apel o alegem împreună.',
  },
  {
    q: 'Ce se întâmplă dacă nu pot fi live?',
    a: 'Ziua e înregistrată și o ai. Dar dacă știi dinainte că nu poți fi live, mai bine aștepți seria următoare — valoarea e în timpul pe care ți-l dau pe ecranul tău, nu în fișierul video.',
  },
  {
    q: 'Cu ce tool-uri lucrăm?',
    a: 'Cu cele mai bune din ziua masterclass-ului, pe ecranul meu. Nu construim lecția în jurul unui tool — tool-ul se schimbă în trei luni. Metoda nu.',
  },
  {
    q: 'Cât costă?',
    a: 'Îl primești la apel, odată cu datele exacte și cu masterclass-ul potrivit pentru tine. Ce pot spune de pe acum: unul singur are un preț, două au altul mai mic pe bucată, toate trei cel mai mic. Se plătește integral sau în două tranșe, primești factură, și nu ți se cere nimic până nu vorbim.',
  },
  {
    q: 'De ce nu scrieți prețul pe pagină?',
    a: 'Pentru că nu vând un loc oricui plătește. La apel vedem întâi dacă ai ce construi într-o zi. O cifră fără discuția asta nu îți spune nimic util.',
  },
  {
    q: 'Primesc factură?',
    a: 'Da, pe firmă sau pe persoană fizică, cum ai nevoie. Plata se face integral sau în două tranșe.',
  },
] as const;

/** Opțiunile din formularul de aplicare. Trebuie să coincidă cu cele din api/aplica-mentorat.js. */
export const OPTIUNI_DIRECTIE = [
  { value: 'software',     label: 'Software — site-uri, aplicații, software la comandă' },
  { value: 'agenti',       label: 'Agenți — agenția mea de marketing cu AI' },
  { value: 'automatizari', label: 'Automatizări — eficientizez afaceri' },
  { value: 'doua',         label: 'Oricare două dintre ele' },
  { value: 'toate',        label: 'Toate trei' },
  { value: 'nu-stiu',      label: 'Nu știu încă — ajută-mă să aleg' },
] as const;

export const OPTIUNI_STADIU = [
  { value: 'proiect',  label: 'Construiesc acum afacerea, încă fără venit constant' },
  { value: 'firma',    label: 'Am firmă și clienți, dar AI-ul nu e în fluxul de lucru' },
  { value: 'punctual', label: 'Folosesc AI punctual, fără sistem și fără rezultate măsurabile' },
  { value: 'echipa',   label: 'Am echipă și vreau să o pun să lucreze cu AI' },
] as const;

/**
 * Antetul formularului de înscriere.
 *
 * Owner, 31.10.2026: „Acest titlu trebuia sa fie pe formularul de inscriere pe
 * pagina masterclass-ului." Titlul e al lui, cuvânt cu cuvânt, inclusiv cifra
 * de venit — i-am contestat-o de două ori, a decis „Lasa cum iti spun eu".
 * Nu-l rescrie fără el. Contextul complet e în memoria proiectului, la
 * vandy-lead-magnet.
 *
 * ⚠️ `text` descrie ce se întâmplă DUPĂ trimitere, iar acum omul ajunge
 * direct pe /prezentare, la video. Dacă schimbi redirectul din Formular.tsx,
 * schimbă și rândul ăsta — altfel pagina promite un lucru și face altul.
 */
export const FORMULAR = {
  pas: 'Pasul 1 din 2',
  titlu: 'Învață cum poți face 200–300 $ pe zi creând și vânzând site-uri simple.',
  subtitlu: 'Pentru clienți care ar plăti chiar și mai mult pentru asta.',
  text: 'Durează 30 de secunde. Imediat ce trimiți, intri pe pagina unde îți arăt pas cu pas tot conceptul, pe video. Nu plătești nimic ca să intri.',
} as const;

/**
 * Bugetul. Owner, 29.10.2026: „Vreau sa fie pretul in formular gen cat ar plati
 * pentru asta" + „Si sa fie 3 optiuni".
 *
 * Întrebarea califică, nu stabilește prețul — iar pagina SPUNE asta sub câmp.
 * Fără precizarea aia, „cât ai plăti" sugerează că plătești cât spui tu, și
 * am minți: prețul e fix. Pragurile sunt alese ca prețul real să intre în
 * prima treaptă, deci nimeni nu se autoelimină răspunzând cinstit.
 */
export const OPTIUNI_BUGET = [
  { value: 'pana-1000',   label: 'Până în 1.000 €' },
  { value: '1000-3000',   label: 'Între 1.000 și 3.000 €' },
  { value: 'peste-3000',  label: 'Peste 3.000 €' },
] as const;

/* ────────────────────────────────────────────────────────────────────────
   SOLOPRENOR ÎN ERA AI

   Owner, 29.10.2026, verbatim: „Toate ca Solprenor in era AI, poti lucra de
   oriunde, la orice ora, sa ai libertate toata de miscare si financiara si
   analogia ca poti lucra din vacante de pe plaje de oriunde doar cu un laptop
   si internet (si vreau si o sectiune cu IMAGINI care sa reflecte toata
   viziunea asta)."

   ⚠️ „Libertate financiară" NU se scrie pe pagină ca promisiune. Ce se scrie
   e de ce e posibilă libertatea de MIȘCARE: niciuna din cele trei meserii nu
   cere birou, marfă sau angajați. Asta e o proprietate a modelului de
   business, verificabilă. „Vei fi liber financiar" ar fi afirmație comercială
   reglementată (Legea 363/2007), exact ca o cifră de venit.

   ⚠️ IMAGINILE sunt fotografii reale de pe Unsplash (licență Unsplash, uz
   comercial permis, fără atribuire obligatorie), descărcate local pe
   29.10.2026 ca pagina să nu depindă de un CDN străin. NU sunt generate cu AI
   — linia roșie a brandului e „fără AI care te arată pe tine în situații
   reale false".

   Pe 29.10.2026 seara setul a fost schimbat la cererea owner-ului: „vreau …
   pozele mai vizibile si mai frumoase cu oameni veseli etc ceva super
   expresiv." Primul set n-avea pe nimeni în cadru și era întunecat cu filtru.
   Acum sunt patru oameni, patru locuri, lumină naturală, fără desaturare.

   Ce am evitat deliberat, și de ce: pozele de tip „pumnul în aer pe plajă" și
   „teancul de bani lângă laptop". Sunt semnătura vizuală a conținutului de
   îmbogățire rapidă, adică exact registrul pe care pagina asta îl refuză, și
   pun omul din fotografie în poziția de POSESOR față de privitor — cea care
   atrage ostilitate. Oamenii de aici lucrează sau stau relaxați după ce au
   lucrat. Nimeni nu arată ce are.

   TEXTELE celor patru cadre au exact aceeași lungime (76 de caractere), tot
   la cererea lui. Dacă schimbi unul, numără-le pe toate patru: inegale, fac
   cartonașele să aibă trei rânduri lângă patru și se vede imediat.
   ──────────────────────────────────────────────────────────────────────── */

import IMG_LAPTOP from '../assets/viziune/laptop.jpg';
import IMG_ORIUNDE from '../assets/viziune/oriunde.jpg';
import IMG_ORA from '../assets/viziune/ora.jpg';
import IMG_SINGUR from '../assets/viziune/singur.jpg';

export const SOLOPRENOR = {
  eticheta: 'Solopreneur în era AI',
  titlu: 'Un laptop și internet. Atât.',
  text: 'Nici software, nici agenți, nici automatizări nu cer birou, marfă sau angajați. De acolo vine libertatea de mișcare — nu dintr-o promisiune, ci din felul în care e construit lucrul pe care îl vinzi.',
  // Toate cele patru `text` au exact 76 de caractere. Vezi nota de mai sus.
  cadre: [
    {
      imagine: IMG_LAPTOP,
      titlu: 'Un laptop. Atât.',
      text: 'Fără sediu, fără depozit, fără stoc de vândut. Doar ecranul pe care lucrezi.',
    },
    {
      imagine: IMG_ORIUNDE,
      titlu: 'De oriunde.',
      text: 'Clientul cumpără rezultatul, nu adresa de pe factură. Restul e detaliul tău.',
    },
    {
      imagine: IMG_ORA,
      titlu: 'La orice oră.',
      text: 'Lucrezi când ești bun, nu când scrie în contract. Niciun job nu îți dă asta.',
    },
    {
      imagine: IMG_SINGUR,
      titlu: 'Fără echipă.',
      text: 'AI-ul face partea pentru care altfel angajai. Unul singur, cât o firmă mică.',
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────
   PREȚURILE PIEȚEI

   Regula care face secțiunea asta legală ȘI mai convingătoare decât o
   promisiune: afișăm CÂT SE VINDE PE PIAȚĂ, cu sursă, niciodată cât va
   câștiga cititorul. Un preț verificabil e mai greu de respins decât o
   cifră inventată, iar „vei face X pe lună" ar fi afirmație comercială
   reglementată (Legea 363/2007).

   ⚠️ Owner, 29.10.2026: „Scoate sursele" — linkurile nu se mai afișează pe
   pagină. Câmpul `sursa` RĂMÂNE în fișier, ca proveniența fiecărei cifre să
   existe în scris. Dacă te întreabă cineva (client, ANPC) de unde vin
   numerele, răspunsul e aici. Nu șterge câmpul și nu pune cifre fără el.

   ⚠️ Owner, 29.10.2026: „Toate preturile afisate sa fie in euro nu si in lei".
   Toate cifrele de mai jos sunt publicate direct în euro de sursele citate, deci
   nu mai e nevoie de conversie. Dacă adaugi un rând publicat în lei, convertește-l
   și scrie aici cursul folosit și valoarea originală.

   ⚠️ Niciun rând `acopera` nu are voie să compare prețul pieței cu prețul
   masterclass-ului („îți acoperă investiția", „costă de X ori cât"). Prețul nu
   se afișează, iar o comparație de genul ăsta îl reconstituie prin aritmetică.
   S-a întâmplat deja o dată, pe 29.10.2026, și a fost scos.
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
    id: 'software',
    nume: 'SOFTWARE',
    randuri: [
      { ce: 'Site de prezentare', pret: '500 – 2.500 €', detaliu: 'mediana pieței: ~1.000 €' },
      { ce: 'MVP: autentificare + un flux principal', pret: '3.000 – 7.000 €', detaliu: 'livrat în 4 – 8 săptămâni' },
      { ce: 'Magazin online', pret: '4.000 – 10.000 €', detaliu: 'în funcție de produse și integrări' },
    ],
    acopera: 'Aici nu cumperi un site — înveți să îl construiești. Pe primul, și pe al zecelea.',
    sursa: { text: 'webforge.org.ro — cât costă un site web / o aplicație web', href: 'https://webforge.org.ro/blog/cat-costa-un-site-web' },
  },
  {
    id: 'agenti',
    nume: 'AGENȚI',
    randuri: [
      { ce: 'Administrare social media, pachet de bază', pret: '400 – 800 € / lună', detaliu: 'un canal, postare și conținut' },
      { ce: 'Pachet complet: conținut, reclame, strategie', pret: '1.200 – 1.700 € / lună', detaliu: 'oferte publicate de agenții din România' },
      { ce: 'Un singur canal, gestionat profesionist', pret: 'de la 900 € / lună', detaliu: 'de exemplu Instagram' },
    ],
    acopera: 'Singurul dintre cele trei care se vinde ca abonament, nu ca proiect: se semnează o dată și se facturează lunar.',
    sursa: { text: 'grom.ro · kemo.ro · boloboc.com — pachete de marketing publicate, octombrie 2026', href: 'https://www.grom.ro/servicii-si-pachete' },
  },
  {
    id: 'automatizari',
    nume: 'AUTOMATIZĂRI',
    randuri: [
      { ce: 'Un flux simplu (Make / n8n)', pret: '300 – 800 €', detaliu: 'plus 50 – 150 € / lună mentenanță' },
      { ce: 'Automatizare medie, mai multe surse', pret: '1.000 – 1.900 €', detaliu: 'livrată în 1 – 2 săptămâni' },
      { ce: 'Integrare documente / e-Factura cu ERP', pret: '1.500 – 10.000 €', detaliu: 'în funcție de sistemele firmei' },
    ],
    acopera: 'Fluxul rulează după ce pleci de acolo. De asta mentenanța e linie de venit, nu favoare.',
    sursa: { text: 'webforge.org.ro — automatizări AI pentru afaceri · dalvorix.ro — ghid n8n România', href: 'https://webforge.org.ro/blog/automatizari-ai-pentru-afaceri-ghid-complet' },
  },
];

/** Apare sub tabele. Nu o șterge — ea e diferența dintre preț de piață și promisiune de câștig. */
export const PIATA_AVERTISMENT =
  'Cifrele de mai sus sunt prețuri publicate de furnizori din piață în octombrie 2026 — nu veniturile mele și nu o estimare a veniturilor tale. Câți clienți închizi, la ce preț și în cât timp depinde de tine, de piața ta și de cât muncești. Nimeni nu îți poate promite un termen.';

/* ────────────────────────────────────────────────────────────────────────
   CAPTURI — dovada vizuală. Fiecare e un ecran real, luat de pe site-ul
   live al produsului pe 28.10.2026, nu un mockup și nu o imagine de stoc.

   ⚠️ ELYA, 29.10.2026: owner a cerut explicit „design-ul paginii aplicației",
   deci captura e acum `clientes.elya.app` — pagina proprie a aplicației.
   E ecran de autentificare, pentru că tot ce e dincolo de el cere cont, iar
   eu nu intru în contul lui. E cea mai slabă dovadă din cele unsprezece:
   arată design-ul aplicației, dar nu arată ce face. Dacă trimite o captură
   din interfața logată, înlocuiește fișierul și cardul devine dovadă reală.
   (Site-ul de marketing elya.app are o secțiune întunecată, „Your intelligent
   commercial team", care arată capabilitățile — a fost varianta anterioară,
   dacă vrei să te întorci la ea.)
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
// Fișierul se numește `dynasty` pentru că ăsta e id-ul produsului în PROJECTS —
// a fost redenumit TRINY TRADES, dar id-ul ține contorul de aprecieri.
import CAP_TRINY from '../assets/capturi/dynasty.jpg';

/**
 * Captura fiecărui produs, pe id-ul lui din PROJECTS.
 * Cardurile de pe /mentorat sunt aceleași componente ca pe prima pagină,
 * doar că primesc captura ca fundal.
 */
export const CAPTURI: Record<string, string> = {
  dynasty: CAP_TRINY,
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
 *
 * `dynasty` (TRINY TRADES) a intrat pe 29.10.2026, la cererea owner-ului.
 * Era scos ca „comunitate de trading, nu aplicație", dar produsul e acum o
 * aplicație propriu-zisă la app.triny.trade, deci titlul rămâne exact.
 * ⚠️ Lipsește în continuare `consult` — ăla e serviciu, nu aplicație.
 * Dacă mai adaugi unul, schimbă și numărul din titlul secțiunii, din rândul
 * de sub avatar și din INCREDERE. Pagina nu îl numără singură.
 */
export const PRODUSE_DOVADA = [
  'nowwwa', 'neotrader', 'dynasty', 'izzy', 'pwas', 'elya',
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
   ȘABLONUL DE RECENZII — nouă sloturi, ca să vezi macheta

   Owner, 30.10.2026: „Pune 9 carduri de review cu nume si firma."

   ⛔ Nu am scris nouă recenzii. Nu există niciun client real în fișierul
   ăsta, deci ar fi însemnat nouă oameni inventați cu nouă firme inventate,
   pe o pagină care vinde un produs de 990 €. Aia nu e copywriting, e
   fabricare de dovezi — și e exact lucrul pe care publicul românesc îl
   caută: 60,1% presupun deja că e ceva necurat la mijloc
   ([[vandy-reactia-ro-la-bogatie]]). O recenzie prinsă ca falsă nu strică
   doar secțiunea, strică toate celelalte nouă carduri de încredere.

   Ce e mai jos e MACHETA, nu conținut: nume „Nume Prenume", firmă
   „Firma SRL". Se vede DOAR pe localhost (`import.meta.env.DEV`), ca să
   poți judeca designul. Într-un build de producție nu se randează niciodată,
   oricât ai uita-o aici.

   Ca să intre recenziile adevărate: completează `RECENZII` de mai sus cu
   obiecte reale și secțiunea se aprinde singură, cu aceleași carduri.
   Șablonul dispare în momentul în care `RECENZII` nu mai e gol.
   ──────────────────────────────────────────────────────────────────────── */
export const RECENZII_SABLON: Recenzie[] = Array.from({ length: 9 }, (_, i) => ({
  nume: 'Nume Prenume',
  rol: 'fondator, Firma SRL',
  text:
    i % 3 === 0
      ? 'Aici intră ce a spus clientul, în cuvintele lui, nerescrise de tine. Două-trei rânduri sunt de ajuns.'
      : i % 3 === 1
        ? 'Cea mai puternică recenzie spune ce avea înainte, ce are acum, și în cât timp.'
        : 'Scurtă și concretă bate lungă și entuziastă. O cifră verificabilă valorează cât un paragraf.',
  lucrare: 'ce i-ai construit',
  href: undefined,
}));

/** Macheta se vede doar în dezvoltare. Vezi comentariul de mai sus. */
export const RECENZII_DE_AFISAT: Recenzie[] =
  RECENZII.length > 0 ? RECENZII : import.meta.env.DEV ? RECENZII_SABLON : [];

/* ────────────────────────────────────────────────────────────────────────
   ÎNCREDERE — numai lucruri verificabile sau pe care le controlezi tu.
   ──────────────────────────────────────────────────────────────────────── */

/** Completeaz-o și apare în subsol. În România, datele firmei pe pagină cântăresc mult. */
export const FIRMA: { denumire: string; cui: string; sediu: string } | null = null;

/**
 * Owner, 30.10.2026: „sa fie 9 categorii". Nouă, nu șapte, din două motive:
 * cele șapte lăsau doi orfani pe ultimul rând al grilei de trei, iar cele două
 * adăugate erau oricum promisiuni pe care pagina le făcea deja altundeva, fără
 * să le numere la încredere — accesul care nu se reînnoiește și înregistrarea
 * care rămâne la om (vezi COMUNITATE.acces și răspunsul din FAQ).
 *
 * ⚠️ Regula fișierului rămâne: numai lucruri verificabile sau pe care le
 * controlezi tu. Nu adăuga aici „garantăm rezultate", „mii de cursanți" sau
 * orice cifră pe care nu o poți arăta. Un rând inventat aici strică toate
 * celelalte opt.
 *
 * Toate cele nouă `text` au între 85 și 90 de caractere, ca celulele grilei să
 * aibă aceeași înălțime. Dacă rescrii unul, ține-te de măsură.
 */
export const INCREDERE = [
  { icon: 'telefon',  titlu: 'Nu plătești până nu vorbim',      text: 'Îți lași datele, te sună echipa, și abia după ce îți confirmăm locul se discută plata.' },
  { icon: 'înapoi',   titlu: 'Returnare integrală',             text: 'Dacă la finalul zilei tale nu ai construit și publicat lucrul tău, primești banii înapoi.' },
  { icon: 'chitanță', titlu: 'Factură fiscală',                 text: 'Pe firmă sau pe persoană fizică, integral sau în două tranșe. Alegi la apel, nu acum.' },
  { icon: 'mesaj',    titlu: 'Răspund eu, nu un chatbot',       text: 'Pe Instagram și pe Telegram, de pe aceleași conturi de pe care postez. Scrii, răspund eu.' },
  { icon: 'glob',     titlu: '11 aplicații cu adresă publică',  text: 'Nu capturi de ecran: adrese pe care le poți deschide acum, din pagina asta, și verifica.' },
  { icon: 'premiu',   titlu: 'Branduri mari, lucrări reale',    text: 'UNTOLD, NEVERSEA, Volkswagen, Audi, Banca Transilvania. Nu portofoliu — clienți plătitori.' },
  { icon: 'ceas',     titlu: 'Peste 16 ani de experiență',      text: 'Nu am început cu AI. Era meseria mea cu mult înainte să existe; AI-ul e unealta din urmă.' },
  { icon: 'infinit',  titlu: 'Plătești o dată, nu lunar',       text: 'Accesul la comunitate nu expiră și nu se reînnoiește. Niciun abonament după masterclass.' },
  { icon: 'video',    titlu: 'Înregistrarea rămâne la tine',    text: 'E live, dar ziua ta se înregistrează și rămâne la tine. Nu pierzi un pas dacă-l revezi.' },
] as const;
