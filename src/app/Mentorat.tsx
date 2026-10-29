import { createElement, useEffect, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Award, Boxes, Briefcase, Check, Clapperboard, Clock,
  Blocks, Code2, Compass, Eye, Film, Globe, Handshake, Hash, Infinity as Infinit, LifeBuoy,
  Megaphone, MessageCircle, Minus, Newspaper, PhoneCall,
  Quote, Receipt, Rocket, ShieldCheck, Tag, Target, Undo2, Users, Video, Wrench, Layers, User,
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Caseta, Secventa, Eticheta, TitluSecvenca, Buton } from './components/mentorat/Bucati';
import { CardProdus } from './components/mentorat/CardProdus';
import { Intrebare } from './components/mentorat/Intrebare';
import { PROJECTS } from '../data/projects';
import { translations } from '../data/translations';
import { useLoves } from './hooks/useLoves';
import { Formular } from './components/mentorat/Formular';
import {
  OFERTA, DIRECTII, PLECI_CU, ZILE, NU_E_PENTRU, INTREBARI, locuriLibere, notaLocuri,
  CAPTURI, PRODUSE_DOVADA, PIATA, PIATA_AVERTISMENT, RECENZII, INCREDERE, FIRMA,
  COMUNITATE, BRANDURI, PENTRU_CINE, EXPERTIZA, SOLOPRENOR, BONUS,
} from '../data/mentorat';
import { BONUS_MINUTE, porneste, secundeRamase, format } from '../lib/fereastraBonus';
// Portretul real, cel de pe cardurile de social media. NU randarea neagră de
// pe prima pagină: aici vinde un om, nu un personaj.
// Decupat pe cap, ca să nu iasă jumătate de sacou într-un cerc de 56px:
//   sips -c 1600 1600 --cropOffset 0 190 \
//     ~/vandy_quotes/surse/personaj/avatar-real-2048.png --out x.png
//   sips -Z 512 x.png --out src/assets/vandy-real.png
// PNG, nu JPEG: la 512px e lossless, fără subeșantionare de culoare.
import AVATAR_IMG from '../assets/vandy-real.png';

/**
 * Cronometrul ferestrei de bonus.
 *
 * Regulile care îl țin cinstit — și motivul legal pentru care contează — sunt
 * în `src/lib/fereastraBonus.ts`. Trei lucruri care se văd în codul de aici:
 *
 * · Ceasul se citește din sesiune la primul render, nu se pornește de la zece
 *   minute și apoi sare: altfel omul care revine pe filă ar vedea o clipă
 *   „10:00" și ar crede că s-a resetat.
 * · Cifrele sunt `aria-hidden`, cu o propoziție citibilă alături. Un cronometru
 *   anunțat din secundă în secundă face cititorul de ecran inutilizabil.
 * · Starea expirată nu are verde și nu are lumină. Rămâne o notă, nu o alarmă.
 */
