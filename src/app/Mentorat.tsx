import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Hash, Minus, Quote, ShieldCheck, User } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Caseta, Secventa, Eticheta, TitluSecvenca, Buton } from './components/mentorat/Bucati';
import { CardProdus } from './components/mentorat/CardProdus';
import { Intrebare } from './components/mentorat/Intrebare';
import { PROJECTS } from '../data/projects';
import { translations } from '../data/translations';
import { useLoves } from './hooks/useLoves';
import { Formular } from './components/mentorat/Formular';
import {
  OFERTA, DIRECTII, PLECI_CU, ZILE, NU_E_PENTRU, INTREBARI, locuriLibere,
  CAPTURI, PRODUSE_DOVADA, PIATA, PIATA_AVERTISMENT, RECENZII, INCREDERE, FIRMA,
  COMUNITATE, BRANDURI,
} from '../data/mentorat';
// Portretul real, cel de pe cardurile de social media. NU randarea neagră de
// pe prima pagină: aici vinde un om, nu un personaj.
// Decupat pe cap, ca să nu iasă jumătate de sacou într-un cerc de 56px:
//   sips -c 1600 1600 --cropOffset 0 140 \
//     ~/vandy_quotes/surse/personaj/avatar-real-2048.png --out x.png
//   sips -Z 512 x.png --out src/assets/vandy-real.png
// PNG, nu JPEG: la 512px e lossless, fără subeșantionare de culoare.
import AVATAR_IMG from '../assets/vandy-real.png';

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
          <p className="text-neutral-400 text-xs truncate tabular-nums">
            {locuriLibere} din {OFERTA.locuriTotal} locuri libere
          </p>
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
      motorului, numerele direcțiilor, etichetele celor trei zile,
      numerotarea produselor, întrebarea deschisă din FAQ, banda de
      încredere, numele brandurilor la hover. Tot ce descrie cum e făcut
      programul, nu ce câștigi din el.

   Regula practică: dacă elementul cere o acțiune sau numără bani, e verde.
   Dacă explică sau ordonează, e mov. Când ai dubii, lasă-l neutru.
   ──────────────────────────────────────────────────────────────────────── */

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

      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-4 spatiu-bara">

        {/* Header */}
        <header className="flex flex-row justify-between items-center py-4">
          <a href="/" className="flex flex-row items-center gap-3 group">
            <ArrowLeft size={16} className="text-neutral-600 group-hover:text-neon transition-colors" />
            <h1 className="text-2xl font-bold text-white tracking-wide">VANDY</h1>
          </a>
          <Eticheta ton="mov">{OFERTA.tip} · {OFERTA.numeProgram}</Eticheta>
        </header>

        {/* ——— HERO ——— */}
        <Caseta className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-neutral-900/50 to-transparent">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-700 shrink-0">
                  <ImageWithFallback
                    src={AVATAR_IMG}
                    alt="VANDY"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-base font-bold tracking-wide">VANDY</p>
                  <p className="text-[11px] md:text-xs text-neutral-500 uppercase tracking-widest font-semibold tabular-nums">
                    10 aplicații live · 11 ani în branding
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-neon text-black text-xs font-bold tracking-[0.18em] uppercase">
                  {OFERTA.tip}
                </span>
                <span className="px-4 py-1.5 rounded-full border border-neutral-700 text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase tabular-nums">
                  {OFERTA.durata}
                </span>
                <span className="px-4 py-1.5 rounded-full border border-neutral-700 text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase tabular-nums">
                  Doar {locuriLibere} locuri
                </span>
              </div>

              <h2 className="text-4xl md:text-[3rem] font-bold leading-[1.1] text-white tracking-tight mb-6 text-balance">
                Nu te învăț să folosești AI.<br />
                <span className="text-neutral-500">
                  Te învăț să construiești cu AI lucruri{' '}
                  <span className="text-neon lumina-text">pentru care oamenii plătesc</span>.
                </span>
              </h2>

              <p className="text-neutral-200 text-base md:text-lg font-semibold leading-snug masura-intro mb-6 pb-6 border-b border-neutral-800/70">
                {OFERTA.pentruCine}
              </p>

              <p className="text-neutral-400 text-base leading-relaxed masura-intro mb-8">
                Trei zile live, zece antreprenori. Pleci cu lucrul tău construit și publicat, cu
                prețul scris pe el și cu primii zece clienți pe nume.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Buton href="#aplica">Lasă-ți datele pentru detalii <ArrowRight size={16} /></Buton>
                <Buton href="#zile" variant="contur">Vezi cele 3 zile</Buton>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 font-medium">
                <span className="text-white font-bold tabular-nums">{locuriLibere} locuri din {OFERTA.locuriTotal}</span>
                <span>{OFERTA.durata}</span>
                <span className="text-neon/80 font-semibold">comunitate pe viață</span>
                <span>{OFERTA.dateText}</span>
              </div>
            </div>

            <div className="w-full md:w-[34%] border-t md:border-t-0 md:border-l border-neutral-800/50 p-6 md:p-8 flex flex-col justify-between gap-8 bg-black/20">
              <div className="space-y-4">
                <Eticheta>Locuri</Eticheta>
                <p className="text-6xl md:text-7xl font-bold text-neon tracking-tight leading-none tabular-nums lumina-text">
                  {locuriLibere}<span className="text-neutral-700 text-3xl">/{OFERTA.locuriTotal}</span>
                </p>
                <Locuri />
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Zece, nu o sută. În ziua 2 mă uit pe ecranul fiecăruia și repar pe loc.
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-800/60">
                <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Dacă la finalul zilei 3 nu ai construit și publicat lucrul tău, îți returnez toți
                  banii. Fără motive.
                </p>
              </div>
            </div>
          </div>
        </Caseta>

        {/* ——— BRANDURI ——— */}
        <Secventa className="pt-6">
          <Caseta className="px-6 py-7 md:px-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              <Eticheta>
                Branduri pentru care<br className="hidden lg:block" /> am lucrat
              </Eticheta>
              <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
                {BRANDURI.map((b) => (
                  <span
                    key={b}
                    className="text-neutral-400 text-sm md:text-base font-bold tracking-[0.12em] uppercase hover:text-mov transition-colors"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Caseta>
        </Secventa>

        {/* ——— PROBLEMA ——— */}
        <Secventa className="pt-10">
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

        {/* ——— DOVADA ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca
            eticheta="Dovada"
            titlu={<>Zece aplicații construite și publicate. Click pe oricare.</>}
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
            Toate sunt construite cu metoda din cele trei zile.
          </p>
        </Secventa>

        {/* ——— MOTORUL ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca
            eticheta="Motorul"
            titlu={<>Un singur mecanism, trei feluri de a-l vinde.</>}
          />
          <Caseta className="p-6 md:p-8">
            <p className="text-neutral-400 text-sm leading-relaxed masura-text mb-8">
              Cele trei direcții folosesc același motor, iar motorul are trei piese. Le înveți o
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
        <Secventa className="pt-10">
          <TitluSecvenca
            eticheta="Alegi o direcție"
            titlu={<>Le primești pe toate trei. Execuți una.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIRECTII.map((d) => (
              <Caseta key={d.id} className="p-6 flex flex-col">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-mov text-base font-bold tabular-nums">{d.numar}</span>
                  <h3 className="text-white text-xl font-bold tracking-wide">{d.nume}</h3>
                </div>
                <p className="text-white text-base font-semibold mb-3">{d.promisiune}</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">{d.text}</p>
                <div className="pt-5 border-t border-neutral-800/60 space-y-2.5">
                  <Eticheta ton="mov">Pleci cu</Eticheta>
                  {d.pleciCu.map((x) => (
                    <div key={x} className="flex items-start gap-2.5">
                      <Check size={14} className="text-neon mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-neutral-300 text-sm leading-snug">{x}</span>
                    </div>
                  ))}
                </div>
              </Caseta>
            ))}
          </div>
          <Caseta className="p-6 mt-3">
            <p className="text-neutral-300 text-sm leading-relaxed masura-text">
              <span className="text-neon font-semibold">Alegi una pentru primele 30 de zile.</span>{' '}
              Materialele le ai pe toate trei, dar execuți una singură — ăsta e singurul motiv pentru
              care oamenii termină ce încep. Care anume, stabilim la apel.
            </p>
          </Caseta>
        </Secventa>

        {/* ——— CÂT SE VINDE PE PIAȚĂ ——— */}
        <Secventa className="pt-10">
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
                    <div key={r.ce} className="pb-4 border-b border-neutral-800/60 last:border-0 last:pb-0">
                      <p className="text-neutral-400 text-[13px] leading-snug mb-2">{r.ce}</p>
                      <p className="text-neon text-2xl md:text-[1.7rem] font-bold tracking-tight leading-none tabular-nums">{r.pret}</p>
                      <p className="text-neutral-500 text-xs mt-2 tabular-nums">{r.detaliu}</p>
                    </div>
                  ))}
                </div>
                {/* Linkurile de sursă au fost scoase la cererea owner-ului, 29.10.2026.
                    Proveniența fiecărei cifre rămâne scrisă în `PIATA` din date. */}
                <div className="mt-6 pt-5 border-t border-neutral-800/60">
                  <p className="text-neutral-300 text-sm leading-relaxed">{d.acopera}</p>
                </div>
              </Caseta>
            ))}
          </div>

          <Caseta className="p-6 md:p-8 mt-3">
            <Eticheta ton="neon">Când îți acoperi investiția</Eticheta>
            <p className="text-neutral-300 text-base leading-relaxed masura-text mt-3 mb-5">
              Din ziua 3 ai ce să vinzi: lucrul construit, oferta, prețul și primii zece clienți pe
              nume. La prețurile de mai sus,{' '}
              <span className="text-neon font-semibold">un singur proiect livrat acoperă investiția
              în masterclass</span>, pe oricare din cele trei direcții.
            </p>
            <p className="text-neutral-500 text-xs leading-relaxed masura-mic">
              {PIATA_AVERTISMENT}
            </p>
          </Caseta>
        </Secventa>

        {/* ——— CE PLECI CU ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca
            eticheta="Ce pleci cu"
            titlu={<>Cinci lucruri pe care le poți arăta cuiva luni dimineață.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLECI_CU.map((x, i) => (
              <Caseta key={x.titlu} className={`p-6 ${i === PLECI_CU.length - 1 && PLECI_CU.length % 2 === 1 ? 'md:col-span-2' : ''}`}>
                <div className="flex items-start gap-4">
                  <Check size={18} className="text-neon mt-0.5 shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="text-white text-base font-bold mb-1.5">{x.titlu}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                  </div>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— CELE 3 ZILE ——— */}
        <Secventa className="pt-10">
          <div id="zile" className="scroll-mt-8">
            <TitluSecvenca
              eticheta="Structura"
              titlu={<>Trei zile. Fiecare are o singură treabă.</>}
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
            Live, cu camera pornită, și înregistrat. {OFERTA.dateNota}
          </p>
        </Secventa>

        {/* ——— COMUNITATEA ———
             Blocul cu cea mai mare greutate vizuală de pe pagină: e singurul
             lucru din ofertă care nu se termină în trei zile, deci merită să
             se vadă ca atare. */}
        <Secventa className="pt-10">
          <Caseta className="overflow-hidden ring-2 ring-neon/25 lumina-bloc">
            <div className="bg-gradient-to-br from-neon/[0.07] via-transparent to-mov/[0.07]">

              <div className="flex flex-wrap items-center gap-3 px-6 pt-6 md:px-10 md:pt-8">
                <span className="px-4 py-2 rounded-full bg-neon text-black text-xs font-bold tracking-[0.18em] uppercase lumina-bloc">
                  Acces {COMUNITATE.acces}
                </span>
                <span className="px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase">
                  pe {COMUNITATE.platforma}
                </span>
                <span className="px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 text-xs font-bold tracking-[0.18em] uppercase">
                  plătit o dată
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 p-6 md:p-10">

                <div>
                  <h2 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-[1.15] mb-5 masura-titlu">
                    Masterclass-ul se termină în trei zile.{' '}
                    <span className="text-neon lumina-text">Comunitatea, niciodată.</span>
                  </h2>

                  <p className="text-neutral-300 text-base leading-relaxed masura-text mb-8">
                    Problemele nu apar în ziua 2, apar în săptămâna 4. De asta accesul nu e bonus și
                    nu e abonament: îl cumperi o dată, cu masterclass-ul, și rămâne al tău.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-6">
                    {COMUNITATE.lucruri.map((x) => (
                      <div key={x.titlu} className="flex items-start gap-3">
                        <Check size={15} className="text-neon mt-0.5 shrink-0" strokeWidth={2.5} />
                        <div>
                          <p className="text-white text-[15px] font-bold mb-1">{x.titlu}</p>
                          <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panoul comunității.
                    ⚠️ Locurile din dreapta sunt goale DINADINS — sunt locuri, nu
                    oameni. Chipuri de stoc aici ar fi exact aceeași minciună ca o
                    recenzie inventată. Când există poze reale cu membri, intră aici. */}
                <div className="rounded-2xl border border-neutral-800 bg-black/50 overflow-hidden self-start">
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
                          i === 0 ? 'bg-mov/10' : ''
                        }`}
                      >
                        <Hash size={13} className={i === 0 ? 'text-mov' : 'text-neutral-600'} />
                        <span className={`text-[13px] ${i === 0 ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                          {canal}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-4 border-t border-neutral-800 space-y-3">
                    <Eticheta ton="mov">Seria 1</Eticheta>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2.5">
                        <span className="w-9 h-9 rounded-full overflow-hidden border-2 border-neutral-900 ring-1 ring-neon/40 shrink-0">
                          <ImageWithFallback src={AVATAR_IMG} alt="VANDY" className="w-full h-full object-cover" />
                        </span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-900 ring-1 ring-neutral-800 flex items-center justify-center shrink-0"
                          >
                            <User size={13} className="text-neutral-700" />
                          </span>
                        ))}
                      </div>
                      <p className="text-neutral-500 text-xs leading-snug">
                        tu și încă{' '}
                        <span className="text-white font-semibold tabular-nums">
                          {OFERTA.locuriTotal - 1}
                        </span>
                        , plus eu
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Caseta>
        </Secventa>

        {/* ——— RECENZII ——— */}
        {RECENZII.length > 0 && (
          <Secventa className="pt-10">
            <TitluSecvenca
              eticheta="Clienții mei"
              titlu={<>Ce spun oamenii pentru care am construit.</>}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {RECENZII.map((r) => (
                <Caseta key={r.nume + r.lucrare} className="p-6 flex flex-col">
                  <Quote size={18} className="text-mov mb-4 shrink-0" />
                  <p className="text-neutral-300 text-sm leading-relaxed flex-1">{r.text}</p>
                  <div className="mt-6 pt-5 border-t border-neutral-800/60">
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
        <Secventa className="pt-10">
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

              <div className="mt-6 pt-5 border-t border-neutral-800/60">
                <p className="text-white text-sm font-semibold">Integral sau în două tranșe</p>
                <p className="text-neutral-500 text-xs mt-1">
                  Factură pe firmă sau pe persoană fizică. Nimic nu se plătește înainte de apel.
                </p>
              </div>
            </Caseta>

            <Caseta className="md:col-span-3 p-6 md:p-8 space-y-6">
              <div>
                <Eticheta ton="mov">De ce nu scrie prețul aici</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Pentru că nu vindem un loc oricui plătește. Sunt zece. La apel ne uităm întâi dacă
                  ai ce construi în trei zile și care direcție e a ta; dacă nu ne potrivim, ți-o
                  spunem atunci. O cifră fără discuția asta nu îți spune nimic util — iar ce
                  primești pentru ea e scris mai sus, rând cu rând.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800/60">
                <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Dacă la finalul zilei 3 nu ai construit și publicat lucrul tău, scrii un email și
                  îți returnez integral banii. Fără motive, fără dovezi. Riscul e al meu, pentru că
                  livrarea depinde de mine.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800/60">
                <Buton href="#aplica" className="w-full sm:w-auto">
                  Lasă-ți datele pentru detalii <ArrowRight size={16} />
                </Buton>
              </div>
            </Caseta>
          </div>
        </Secventa>

        {/* ——— ÎNCREDERE ——— */}
        <Secventa className="pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INCREDERE.map((x) => (
              <Caseta key={x.titlu} className="p-5 flex items-start gap-3.5">
                <ShieldCheck size={17} className="text-mov mt-0.5 shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-white text-[15px] font-bold mb-1">{x.titlu}</p>
                  <p className="text-neutral-400 text-[13px] leading-relaxed">{x.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— NU E PENTRU TINE ——— */}
        <Secventa className="pt-10">
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
        <Secventa className="pt-10">
          <div id="aplica" className="scroll-mt-8">
            <Caseta className="overflow-hidden ring-1 ring-neon/20">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-neutral-800/60">
                  <Formular />
                </div>
                <div className="lg:col-span-2 p-6 md:p-8 bg-black/20 space-y-7">
                  <div>
                    <Eticheta ton="mov">Cum arată pasul 2</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      20 de minute cu echipa. Te întrebăm ce vrei să construiești, îți spunem dacă
                      se poate în trei zile, și primești toate detaliile: datele, prețul, condițiile.
                      Dacă nu ne potrivim, ți-o spunem atunci.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-800/60">
                    <Eticheta ton="mov">Ce nu se întâmplă la apel</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      Nu te ține nimeni o oră ca să te convingă și nu există ofertă care „expiră în
                      zece minute". Afli prețul, închizi telefonul și te gândești.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-800/60">
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
        <Secventa className="pt-10">
          <TitluSecvenca eticheta="Întrebări" titlu={<>Ce mă întreabă toți.</>} />
          <div className="flex flex-col gap-3">
            {INTREBARI.map((x, i) => (
              <Intrebare key={x.q} q={x.q} a={x.a} deschisaInitial={i === 0} />
            ))}
          </div>
        </Secventa>

        {/* ——— FINAL ——— */}
        <Secventa className="pt-10">
          <Caseta className="p-8 md:p-12 text-center ring-1 ring-neon/20">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] masura-titlu mx-auto mb-5">
              În trei zile ai construit ceva, sau mai trece un trimestru la fel.
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
        <footer className="pt-10 pb-4 space-y-4">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-5">
            <p className="text-neutral-600 text-[11px] leading-relaxed masura-mic">
              {OFERTA.numeProgram} este un program de formare practică. Nu reprezintă consultanță
              financiară sau de investiții și nu garantează niciun venit, nicio sumă și niciun
              rezultat comercial. Singurul angajament asumat este cel descris la „Ce pleci cu",
              acoperit de garanția de returnare integrală la finalul zilei 3. Rezultatele depind de
              munca, piața și deciziile fiecărui participant.
            </p>
          </div>
          {FIRMA && (
            <p className="text-center text-neutral-600 text-xs">
              {FIRMA.denumire} · CUI {FIRMA.cui} · {FIRMA.sediu}
            </p>
          )}
          <p className="text-center text-neutral-700 text-xs">
            © 2026 VANDY. Făcut cu 🖤 în alt Univers Paralel.
          </p>
        </footer>
      </div>

      <BaraFixa />
    </div>
  );
}
