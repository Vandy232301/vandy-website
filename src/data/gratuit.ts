/**
 * /gratuit — pagina de captare pentru traficul din RECLAME.
 *
 * ⚠️ NU e pagina `/ghid` care a fost greșită pe 31.10.2026. Aceea a fost
 * greșită fiindcă înlocuia titlul de pe formularul din `/mentorat`. Asta e
 * cerută explicit de owner pe 2026-11-02 pentru trafic RECE din reclame, iar
 * `/mentorat` rămâne pagina pentru cine caută masterclass-ul direct.
 *
 * ┌─ Împărțirea pe suprafețe, și de ce există ─────────────────────────────┐
 * │ Cifra de venit stă AICI, pe pagină, și NU în creativul de reclamă.      │
 * │                                                                        │
 * │ Nu e o preferință de stil, e singura variantă în care reclamele rulează.│
 * │ Verificat pe text primar, 2026-11-02:                                  │
 * │  · Google („Unreliable claims") interzice „unrealistic promises of      │
 * │    large financial return with minimal risk, effort or investment" și   │
 * │    „get rich quick schemes".                                           │
 * │  · Meta interzice „offers of opportunities of unrealistic financial     │
 * │    reward for unclear or minimal effort".                              │
 * │  · Respingerile repetate pe aceeași temă RESTRICȚIONEAZĂ contul de      │
 * │    reclame — iar fără cont nu există funnel deloc.                     │
 * │                                                                        │
 * │ Așa face și referința pe care a dat-o owner-ul: Iman Gadzhi are cifra   │
 * │ („$373/Day") în titlul paginii `incomechallenge.ai`, iar în creativele  │
 * │ lui de pe Meta (~190 active, citite în Ad Library) NU există nicio      │
 * │ cifră de venit. Copy-ul reclamelor e în `ops/funnel.md` §2.            │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Titlul e al owner-ului, cerut de trei ori și păstrat la cererea lui. I-am
 * contestat cifra de venit de două ori (Legea 363/2007 art. 6, ANPC); a decis
 * să rămână. Ce am adăugat și ce pagina lui Gadzhi NU are: DISCLAIMER, mai jos,
 * cerut de owner pe 2026-11-02 („el n-are, eu ți-l pun" → „2 da").
 * Nu scoate disclaimerul.
 *
 * Pagina e `noindex`: o pagină de aterizare pentru reclame n-are nevoie de
 * SEO, iar cifra n-are ce căuta în indexul Google. Atenție — `noindex` NU o
 * ascunde de verificarea Meta; pagina e văzută la aprobarea reclamei oricum.
 */

import { EVENIMENT, ACOPERA } from './eveniment';

export const ANTET = {
  eticheta: 'Sesiune live · intrare liberă',
  /** Titlul owner-ului, verbatim ca intenție, cu diacritice și tipografie corecte. */
  titlu:
    'Învață 100% gratuit cum poți face 200–300 $ pe zi creând website-uri performante pentru clienți din țară sau chiar din toată lumea.',
  subtitlu: 'O sesiune live, cu mine, în care îți arăt tot procesul pas cu pas.',
  text:
    'Nu e o înregistrare și nu e un webinar cu slide-uri. Intru live, construiesc în fața ta și ' +
    'răspund la întrebări. Durează ' + EVENIMENT.durata + ' și nu plătești nimic ca să intri.',
} as const;

/** Ce se acoperă. Vine din `eveniment.ts` ca să nu existe două liste. */
export const BENEFICII = ACOPERA;

/**
 * Clipul scurt de deasupra formularului. Opțional, și tratat ca opțional:
 * dacă `url` e null, blocul pur și simplu nu se randează — fără placeholder,
 * fără gol în pagină.
 *
 * Spre deosebire de VSL-ul de pe `/prezentare`, fără care nu exista funnel,
 * aici lipsa clipului nu strică nimic. Dar ajută mult: pe trafic rece, 45–90
 * de secunde în care omul vede un lucru real construit de tine mută înscrierea
 * de la „cred un titlu" la „am văzut ceva". Dacă ai zece minute libere, e cel
 * mai ieftin câștig din tot funnelul.
 */
export const TEASER: { url: string | null; durata: string } = {
  url: null,
  durata: '45 – 90 de secunde',
};

/**
 * Formularul. DOUĂ câmpuri, nu șapte.
 *
 * Cele șapte de pe `/mentorat` sunt corecte acolo — trafic cald, care caută
 * programul. Pe trafic rece din reclame, șapte câmpuri taie înscrierile la o
 * fracțiune. Calificarea se mută DUPĂ sesiune, unde omul a stat 90 de minute
 * cu tine și răspunde fără să-l doară.
 */
export const FORMULAR = {
  eticheta: 'Îți ții locul',
  titlu: 'Prinde un loc la sesiune.',
  text: 'Două câmpuri, zece secunde. Îți trimit linkul de intrare pe email.',
  buton: 'Vreau locul meu',
  butonTrimite: 'Se înscrie...',
  acord:
    'Sunt de acord să primesc pe email linkul de intrare și informații despre sesiune. ' +
    'Datele nu ajung la nimeni altcineva și le poți cere șterse oricând.',
  subButon: 'Nu îți cer cardul. Sesiunea e gratuită, fără nicio condiție.',
} as const;

/** Starea de după înscriere, înainte de redirect. Plasă, dacă navigarea e blocată. */
export const CONFIRMARE = {
  titlu: 'Ești pe listă.',
  text: 'Te duc la pagina cu detaliile. Dacă nu se deschide singură în câteva secunde, apasă aici.',
  link: 'Vezi detaliile sesiunii',
} as const;

/** Dovada, scurtă. Omul de pe reclamă nu știe cine ești. */
export const DOVADA = {
  eticheta: 'Cine îți vorbește',
  titlu: 'Peste 16 ani de construit lucruri pentru care au plătit alții.',
  text:
    'Branding strategic, marketing și distribuție, vânzări și dezvoltare de tehnologie. ' +
    'Aplicații live, clienți reali, facturi reale. Nu predau o teorie pe care n-am folosit-o.',
} as const;

/**
 * DISCLAIMERUL. Cerut de owner pe 2026-11-02 și e singurul lucru care ține
 * titlul de mai sus pe partea bună a Legii 363/2007 (practici comerciale
 * neloiale, art. 6 — afirmații care pot induce în eroare; ANPC aplică).
 *
 * „100% gratuit" din titlu e, în schimb, complet curat: lucrul E gratuit, deci
 * Anexa 1 pct. 20 (a descrie drept „gratuit" ceva ce se plătește) nu se aplică.
 * E partea tare a titlului. Nu o diluăm.
 *
 * ⛔ Nu scoate și nu muta mai jos de formular. Un disclaimer pe care nu-l vede
 * nimeni nu e un disclaimer.
 */
export const DISCLAIMER =
  'Cifrele din titlu sunt un obiectiv, nu un venit promis sau garantat. Sunt ordine de mărime ' +
  'pentru lucrări de acest tip; rezultatul fiecăruia depinde de munca, priceperea, piața și ' +
  'timpul lui, iar unii nu obțin niciun venit. Nu este consultanță financiară sau de investiții.';