function Cronometru() {
  // Citit, nu pornit, în initializer: `secundeRamase()` doar se uită în sesiune.
  // Scrierea momentului de start stă în efect, unde îi e locul.
  const [ramas, setRamas] = useState(() => secundeRamase());

  useEffect(() => {
    porneste();
    setRamas(secundeRamase());
    const ceas = setInterval(() => setRamas(secundeRamase()), 1000);
    return () => clearInterval(ceas);
  }, []);

  const activa = ramas > 0;

  return (
    <Caseta className={`p-6 md:p-8 mb-3 ${activa ? 'ring-1 ring-neon/20' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <div className="shrink-0">
          <span className={`flex items-center gap-2 ${activa ? 'text-neon' : 'text-neutral-500'}`}>
            <Clock size={14} strokeWidth={2.2} className="shrink-0" />
            <Eticheta ton={activa ? 'neon' : 'neutral'}>{BONUS.eticheta}</Eticheta>
          </span>
          <p
            aria-hidden
            className={`mt-2 text-5xl md:text-6xl font-bold tracking-tight leading-none tabular-nums ${
              activa ? 'text-neon lumina-text' : 'text-neutral-700'
            }`}
          >
            {format(ramas)}
          </p>
          <span className="sr-only">
            {activa
              ? `Mai ai aproximativ ${Math.ceil(ramas / 60)} minute din fereastra de bonus.`
              : BONUS.expirat}
          </span>
        </div>

        <span
          aria-hidden
          className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/[0.12] to-transparent"
        />

        <div className="space-y-2">
          {activa ? (
            <>
              <p className="text-white text-lg font-semibold leading-snug">
                {BONUS.titlu} {BONUS_MINUTE} minute, primești ceva în plus.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed masura-text">{BONUS.text}</p>
              {/* Rândul care face diferența dintre o ofertă și o minciună. */}
              <p className="text-neutral-500 text-xs leading-relaxed masura-text pt-1">
                {BONUS.onest}
              </p>
            </>
          ) : (
            <>
              <p className="text-white text-lg font-semibold leading-snug">{BONUS.expirat}</p>
              <p className="text-neutral-400 text-sm leading-relaxed masura-text">
                {BONUS.expiratText}
              </p>
            </>
          )}
        </div>
      </div>
    </Caseta>
  );
}

/**
 * CTA-ul care te urmărește după ce treci de hero — pe telefon e singurul
 * mereu la îndemână.
 *
 * Flotant, nu lipit de marginea de jos: distanța și forma vin din clasa
 * `.bara-flotanta` (styles/index.css), care ocolește zona sigură a
 * iPhone-ului. Pagina are `viewport-fit=cover`, deci instalată pe ecranul de
 * start bara ar sta altfel fix peste indicatorul de home.
 */
function BaraFixa() {
  const [vizibila, setVizibila] = useState(false);

  useEffect(() => {
    const laScroll = () => setVizibila(window.scrollY > 700);
    laScroll();
    window.addEventListener('scroll', laScroll, { passive: true });
    return () => window.removeEventListener('scroll', laScroll);
  }, []);

  return (
    <div
      aria-hidden={!vizibila}
      className={`bara-flotanta fixed left-0 right-0 z-40 flex justify-center transition-all duration-300 ${
        vizibila ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className={`w-full max-w-xl flex items-center gap-3 rounded-2xl border border-neutral-700/70 ring-1 ring-neon/15 bg-black/70 backdrop-blur-xl shadow-2xl shadow-black/70 py-2 pl-4 pr-2 sm:py-2.5 sm:pl-5 sm:pr-2.5 ${
          vizibila ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-white text-[13px] sm:text-sm font-bold tracking-tight truncate">
            <span className="text-neon">{OFERTA.tip}</span> · {OFERTA.durata}
          </p>
          <p className="text-neutral-400 text-xs truncate">{notaLocuri}</p>
        </div>
        <Buton
          href="#aplica"
          className="shrink-0"
          padding="px-4 py-2.5 text-[13px] sm:px-5 sm:py-3 sm:text-sm"
        >
          Vreau detalii <ArrowRight size={15} />
        </Buton>
      </div>
    </div>
  );
}

function Locuri() {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${locuriLibere} din ${OFERTA.locuriTotal} locuri libere`}>
      {Array.from({ length: OFERTA.locuriTotal }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < locuriLibere ? 'bg-neon lumina-linie' : 'bg-neutral-800'
          }`}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   CELE DOUĂ ACCENTE, ȘI CÂND SE FOLOSEȘTE FIECARE

   Două culori pe o pagină devin zgomot dacă nu au fiecare o treabă. Aici au:

   🟩 VERDE (`neon`) — BANI și ACȚIUNE. Butoanele, bara flotantă, locurile
      libere, prețurile pieței, garanția, bifele cu ce pleci, accesul pe
      viață, promisiunea din hero. Tot ce înseamnă „asta primești" și
      „apasă aici".

   🟪 MOV (`mov`) — STRUCTURĂ și METODĂ. Numerele celor trei piese ale
      motorului, numerele celor trei masterclass-uri, etichetele părților zilei,
      numerotarea produselor, întrebarea deschisă din FAQ, banda de
      încredere, numele brandurilor la hover. Tot ce descrie cum e făcut
      programul, nu ce câștigi din el.

   Regula practică: dacă elementul cere o acțiune sau numără bani, e verde.
   Dacă explică sau ordonează, e mov. Când ai dubii, lasă-l neutru.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Iconițele, pe nume românești, ca să poată fi schimbate din fișierul de date
 * fără să imporți componente acolo. Fiecare rând dintr-o listă primește
 * semnul lui — o listă cu aceeași bifă de șapte ori se citește ca un bloc,
 * una cu șapte semne diferite se scanează.
 */
const ICOANE = {
  rachetă: Rocket, etichetă: Tag, oameni: Users, unelte: Wrench, infinit: Infinit,
  ziar: Newspaper, colac: LifeBuoy, diez: Hash, video: Video, straturi: Layers,
  telefon: PhoneCall, înapoi: Undo2, chitanță: Receipt, mesaj: MessageCircle,
  glob: Globe, premiu: Award, ceas: Clock,
  servietă: Briefcase, cutie: Boxes, clachetă: Clapperboard, echipă: Users,
  mână: Handshake, blocuri: Blocks, film: Film,
  ochi: Eye, busolă: Compass, portavoce: Megaphone, țintă: Target, cod: Code2,
} as const;

type NumeIcoana = keyof typeof ICOANE;

/** Pagina e doar în română, deci cardurile iau descrierile direct din blocul RO. */
const textRO = translations.RO;

export default function Mentorat() {
  const { loves, lovedIds, love } = useLoves();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon/30 font-sans tracking-tight p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />
      {/* O singură urmă de verde în fundal, sus, ca accentul să pară că vine din
          pagină și nu lipit pe ea. Difuz, altfel ar colora textul din hero. */}
      <div className="fixed -top-56 left-1/2 -translate-x-1/2 w-[760px] h-[440px] z-0 rounded-full bg-neon/[0.05] blur-[140px] pointer-events-none" />
      {/* Al doilea halou, mov, jos-stânga: dă adâncime și face cele două accente
          să pară un sistem, nu un autocolant verde peste o pagină neagră. */}
      <div className="fixed top-[55%] -left-40 w-[640px] h-[640px] z-0 rounded-full bg-mov/[0.06] blur-[150px] pointer-events-none" />
      <div className="granulatie fixed inset-0 z-0 pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-4 spatiu-bara">

        {/* Header */}
        <header className="flex flex-row justify-between items-center py-4">
          {/* Fără link spre „/" și fără săgeată. Owner, 29.10.2026: „Din pagina
              asta de masterclass nu vreau sa duca pe pagina principala deci
              elimina sageata aia." O pagină de vânzare care oferă o ieșire în
              antet își pierde oamenii exact în secunda în care ezită. */}
          <h1 className="text-2xl font-bold text-white tracking-wide">VANDY</h1>
          <Eticheta ton="mov">{OFERTA.tip} · {OFERTA.numeProgram}</Eticheta>
        </header>

        {/* ——— HERO ———
             Singura casetă cu colț de 1.5rem și cu lumină proprie înăuntru.
             Un hero care arată exact ca restul casetelor nu mai e hero. */}
        <Caseta radius="rounded-3xl" className="overflow-hidden">
          <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />

          <div className="relative flex flex-col md:flex-row">
            <div className="flex-1 p-6 md:p-10">

              {/* Identitatea. Portretul a crescut și a primit inelul în care
                  verdele și movul se întâlnesc — singurul loc din pagină. */}
              <div className="flex items-center gap-4 mb-9">
                {/* Pătrat cu colțuri rotunjite, nu cerc. Owner, 29.10.2026:
                    „iconita la avatar as face-o ca la un app patrat cu colturi
                    rotunjite nu rotund." Raza interioară e cu 2px mai mică
                    decât cea exterioară, exact cât grosimea inelului —
                    altfel colțul interior se vede strâmb. */}
                <div className="inel-portret shrink-0 w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-[1.1rem] p-[2px]">
                  <div className="w-full h-full rounded-[1rem] overflow-hidden bg-neutral-950">
                    <ImageWithFallback
                      src={AVATAR_IMG}
                      alt="VANDY"
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-white text-lg font-bold tracking-wide leading-tight">VANDY</p>
                  <p className="mt-1 text-[11px] md:text-xs text-neutral-500 uppercase tracking-widest font-semibold text-balance tabular-nums">
                    {EXPERTIZA.semnatura}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mb-7">
                <span className="px-4 py-1.5 rounded-full bg-neon text-black text-xs font-bold tracking-[0.18em] uppercase lumina-bloc">
                  {OFERTA.tip}
                </span>
                {/* Punctul verde spune „numărul de alături e starea de acum",
                    nu „grăbește-te". Static, nu pulsant: zece locuri chiar sunt
                    libere, dar o animație ar vinde o urgență inexistentă. */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase tabular-nums">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-neon lumina-linie" />
                  Au mai rămas {locuriLibere} locuri
                </span>
              </div>

              <h2 className="text-4xl md:text-[3rem] font-bold leading-[1.06] text-white tracking-tight mb-8 text-balance">
                Nu te învăț să folosești AI.<br />
                <span className="text-neutral-400">
                  Te învăț să construiești cu AI lucruri{' '}
                  <span className="serif-italic text-neon lumina-text text-[1.1em]">
                    pentru care oamenii plătesc
                  </span>
                  .
                </span>
              </h2>

              {/* Poziționarea, ca citat: firul verde din stânga o scoate din
                  curgerea paragrafelor fără să mai ceară o linie despărțitoare. */}
              <div className="relative pl-5 mb-7">
                <span
                  aria-hidden
                  className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-neon via-neon/40 to-transparent"
                />
                <p className="text-white text-lg md:text-xl font-semibold leading-snug masura-intro">
                  {OFERTA.pentruCine}
                </p>
              </div>

              <p className="text-neutral-400 text-base leading-relaxed masura-intro mb-9">
                Trei masterclass-uri, o zi live fiecare, zece antreprenori. Iei unul sau pe toate
                trei. Pleci cu lucrul tău construit și publicat, cu prețul scris pe el și cu primii
                zece clienți pe nume.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Buton href="#aplica">Lasă-ți datele pentru detalii <ArrowRight size={16} /></Buton>
                <Buton href="#zile" variant="contur">Vezi cum arată ziua</Buton>
              </div>
            </div>

            {/* Fișa. Despărțită de argument printr-un fir de lumină, nu printr-un
                chenar gri: pe negru, un gri de 1px arată ca o crăpătură. */}
            <div className="relative w-full md:w-[34%] border-t md:border-t-0 border-white/[0.06] p-6 md:p-8 flex flex-col gap-8 bg-black/20">
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 inset-y-0 hidden md:block w-px bg-gradient-to-b from-transparent via-white/[0.14] to-transparent"
              />

              <div className="space-y-4">
                <Eticheta>Locuri libere</Eticheta>
                <p className="text-6xl md:text-7xl font-bold text-neon tracking-tight leading-none tabular-nums lumina-text">
                  {locuriLibere}<span className="text-neutral-700 text-3xl">/{OFERTA.locuriTotal}</span>
                </p>
                <Locuri />
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Zece, nu o sută. La mijlocul zilei mă uit pe ecranul fiecăruia și repar pe loc.
                </p>
              </div>

              {/* Fișa tehnică, cu linie punctată între cheie și valoare. E
                  detaliul de sumar de carte care face coloana să pară tipărită,
                  nu o listă de perechi lipite în două capete. */}
              <div className="pt-6 border-t border-white/[0.06]">
                <Eticheta ton="mov">Pe scurt</Eticheta>
                <dl className="mt-4 space-y-3">
                  {[
                    ['Masterclass-uri', `${DIRECTII.length}, separat sau împreună`],
                    ['Durata', `${OFERTA.durata} fiecare`],
                    ['Comunitate', 'pe viață'],
                    ['Start', OFERTA.dateText.replace('Pornește în ', '')],
                    ['Limba', 'română'],
                  ].map(([cheie, valoare]) => (
                    <div key={cheie} className="flex items-baseline gap-2">
                      <dt className="shrink-0 text-neutral-500 text-xs">{cheie}</dt>
                      <span
                        aria-hidden
                        className="flex-1 -translate-y-[3px] border-b border-dotted border-white/15"
                      />
                      <dd className="shrink-0 text-white text-sm font-semibold">{valoare}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/[0.06]">
                <span className="flex items-center gap-2 text-neon">
                  <ShieldCheck size={14} strokeWidth={2.2} className="shrink-0" />
                  <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                </span>
                <p className="text-neutral-300 text-sm leading-relaxed">{OFERTA.garantie}</p>
              </div>
            </div>
          </div>

          {/* Banda de experiență. Pe toată lățimea casetei, sub cele două
              coloane: îi dă hero-ului un soclu și scoate cele patru meserii
              din rândul de 11px de sub nume, unde nu le-ar fi citit nimeni. */}
          <div className="relative border-t border-white/[0.06] bg-black/30">
            <div className="px-6 md:px-10 pt-5 pb-4">
              <Eticheta ton="mov">{EXPERTIZA.ani}</Eticheta>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {EXPERTIZA.domenii.map((d, i) => (
                <div
                  key={d.nume}
                  className={`flex items-center gap-3 px-6 md:px-5 py-5 border-white/[0.06] ${
                    i % 2 === 1 ? 'border-l ' : ''
                  }${i >= 2 ? 'border-t md:border-t-0 ' : ''}${i === 2 ? 'md:border-l' : ''}`}
                >
                  {createElement(ICOANE[d.icon as NumeIcoana], {
                    size: 17, className: 'text-mov shrink-0', strokeWidth: 1.9,
                  })}
                  <span className="text-neutral-200 text-[13px] font-semibold leading-tight">
                    {d.nume}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Caseta>

        {/* ——— BRANDURI ———
             Fără casetă: numele stau direct pe negru, centrate. O bandă de
             clienți nu e un card de conținut, e o respirație între hero și
             restul paginii — chenarul o făcea să pară încă o secțiune.
             Rămân TEXT, nu logouri: vezi regula din src/data/mentorat.ts. */}
        <Secventa className="pt-14 md:pt-20">
          <div className="text-center">
            <Eticheta>Branduri pentru care am lucrat</Eticheta>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 md:gap-x-12">
              {BRANDURI.map((b) => (
                <span
                  key={b}
                  className="text-white/90 hover:text-white text-xl md:text-2xl font-bold tracking-[0.1em] uppercase transition-colors"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </Secventa>

        {/* ——— PROBLEMA ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="De ce AI-ul nu ți-a schimbat încă cifrele"
            titlu={<>Problema nu e că nu știi destule. E că nimic din ce ai testat n-a intrat în firmă.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { t: 'Ai testat', d: 'Ai deschis ChatGPT, ai cerut ceva, ai primit ceva aproape bun. A rămas un tab deschis, nu un proces.' },
              { t: 'Ai delegat', d: 'Ai pus pe cineva din echipă „să se uite peste AI". S-a întors cu entuziasm și cu niciun flux de lucru schimbat.' },
              { t: 'Și cifrele sunt aceleași', d: 'Aceleași costuri, aceleași termene, aceiași oameni pe aceleași task-uri. Nimic de pus pe masă la final de trimestru.' },
            ].map((x) => (
              <Caseta key={x.t} className="p-6">
                <p className="text-white text-base font-bold mb-2">{x.t}</p>
                <p className="text-neutral-400 text-sm leading-relaxed">{x.d}</p>
              </Caseta>
            ))}
          </div>
          <Caseta className="p-6 md:p-8 mt-3">
            <p className="text-neutral-300 text-base leading-relaxed masura-text">
              Nu e o problemă de inteligență, e una de format. Aproape tot ce se vinde te învață{' '}
              <span className="text-white font-semibold">tool-uri</span>, iar tool-ul se schimbă în
              trei luni. Lucrul pe care îl livrezi, nu. Masterclass-ul e construit invers față de un
              curs: pornim de la ce se vinde și mergem înapoi spre ce trebuie să știi.
            </p>
          </Caseta>
        </Secventa>

        {/* ——— PENTRU CINE ———
             Perechea pozitivă a lui „Când să nu ne scrii". Stă devreme,
             imediat după problemă: cu cât omul se recunoaște mai repede,
             cu atât citește restul ca despre el. */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Pentru cine e"
            titlu={<>Patru oameni. Dacă ești unul dintre ei, e pentru tine.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PENTRU_CINE.map((x) => (
              <Caseta key={x.titlu} className="p-6 md:p-7 flex items-start gap-4">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-mov/10 border border-mov/25 flex items-center justify-center">
                  {createElement(ICOANE[x.icon as NumeIcoana], { size: 19, className: 'text-mov', strokeWidth: 1.9 })}
                </span>
                <div>
                  <p className="text-white text-base font-bold mb-1.5 leading-snug">{x.titlu}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— DOVADA ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Dovada"
            titlu={<>Unsprezece aplicații construite și publicate. Click pe oricare.</>}
          />
          <div className="flex flex-col gap-3">
            {PRODUSE_DOVADA.map((id, i) => {
              const produs = PROJECTS.find((x) => x.id === id);
              if (!produs) return null;
              return (
                <CardProdus
                  key={produs.id}
                  index={i}
                  project={produs}
                  description={textRO.projects[produs.descKey]}
                  discoverLabel={textRO.projects.discover}
                  loves={loves[produs.id] ?? 0}
                  hasLoved={lovedIds.has(produs.id)}
                  onLove={love}
                  captura={CAPTURI[produs.id]}
                />
              );
            })}
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed mt-4 masura-text">
            Fiecare ecran e luat de pe site-ul live, nu e machetă. Deschide oricare și verifică.
            Toate sunt construite cu metoda din masterclass.
          </p>
        </Secventa>

        {/* ——— MOTORUL ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Motorul"
            titlu={<>Un singur mecanism, trei feluri de a-l vinde.</>}
          />
          <Caseta className="p-6 md:p-8">
            <p className="text-neutral-400 text-sm leading-relaxed masura-text mb-8">
              Cele trei masterclass-uri folosesc același motor, iar motorul are trei piese. Le înveți o
              dată, în ziua 1; de acolo se schimbă doar ce vinzi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { n: '1', t: 'Traduci cererea', d: 'Cum transformi o cerere vagă în caiet de sarcini pe care AI-ul îl execută corect din prima, nu din a douăzecea.' },
                { n: '2', t: 'Construiești de livrat', d: 'Diferența dintre un demo care impresionează și un lucru pentru care cineva plătește. Aici se pierde toată lumea.' },
                { n: '3', t: 'Publici și ceri bani', d: 'Cum pui lucrul în fața oamenilor, cum se formează prețul și cum îl ceri fără să te scuzi.' },
              ].map((p) => (
                <div key={p.n} className="space-y-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-mov/50 text-mov text-lg font-bold tabular-nums lumina-bloc-mov">
                    {p.n}
                  </span>
                  <p className="text-white text-base font-bold">{p.t}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </Caseta>
        </Secventa>

        {/* ——— DIRECȚII ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Cele trei masterclass-uri"
            titlu={<>Trei meserii. Îl iei pe cel care te privește.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIRECTII.map((d) => (
              <Caseta key={d.id} className="group relative overflow-hidden p-6 md:p-7 flex flex-col">
                {/* Numărul uriaș, aproape invizibil, în spate: dă adâncime
                    cardului și numerotează fără să ocupe un rând de text.
                    Se aprinde ușor la hover, cât să se simtă că e viu. */}
                <span
                  aria-hidden
                  className="serif pointer-events-none absolute -top-6 -right-2 text-[9rem] leading-none text-white/[0.035] group-hover:text-mov/15 transition-colors duration-500 select-none"
                >
                  {d.numar}
                </span>

                <div className="relative flex items-center gap-3 mb-5">
                  <span className="shrink-0 w-11 h-11 rounded-xl bg-mov/10 border border-mov/25 flex items-center justify-center">
                    {createElement(ICOANE[d.icon as NumeIcoana], { size: 19, className: 'text-mov', strokeWidth: 1.9 })}
                  </span>
                  <h3 className="text-white text-xl font-bold tracking-wide">{d.nume}</h3>
                </div>

                <p className="relative text-white text-lg font-semibold leading-snug mb-3">
                  {d.promisiune}
                </p>
                <p className="relative text-neutral-400 text-sm leading-relaxed mb-7 flex-1">{d.text}</p>

                <div className="relative pt-5 border-t border-white/[0.06] space-y-3">
                  <Eticheta ton="neon">Pleci cu</Eticheta>
                  {d.pleciCu.map((x) => (
                    <div key={x} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md bg-neon/15 flex items-center justify-center">
                        <Check size={12} className="text-neon" strokeWidth={3} />
                      </span>
                      <span className="text-neutral-200 text-sm leading-snug">{x}</span>
                    </div>
                  ))}
                </div>
              </Caseta>
            ))}
          </div>
          <Caseta className="p-6 mt-3">
            <p className="text-neutral-300 text-sm leading-relaxed masura-text">
              <span className="text-neon font-semibold">Fiecare se cumpără separat.</span>{' '}
              Unul singur e un masterclass întreg, de o zi, cu lucrul tău publicat la final. Dacă le
              iei pe două sau pe toate trei, prețul pe bucată scade. Care anume ți se potrivește și
              cât costă, stabilim la apel.
            </p>
          </Caseta>
        </Secventa>

        {/* ——— SOLOPRENOR ———
             Cerută de owner pe 29.10.2026, odată cu împărțirea în trei.
             Stă aici, imediat după cele trei meserii: întâi vezi ce înveți,
             apoi vezi cum arată viața în care te lasă.

             Fotografii reale, nu randări AI, și fără niciun om în cadru —
             vezi nota din src/data/mentorat.ts. Tratamentul (desaturare +
             întunecare, care se desfac la hover) le ține pe toate patru în
             aceeași lumină, deși sunt făcute de patru oameni diferiți. */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta={SOLOPRENOR.eticheta}
            titlu={<>{SOLOPRENOR.titlu}</>}
          />
          <p className="text-neutral-400 text-base leading-relaxed masura-text -mt-3 mb-8">
            {SOLOPRENOR.text}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SOLOPRENOR.cadre.map((c) => (
              <div
                key={c.titlu}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)]"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-950">
                  <ImageWithFallback
                    src={c.imagine}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[0.3] brightness-[0.62] contrast-[1.08] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-[1.04] transition-all duration-700"
                  />
                </div>
                {/* Degradeul e ce face textul lizibil peste orice fotografie.
                    Fără el, un titlu alb peste cer luminat dispare. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-white text-base md:text-lg font-bold leading-tight mb-1.5">
                    {c.titlu}
                  </p>
                  <p className="text-neutral-300 text-[13px] leading-snug">{c.text}</p>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            ))}
          </div>
        </Secventa>

        {/* ——— CÂT SE VINDE PE PIAȚĂ ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Cât se vinde pe piață"
            titlu={<>Prețurile sunt publice. Uite-le, ca să știi ce vinzi.</>}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {PIATA.map((d) => (
              <Caseta key={d.id} className="p-6 flex flex-col">
                <Eticheta ton="mov">{d.nume}</Eticheta>
                <div className="mt-5 space-y-4 flex-1">
                  {d.randuri.map((r) => (
                    <div key={r.ce} className="pb-4 border-b border-white/[0.06] last:border-0 last:pb-0">
                      <p className="text-neutral-400 text-[13px] leading-snug mb-2">{r.ce}</p>
                      <p className="text-neon text-2xl md:text-[1.7rem] font-bold tracking-tight leading-none tabular-nums">{r.pret}</p>
                      <p className="text-neutral-500 text-xs mt-2 tabular-nums">{r.detaliu}</p>
                    </div>
                  ))}
                </div>
                {/* Linkurile de sursă au fost scoase la cererea owner-ului, 29.10.2026.
                    Proveniența fiecărei cifre rămâne scrisă în `PIATA` din date. */}
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-neutral-300 text-sm leading-relaxed">{d.acopera}</p>
                </div>
              </Caseta>
            ))}
          </div>

          <Caseta className="p-6 md:p-8 mt-3">
            <Eticheta ton="neon">Când îți acoperi investiția</Eticheta>
            <p className="text-neutral-300 text-base leading-relaxed masura-text mt-3 mb-5">
              Din prima zi ai ce să vinzi: lucrul construit, oferta, prețul și primii zece clienți pe
              nume. La prețurile de mai sus,{' '}
              <span className="text-neon font-semibold">un singur proiect livrat acoperă investiția
              în masterclass</span>, pe oricare din cele trei.
            </p>
            <p className="text-neutral-500 text-xs leading-relaxed masura-mic">
              {PIATA_AVERTISMENT}
            </p>
          </Caseta>
        </Secventa>

        {/* ——— CE PLECI CU ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Ce pleci cu"
            titlu={<>Șase lucruri pe care le poți arăta cuiva luni dimineață.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLECI_CU.map((x, i) => (
              <Caseta key={x.titlu} className={`p-6 ${i === PLECI_CU.length - 1 && PLECI_CU.length % 2 === 1 ? 'md:col-span-2' : ''}`}>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-neon/10 border border-neon/25 flex items-center justify-center">
                    {createElement(ICOANE[x.icon as NumeIcoana], { size: 18, className: 'text-neon', strokeWidth: 1.9 })}
                  </span>
                  <div>
                    <p className="text-white text-base font-bold mb-1.5">{x.titlu}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                  </div>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— CUM ARATĂ ZIUA ——— */}
        <Secventa className="pt-16 md:pt-24">
          <div id="zile" className="scroll-mt-8">
            <TitluSecvenca
              eticheta="Structura unei zile"
              titlu={<>O zi, trei părți. La fel în fiecare dintre cele trei.</>}
            />
          </div>
          <div className="flex flex-col gap-3">
            {ZILE.map((z) => (
              <Caseta key={z.eticheta} className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
                  <div className="md:w-48 shrink-0">
                    <span className="block text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-mov tabular-nums">
                      {z.eticheta}
                    </span>
                    <p className="text-white text-xl md:text-2xl font-bold tracking-wide mt-1.5">{z.nume}</p>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed masura-text flex-1">{z.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed mt-4 masura-text">
            Live, cu camera pornită, și înregistrat. Aceeași structură indiferent pe care dintre cele
            trei o iei. {OFERTA.dateNota}
          </p>
        </Secventa>

        {/* ——— COMUNITATEA ———
             Blocul cu cea mai mare greutate vizuală de pe pagină: e singurul
             lucru din ofertă care nu se termină odată cu ziua.

             Nu mai e un card cu halou verde de 30px — owner, 29.10.2026:
             „Umbra asta cu verde nu imi place." În locul lui, un fir de un
             pixel care trece din verde în mov, plus patru benzi despărțite de
             linii: antetul, argumentul, ce primești și seria. Segmentat, nu
             turnat într-o singură bucată. */}
        <Secventa className="pt-16 md:pt-24">
          <div className="chenar-gradient rounded-[1.0625rem] p-px shadow-[0_40px_90px_-45px_rgba(0,0,0,1)]">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950">
              <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />

              {/* BANDA 1 — ce este */}
              <div className="relative flex flex-wrap items-center gap-3 px-6 md:px-10 py-5 border-b border-white/[0.07] bg-white/[0.02]">
                <span className="px-4 py-2 rounded-full bg-neon text-black text-xs font-bold tracking-[0.18em] uppercase">
                  Acces {COMUNITATE.acces}
                </span>
                <span className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase">
                  pe {COMUNITATE.platforma}
                </span>
                <span className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase">
                  plătit o dată
                </span>
              </div>

              {/* BANDA 2 — argumentul, lângă panoul de Discord */}
              <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-[1.12] mb-5 masura-titlu">
                    Masterclass-ul se termină într-o zi.{' '}
                    <span className="serif-italic text-neon lumina-text text-[1.1em]">
                      Comunitatea, niciodată.
                    </span>
                  </h2>

                  <p className="text-neutral-300 text-base leading-relaxed masura-text">
                    Problemele nu apar în ziua masterclass-ului, apar în săptămâna 4. De asta accesul nu e bonus și
                    nu e abonament: îl cumperi o dată, cu masterclass-ul, și rămâne al tău.
                  </p>
                </div>

                <div className="p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-white/[0.07] bg-black/40 flex items-center">
                  <div className="w-full rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl shadow-black/60">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/70">
                      <span className="flex gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-700" />
                      </span>
                      <span className="flex-1 text-center text-[10px] text-neutral-500 font-medium truncate">
                        {COMUNITATE.platforma.toLowerCase()} · {COMUNITATE.nume}
                      </span>
                      <span className="w-[26px] shrink-0" />
                    </div>

                    <div className="p-3">
                      {COMUNITATE.canale.map((canal, i) => (
                        <div
                          key={canal}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            i === 0 ? 'bg-mov/10 border border-mov/20' : ''
                          }`}
                        >
                          <Hash size={13} className={i === 0 ? 'text-mov' : 'text-neutral-600'} />
                          <span className={`text-[13px] ${i === 0 ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                            {canal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BANDA 3 — ce primești acolo, în celule despărțite de linii.
                  `-mb-px -mr-px` pe grilă: marginea de jos și cea din dreapta
                  ies sub `overflow-hidden`, deci nu se dublează cu chenarul. */}
              <div className="relative border-t border-white/[0.07]">
                <div className="px-6 md:px-10 pt-6 pb-4">
                  <Eticheta ton="mov">Ce primești acolo</Eticheta>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-white/[0.07] -mb-px -mr-px">
                  {COMUNITATE.lucruri.map((x) => (
                    <div
                      key={x.titlu}
                      className="border-b border-r border-white/[0.07] px-6 md:px-8 py-6 bg-white/[0.012]"
                    >
                      <span className="inline-flex w-9 h-9 rounded-xl bg-neon/10 border border-neon/25 items-center justify-center mb-4">
                        {createElement(ICOANE[x.icon as NumeIcoana], { size: 16, className: 'text-neon', strokeWidth: 1.9 })}
                      </span>
                      <p className="text-white text-[15px] font-bold mb-1.5">{x.titlu}</p>
                      <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BANDA 4 — seria.
                  ⚠️ Locurile sunt goale DINADINS — sunt locuri, nu oameni.
                  Chipuri de stoc aici ar fi exact aceeași minciună ca o
                  recenzie inventată. Când există poze reale, intră aici. */}
              <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 md:px-10 py-6 border-t border-white/[0.07] bg-black/40">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    <span className="w-9 h-9 rounded-full overflow-hidden border-2 border-neutral-950 ring-1 ring-neon/40 shrink-0">
                      <ImageWithFallback src={AVATAR_IMG} alt="VANDY" className="w-full h-full object-cover" />
                    </span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-950 ring-1 ring-neutral-800 flex items-center justify-center shrink-0"
                      >
                        <User size={13} className="text-neutral-700" />
                      </span>
                    ))}
                  </div>
                  <p className="text-neutral-400 text-sm leading-snug">
                    tu și încă{' '}
                    <span className="text-white font-semibold tabular-nums">
                      {OFERTA.locuriTotal - 1}
                    </span>
                    , plus eu
                  </p>
                </div>
                <Eticheta ton="mov">Seria 1</Eticheta>
              </div>
            </div>
          </div>
        </Secventa>

        {/* ——— RECENZII ——— */}
        {RECENZII.length > 0 && (
          <Secventa className="pt-16 md:pt-24">
            <TitluSecvenca
              eticheta="Clienții mei"
              titlu={<>Ce spun oamenii pentru care am construit.</>}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {RECENZII.map((r) => (
                <Caseta key={r.nume + r.lucrare} className="p-6 flex flex-col">
                  <Quote size={18} className="text-mov mb-4 shrink-0" />
                  <p className="text-neutral-300 text-sm leading-relaxed flex-1">{r.text}</p>
                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <p className="text-white text-sm font-bold">{r.nume}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{r.rol}</p>
                    <p className="text-neutral-600 text-[11px] mt-2">{r.lucrare}</p>
                    {r.href && (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-white transition-colors text-[11px] mt-2"
                      >
                        vezi lucrarea <ArrowUpRight size={11} />
                      </a>
                    )}
                  </div>
                </Caseta>
              ))}
            </div>
          </Secventa>
        )}

        {/* ——— INVESTIȚIA ———
             Prețul NU apare aici. Decizie owner, 29.10.2026: se spune la apel.
             Secțiunea răspunde în schimb la întrebarea pe care o ridică absența
             lui, pentru că a o ocoli ar arăta mai rău decât o cifră. */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca
            eticheta="Investiția"
            titlu={<>Prețul îl afli la apel. Și e intenționat.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Caseta className="md:col-span-2 p-6 md:p-8">
              <Eticheta>Locuri în prima serie</Eticheta>
              <p className="text-6xl md:text-7xl font-bold text-neon tracking-tight leading-none mt-3 mb-2 tabular-nums lumina-text">
                {locuriLibere}<span className="text-neutral-700 text-3xl">/{OFERTA.locuriTotal}</span>
              </p>
              <p className="text-neutral-500 text-sm mb-6">{OFERTA.dateText}</p>
              <Locuri />

              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-white text-sm font-semibold">Trei prețuri, nu unul</p>
                <p className="text-neutral-500 text-xs mt-1">
                  Unul singur, oricare două, sau toate trei — pe bucată costă din ce în ce mai puțin.
                  Integral sau în două tranșe, factură pe firmă sau pe persoană fizică. Nimic nu se
                  plătește înainte de apel.
                </p>
              </div>
            </Caseta>

            <Caseta className="md:col-span-3 p-6 md:p-8 space-y-6">
              <div>
                <Eticheta ton="mov">De ce nu scrie prețul aici</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Pentru că nu vindem un loc oricui plătește. Sunt zece. La apel ne uităm întâi dacă
                  ai ce construi într-o zi și care dintre cele trei e al tău; dacă nu ne potrivim, ți-o
                  spunem atunci. O cifră fără discuția asta nu îți spune nimic util — iar ce
                  primești pentru ea e scris mai sus, rând cu rând.
                </p>
              </div>
              <div className="pt-6 border-t border-white/[0.06]">
                <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Dacă la finalul zilei tale nu ai construit și publicat lucrul tău, scrii un email
                  și îți returnez integral banii. Fără motive, fără dovezi. Riscul e al meu, pentru că
                  livrarea depinde de mine.
                </p>
              </div>
              <div className="pt-6 border-t border-white/[0.06]">
                <Buton href="#aplica" className="w-full sm:w-auto">
                  Lasă-ți datele pentru detalii <ArrowRight size={16} />
                </Buton>
              </div>
            </Caseta>
          </div>
        </Secventa>

        {/* ——— ÎNCREDERE ——— */}
        <Secventa className="pt-16 md:pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INCREDERE.map((x) => (
              <Caseta key={x.titlu} className="p-5 flex items-start gap-3.5">
                <span className="shrink-0 w-9 h-9 rounded-lg bg-mov/10 border border-mov/25 flex items-center justify-center">
                  {createElement(ICOANE[x.icon as NumeIcoana], { size: 16, className: 'text-mov', strokeWidth: 1.9 })}
                </span>
                <div>
                  <p className="text-white text-[15px] font-bold mb-1">{x.titlu}</p>
                  <p className="text-neutral-400 text-[13px] leading-relaxed">{x.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— NU E PENTRU TINE ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca eticheta="Cinstit" titlu={<>Când să nu ne scrii.</>} />
          <Caseta className="p-6 md:p-8 space-y-4">
            {NU_E_PENTRU.map((x) => (
              <div key={x} className="flex items-start gap-3">
                <Minus size={16} className="text-mov/70 mt-0.5 shrink-0" />
                <p className="text-neutral-300 text-sm leading-relaxed">{x}</p>
              </div>
            ))}
          </Caseta>
        </Secventa>

        {/* ——— FORMULAR ——— */}
        <Secventa className="pt-16 md:pt-24">
          <div id="aplica" className="scroll-mt-8">
            <Cronometru />
            <Caseta className="overflow-hidden ring-1 ring-neon/20">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                  <Formular />
                </div>
                <div className="lg:col-span-2 p-6 md:p-8 bg-black/20 space-y-7">
                  <div>
                    <Eticheta ton="mov">Cum arată pasul 2</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      20 de minute cu echipa. Te întrebăm ce vrei să construiești, îți spunem dacă
                      se poate într-o zi, și primești toate detaliile: datele, prețul, condițiile.
                      Dacă nu ne potrivim, ți-o spunem atunci.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/[0.06]">
                    <Eticheta ton="mov">Ce nu se întâmplă la apel</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      Nu te ține nimeni o oră ca să te convingă și nu ți se cere o decizie la
                      telefon. Afli prețul, închizi și te gândești. Nici bonusul nu grăbește apelul:
                      se decide când îți lași datele, nu în discuție.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/[0.06]">
                    <Eticheta ton="mov">Preferi să scrii?</Eticheta>
                    <div className="flex flex-col gap-2 mt-3 text-sm">
                      <a href="https://www.instagram.com/vandy_o1/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-mov transition-colors inline-flex items-center gap-1.5">
                        Instagram @vandy_o1 <ArrowUpRight size={13} />
                      </a>
                      <a href="https://t.me/VANDY_001_Official" target="_blank" rel="noopener noreferrer" className="text-white hover:text-mov transition-colors inline-flex items-center gap-1.5">
                        Telegram <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Caseta>
          </div>
        </Secventa>

        {/* ——— ÎNTREBĂRI ——— */}
        <Secventa className="pt-16 md:pt-24">
          <TitluSecvenca eticheta="Întrebări" titlu={<>Ce mă întreabă toți.</>} />
          <div className="flex flex-col gap-3">
            {INTREBARI.map((x, i) => (
              <Intrebare key={x.q} q={x.q} a={x.a} deschisaInitial={i === 0} />
            ))}
          </div>
        </Secventa>

        {/* ——— FINAL ——— */}
        <Secventa className="pt-16 md:pt-24">
          <Caseta className="p-8 md:p-12 text-center ring-1 ring-neon/20">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] masura-titlu mx-auto mb-5">
              Într-o singură zi ai construit ceva,{' '}
              <span className="serif-italic text-neutral-500 text-[1.1em]">
                sau mai trece un trimestru la fel.
              </span>
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed masura-intro mx-auto mb-8 tabular-nums">
              {locuriLibere} locuri libere din {OFERTA.locuriTotal}. {OFERTA.dateText}.
            </p>
            <Buton href="#aplica" className="mx-auto">
              Lasă-ți datele <ArrowRight size={16} />
            </Buton>
          </Caseta>
        </Secventa>

        {/* ——— FOOTER ——— */}
        <footer className="pt-16 md:pt-24 pb-4">
          <span
            aria-hidden
            className="block h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8"
          />

          {/* ⚠️ Scurtat la cererea owner-ului, 29.10.2026, dar cele patru lucruri care
              îl apără au rămas, în ordinea asta: nu e consultanță financiară (contează,
              pentru că produsul lui de trading îl face „expert" în ochii legii) · nu
              garantează venit sau rezultat comercial (Legea 363/2007) · singurul
              angajament e „Ce pleci cu", acoperit de returnare · restul depinde de om.
              Dacă îl mai scurtezi, nu scoate niciunul din cele patru. */}
          <p className="text-neutral-500 text-[11px] leading-relaxed masura-mic mx-auto text-center">
            {OFERTA.numeProgram} este un program de formare practică. Nu e consultanță financiară
            sau de investiții și nu garantează niciun venit și niciun rezultat comercial. Singurul
            angajament e cel de la „Ce pleci cu", acoperit de returnarea integrală la finalul
            zilei tale. Restul depinde de munca, piața și deciziile fiecăruia.
          </p>

          {FIRMA && (
            <p className="text-center text-neutral-600 text-xs mt-5">
              {FIRMA.denumire} · CUI {FIRMA.cui} · {FIRMA.sediu}
            </p>
          )}
          <p className="text-center text-neutral-700 text-xs mt-5">
            © 2026 VANDY. Făcut cu 🖤 în alt Univers Paralel.
          </p>
        </footer>
      </div>

      <BaraFixa />
    </div>
  );
}
