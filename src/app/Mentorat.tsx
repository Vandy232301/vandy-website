import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Minus, Quote, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Caseta, Secventa, Eticheta, TitluSecvenca, Buton } from './components/mentorat/Bucati';
import { CardProdus } from './components/mentorat/CardProdus';
import { PROJECTS } from '../data/projects';
import { translations } from '../data/translations';
import { useLoves } from './hooks/useLoves';
import { Formular } from './components/mentorat/Formular';
import {
  OFERTA, DIRECTII, PLECI_CU, ZILE, NU_E_PENTRU, INTREBARI, locuriLibere,
  CAPTURI, PRODUSE_DOVADA, PIATA, PIATA_AVERTISMENT, RECENZII, INCREDERE, FIRMA,
  COMUNITATE, BRANDURI,
} from '../data/mentorat';
import AVATAR_IMG from '../assets/280a05b4e7cffd644dd36f6c7453213920fff3ac.png';

/** Bara de jos apare după ce treci de hero — pe telefon e singurul CTA mereu la îndemână. */
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
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        vizibila ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-black/80 backdrop-blur-xl border-t border-neutral-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white text-sm font-bold tracking-tight truncate">
              <span className="text-neon">{OFERTA.pret} €</span> · {OFERTA.durata}
            </p>
            <p className="text-neutral-500 text-[11px] truncate">
              {locuriLibere} din {OFERTA.locuriTotal} locuri libere
            </p>
          </div>
          <Buton href="#aplica" className="shrink-0 px-5 py-3">
            Aplică <ArrowRight size={15} />
          </Buton>
        </div>
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

      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-4 pb-24">

        {/* Header */}
        <header className="flex flex-row justify-between items-center py-4">
          <a href="/" className="flex flex-row items-center gap-3 group">
            <ArrowLeft size={16} className="text-neutral-600 group-hover:text-neon transition-colors" />
            <h1 className="text-2xl font-bold text-white tracking-wide">VANDY</h1>
          </a>
          <Eticheta ton="neon">{OFERTA.numeProgram}</Eticheta>
        </header>

        {/* ——— HERO ——— */}
        <Caseta className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-neutral-900/50 to-transparent">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-700 grayscale shrink-0">
                  <ImageWithFallback src={AVATAR_IMG} alt="VANDY" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-wide">VANDY</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    10 aplicații live · 11 ani în branding
                  </p>
                </div>
              </div>

              <h2 className="text-3xl md:text-[2.6rem] font-bold leading-[1.15] text-white tracking-tight mb-6">
                Nu te învăț să folosești AI.<br />
                <span className="text-neutral-500">
                  Te învăț să construiești cu AI lucruri{' '}
                  <span className="text-neon lumina-text">pentru care oamenii plătesc</span>.
                </span>
              </h2>

              <p className="text-neutral-400 text-base leading-relaxed max-w-xl mb-8">
                Trei zile live, zece oameni. Nu pleci cu notițe și cu o listă de tool-uri. Pleci cu
                lucrul tău construit și publicat, cu prețul scris pe el și cu primii zece clienți
                identificați pe nume.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Buton href="#aplica">Aplică pentru unul din {locuriLibere} locuri <ArrowRight size={16} /></Buton>
                <Buton href="#zile" variant="contur">Vezi cele 3 zile</Buton>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
                <span className="text-neon font-bold lumina-text">{OFERTA.pret} €</span>
                <span>sau {OFERTA.rate.numar} × {OFERTA.rate.suma} €</span>
                <span>{OFERTA.durata}</span>
                <span className="text-neon/80 font-semibold">comunitate pe viață</span>
                <span>{OFERTA.dateText}</span>
              </div>
            </div>

            <div className="w-full md:w-[34%] border-t md:border-t-0 md:border-l border-neutral-800/50 p-6 md:p-8 flex flex-col justify-between gap-8 bg-black/20">
              <div className="space-y-4">
                <Eticheta>Locuri</Eticheta>
                <p className="text-5xl font-bold text-neon tracking-tight leading-none lumina-text">
                  {locuriLibere}<span className="text-neutral-700 text-2xl">/{OFERTA.locuriTotal}</span>
                </p>
                <Locuri />
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Zece, nu o sută. În ziua 2 mă uit pe ecranul fiecăruia și repar pe loc — altfel ar
                  fi doar un curs.
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-800/60">
                <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Dacă la finalul zilei 3 nu ai construit și publicat lucrul tău, îți returnez toți
                  banii. Nu îți cer motive.
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
                    className="text-neutral-400 text-sm md:text-base font-bold tracking-[0.12em] uppercase hover:text-neon transition-colors"
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
            eticheta="De ce încă n-ai făcut nimic cu AI"
            titlu={<>Problema nu e că nu știi destule. E că nu ai construit nimic.</>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { t: 'Ai încercat', d: 'Ai deschis ChatGPT, ai cerut ceva, ai primit ceva aproape bun. Și ai închis tab-ul.' },
              { t: 'Ai învățat', d: 'Două sute de clipuri cu „cele mai bune 10 tool-uri AI". Patruzeci de postări salvate pe care nu le-ai mai deschis.' },
              { t: 'Și tot n-ai nimic', d: 'Niciun lucru pe care să îl pui în fața unui client și să spui: ăsta e, costă atât.' },
            ].map((x) => (
              <Caseta key={x.t} className="p-6">
                <p className="text-white text-sm font-bold mb-2">{x.t}</p>
                <p className="text-neutral-400 text-sm leading-relaxed">{x.d}</p>
              </Caseta>
            ))}
          </div>
          <Caseta className="p-6 md:p-8 mt-3">
            <p className="text-neutral-300 text-base leading-relaxed max-w-3xl">
              Nu e vina ta. Aproape tot ce se vinde azi te învață <span className="text-white font-semibold">tool-uri</span>,
              iar tool-ul se schimbă în trei luni. Ce nu se schimbă e lucrul pe care îl livrezi și
              faptul că cineva scoate bani pentru el. Atelierul ăsta e construit invers față de un
              curs: pornim de la lucrul care se vinde și mergem înapoi spre ce trebuie să știi ca să-l faci.
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
          <p className="text-neutral-500 text-sm leading-relaxed mt-4 max-w-3xl">
            Fiecare ecran de mai sus e luat de pe site-ul live al produsului, nu e machetă. Nu îți
            vorbesc din teorie: deschide oricare și verifică. Toate au fost construite cu exact metoda
            pe care o predau în cele trei zile.
          </p>
        </Secventa>

        {/* ——— MOTORUL ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca
            eticheta="Motorul"
            titlu={<>Un singur mecanism, trei feluri de a-l vinde.</>}
          />
          <Caseta className="p-6 md:p-8">
            <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl mb-8">
              Toate cele trei direcții de mai jos folosesc același motor, iar motorul are trei piese.
              Le înveți o dată, în ziua 1, și de acolo încolo se schimbă doar ce vinzi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { n: '1', t: 'Traduci cererea', d: 'Cum transformi o cerere vagă — a unui client sau a ta — în caiet de sarcini pe care AI-ul îl execută corect din prima, nu din a douăzecea.' },
                { n: '2', t: 'Construiești de livrat', d: 'Diferența dintre un demo care impresionează și un lucru pentru care cineva plătește. Aici se pierde toată lumea.' },
                { n: '3', t: 'Publici și ceri bani', d: 'Cum pui lucrul în fața oamenilor, cum se formează prețul și cum îl ceri fără să te scuzi.' },
              ].map((p) => (
                <div key={p.n} className="space-y-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neon/40 text-neon text-xs font-bold">
                    {p.n}
                  </span>
                  <p className="text-white text-sm font-bold">{p.t}</p>
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
                  <span className="text-neutral-700 text-xs font-bold">{d.numar}</span>
                  <h3 className="text-white text-lg font-bold tracking-wide">{d.nume}</h3>
                </div>
                <p className="text-white text-sm font-semibold mb-3">{d.promisiune}</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">{d.text}</p>
                <div className="pt-5 border-t border-neutral-800/60 space-y-2.5">
                  <Eticheta>Pleci cu</Eticheta>
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
            <p className="text-neutral-300 text-sm leading-relaxed max-w-3xl">
              <span className="text-neon font-semibold">Alegi una pentru primele 30 de zile.</span>{' '}
              Materialele le ai pe toate trei, dar execuți o singură direcție — ăsta e singurul motiv
              pentru care oamenii termină ce încep. Pe care o alegi o stabilim la apel, împreună,
              în funcție de ce ai deja în mână.
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
                <Eticheta>{d.nume}</Eticheta>
                <div className="mt-5 space-y-4 flex-1">
                  {d.randuri.map((r) => (
                    <div key={r.ce} className="pb-4 border-b border-neutral-800/60 last:border-0 last:pb-0">
                      <p className="text-neutral-400 text-xs leading-snug mb-1.5">{r.ce}</p>
                      <p className="text-neon text-lg font-bold tracking-tight leading-none">{r.pret}</p>
                      <p className="text-neutral-600 text-[11px] mt-1.5">{r.detaliu}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-neutral-800/60 space-y-3">
                  <p className="text-neutral-300 text-sm leading-relaxed">{d.acopera}</p>
                  <a
                    href={d.sursa.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-600 hover:text-neon transition-colors text-[11px]"
                  >
                    sursă: {d.sursa.text} <ArrowUpRight size={11} />
                  </a>
                </div>
              </Caseta>
            ))}
          </div>

          <Caseta className="p-6 md:p-8 mt-3">
            <Eticheta ton="neon">Când îți acoperi investiția</Eticheta>
            <p className="text-neutral-300 text-base leading-relaxed max-w-3xl mt-3 mb-5">
              Din ziua 3 ai deja ce să vinzi: lucrul construit, oferta scrisă, prețul și primii zece
              clienți pe nume. La prețurile de mai sus,{' '}
              <span className="text-neon font-semibold">un singur proiect livrat pe oricare din cele
              trei direcții acoperă cei {OFERTA.pret} €</span> — un site de prezentare, o treime dintr-un
              MVP, sau trei luni cu un client pe pachetul de clipuri.
            </p>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-3xl">
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
                    <p className="text-white text-sm font-bold mb-1.5">{x.titlu}</p>
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
                    <Eticheta>{z.eticheta}</Eticheta>
                    <p className="text-white text-xl font-bold tracking-wide mt-1">{z.nume}</p>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed flex-1">{z.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed mt-4 max-w-2xl">
            Live, cu camera pornită, și înregistrat. {OFERTA.dateNota}
          </p>
        </Secventa>

        {/* ——— COMUNITATEA ——— */}
        <Secventa className="pt-10">
          <Caseta className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Eticheta ton="neon">Acces {COMUNITATE.acces}</Eticheta>
              <span className="px-3 py-1 rounded-full bg-neon text-black text-[10px] font-bold tracking-wider uppercase">
                pe {COMUNITATE.platforma}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-5 max-w-2xl">
              Atelierul se termină în trei zile. Comunitatea {COMUNITATE.nume} nu se termină niciodată.
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl mb-9">
              Problemele nu apar în ziua 2, apar în săptămâna 4. De asta accesul la comunitate nu e
              bonus și nu e abonament: îl cumperi o dată, odată cu atelierul, și rămâne al tău. Fără
              reînnoire, fără taxă lunară, fără să-ți mai cer vreodată bani pentru el. Acolo găsești
              tot ce îți trebuie ca să construiești și să vinzi în era AI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
              {COMUNITATE.lucruri.map((x) => (
                <div key={x.titlu} className="flex items-start gap-3">
                  <Check size={15} className="text-neon mt-0.5 shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="text-white text-sm font-bold mb-1.5">{x.titlu}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{x.text}</p>
                  </div>
                </div>
              ))}
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
                  <Quote size={18} className="text-neutral-700 mb-4 shrink-0" />
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

        {/* ——— PREȚ ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca eticheta="Investiția" titlu={<>{OFERTA.pret} €, și de ce atât.</>} />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Caseta className="md:col-span-2 p-6 md:p-8">
              <p className="text-5xl md:text-6xl font-bold text-neon tracking-tight leading-none mb-2 lumina-text">
                {OFERTA.pret} €
              </p>
              <p className="text-neutral-500 text-sm mb-6">plată integrală</p>

              <div className="pt-5 border-t border-neutral-800/60">
                <p className="text-white text-sm font-semibold">
                  sau {OFERTA.rate.numar} × {OFERTA.rate.suma} €
                </p>
                <p className="text-neutral-500 text-xs mt-1">
                  prima tranșă înainte de ziua 1, a doua la 30 de zile
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-800/60 space-y-2">
                <Locuri />
                <p className="text-neutral-500 text-xs">
                  {locuriLibere} din {OFERTA.locuriTotal} locuri libere
                </p>
              </div>
            </Caseta>

            <Caseta className="md:col-span-3 p-6 md:p-8 space-y-6">
              <div>
                <Eticheta>De ce {OFERTA.pret} €</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Pentru că nu îți vând acces la niște înregistrări — îți vând trei zile din timpul
                  meu, împărțite la zece oameni, plus acces pe viață la comunitatea{' '}
                  {COMUNITATE.nume} de pe {COMUNITATE.platforma}, pe care o plătești o singură dată,
                  acum. Un singur
                  proiect livrat corect pe oricare din cele trei direcții acoperă suma. Cât de repede
                  ajungi acolo depinde de tine, și nu îți promit un termen.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800/60">
                <Eticheta ton="neon">Garanție pe livrare</Eticheta>
                <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                  Dacă la finalul zilei 3 nu ai construit și publicat lucrul tău, scrii un email și
                  îți returnez integral cei {OFERTA.pret} €. Nu îți cer motive și nu te pun să
                  dovedești nimic. Riscul e al meu, pentru că livrarea depinde de mine.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800/60">
                <Buton href="#aplica" className="w-full sm:w-auto">
                  Aplică pentru unul din {locuriLibere} locuri <ArrowRight size={16} />
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
                <ShieldCheck size={17} className="text-neon/70 mt-0.5 shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-white text-sm font-bold mb-1">{x.titlu}</p>
                  <p className="text-neutral-400 text-[13px] leading-relaxed">{x.text}</p>
                </div>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— NU E PENTRU TINE ——— */}
        <Secventa className="pt-10">
          <TitluSecvenca eticheta="Cinstit" titlu={<>Când să nu aplici.</>} />
          <Caseta className="p-6 md:p-8 space-y-4">
            {NU_E_PENTRU.map((x) => (
              <div key={x} className="flex items-start gap-3">
                <Minus size={16} className="text-neutral-600 mt-0.5 shrink-0" />
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
                    <Eticheta>Cum arată pasul 2</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      Un apel de 20 de minute. Te întreb ce vrei să construiești, îți spun dacă se
                      poate în trei zile, și stabilim direcția. Dacă nu ne potrivim, ți-o spun la
                      telefon și nu pierzi nimic.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-800/60">
                    <Eticheta>Ce nu se întâmplă la apel</Eticheta>
                    <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                      Nu te ține nimeni o oră ca să te convingă. Nu există ofertă care „expiră în
                      zece minute". Prețul e {OFERTA.pret} € și e scris mai sus.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-800/60">
                    <Eticheta>Preferi să scrii?</Eticheta>
                    <div className="flex flex-col gap-2 mt-3 text-sm">
                      <a href="https://www.instagram.com/vandy_o1/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-neon transition-colors inline-flex items-center gap-1.5">
                        Instagram @vandy_o1 <ArrowUpRight size={13} />
                      </a>
                      <a href="https://t.me/VANDY_001_Official" target="_blank" rel="noopener noreferrer" className="text-white hover:text-neon transition-colors inline-flex items-center gap-1.5">
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
            {INTREBARI.map((x) => (
              <Caseta key={x.q} className="p-6">
                <p className="text-white text-sm font-bold mb-2.5">{x.q}</p>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">{x.a}</p>
              </Caseta>
            ))}
          </div>
        </Secventa>

        {/* ——— FINAL ——— */}
        <Secventa className="pt-10">
          <Caseta className="p-8 md:p-12 text-center ring-1 ring-neon/20">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto mb-5">
              În trei zile ai construit ceva, sau ai mai salvat niște postări.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-lg mx-auto mb-8">
              {locuriLibere} locuri libere din {OFERTA.locuriTotal}. {OFERTA.dateText}.
            </p>
            <Buton href="#aplica" className="mx-auto">
              Aplică acum <ArrowRight size={16} />
            </Buton>
          </Caseta>
        </Secventa>

        {/* ——— FOOTER ——— */}
        <footer className="pt-10 pb-4 space-y-4">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-5">
            <p className="text-neutral-600 text-[11px] leading-relaxed">
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
