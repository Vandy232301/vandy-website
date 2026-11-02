import { useEffect, useState } from 'react';
import {
  Play, Check, Clock, ShieldCheck, ArrowRight, CreditCard,
  CalendarPlus, Radio, CalendarClock,
} from 'lucide-react';
import { Caseta, Secventa, Eticheta, Buton } from './components/mentorat/Bucati';
import {
  ANTETE, VIDEO, OFERTA_AVANS, PLATA, INCLUDE, DUPA_PLATA, DISCLAIMER,
} from '../data/prezentare';
import { OFERTA } from '../data/mentorat';
import {
  EVENIMENT, ACOPERA, stareEveniment, secundePanaLa, dataScrisa, linkCalendar, formatRamas,
} from '../data/eveniment';
import { porneste, secundeRamase, format, OFERTA_ORE } from '../lib/fereastraOferta';
import { trimite as pixel } from '../lib/pixel';

const locuriLibere = OFERTA.locuriTotal - OFERTA.locuriLuate;

/**
 * Ceasul ofertei de avans. Pornește la prima vizită și se ține minte 48 de ore
 * — vezi regulile din lib/fereastraOferta.ts. `porneste()` e idempotent, deci
 * nu contează de câte ori se montează componenta.
 */
function useFereastra() {
  const [ramas, setRamas] = useState(() => secundeRamase());
  useEffect(() => {
    porneste();
    setRamas(secundeRamase());
    const ceas = setInterval(() => setRamas(secundeRamase()), 1000);
    return () => clearInterval(ceas);
  }, []);
  return ramas;
}

/**
 * Ceasul până la sesiunea live.
 *
 * Ăsta e singurul cronometru din tot funnelul care e adevărat prin construcție:
 * nu ține minte nimic, nu pornește la vizită, nu se poate reseta. Numără spre
 * o dată fixă din `eveniment.ts`. Dacă sesiunea e joi la 19:00, atât arată —
 * pentru toată lumea, pe orice dispozitiv.
 */
function useCeasSesiune() {
  const [ramas, setRamas] = useState(() => secundePanaLa());
  useEffect(() => {
    const ceas = setInterval(() => setRamas(secundePanaLa()), 1000);
    return () => clearInterval(ceas);
  }, []);
  return ramas;
}

/** Înregistrarea sesiunii. Se arată doar în starea `trecut`. */
function Video() {
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <div className="relative aspect-video bg-black/70">
        {VIDEO.url ? (
          <iframe
            src={VIDEO.url}
            title={ANTETE.trecut.titlu}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          /* Sesiunea a trecut, dar înregistrarea nu e încă pusă. Două mesaje
             diferite, deliberat: pe localhost scrie dezvoltatorului unde pune
             linkul; în producție scrie OMULUI ce urmează. Un vizitator n-are
             ce căuta în fața unui nume de variabilă. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <span className="w-16 h-16 rounded-full border border-neon/30 bg-neon/10 flex items-center justify-center">
              <Play size={22} className="text-neon ml-1" />
            </span>
            {import.meta.env.DEV ? (
              <>
                <p className="text-neutral-300 text-base font-bold">
                  Aici intră înregistrarea de {VIDEO.durata}
                </p>
                <p className="text-neutral-600 text-xs max-w-sm leading-relaxed">
                  Pune linkul de embed în{' '}
                  <code className="text-neutral-500">VIDEO.url</code>, în{' '}
                  <code className="text-neutral-500">src/data/prezentare.ts</code>, și se aprinde
                  singur.
                </p>
              </>
            ) : (
              <>
                <p className="text-neutral-300 text-base font-bold">Înregistrarea urmează.</p>
                <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">
                  O urc în câteva zile și îți trimit linkul pe email, la adresa cu care te-ai
                  înscris.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </Caseta>
  );
}

/**
 * Starea de dinainte de sesiune: confirmare, când e, ce se acoperă, cum intri.
 *
 * Aici NU se vinde nimic. Vezi nota de la ANTETE în data/prezentare.ts.
 */
function InainteDeSesiune() {
  const ramas = useCeasSesiune();
  const cand = dataScrisa();
  const calendar = linkCalendar();

  return (
    <>
      <Caseta radius="rounded-3xl" className="overflow-hidden ring-1 ring-neon/20">
        <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />

        <div className="relative flex flex-col sm:flex-row sm:items-stretch">
          {/* Cronometrul, în coloana lui întunecată. Doar dacă există dată —
              altfel ar fi un afișaj care numără spre nimic. */}
          {cand && (
            <div className="shrink-0 flex flex-col justify-center px-6 md:px-8 py-6 md:py-7 bg-black/40 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
              <span className="flex items-center gap-2">
                <Clock size={13} strokeWidth={2.4} className="shrink-0 text-neon" />
                <Eticheta ton="neon">Începe în</Eticheta>
              </span>
              <p
                aria-hidden
                className="mt-2.5 text-[2.3rem] md:text-[2.75rem] font-bold tracking-[-0.04em] leading-[0.95] tabular-nums text-neon lumina-text"
              >
                {formatRamas(ramas)}
              </p>
              <span className="sr-only">Sesiunea începe {cand}.</span>
              <p className="mt-2 text-neutral-600 text-[11px]">ora României</p>
            </div>
          )}

          <div className="flex-1 px-6 md:px-8 py-6 md:py-7 flex flex-col justify-center gap-3">
            <span className="flex items-center gap-2">
              {cand ? (
                <CalendarClock size={15} className="text-neon shrink-0" />
              ) : (
                <Radio size={15} className="text-neon shrink-0" />
              )}
              <p className="text-white text-lg md:text-xl font-bold leading-snug tracking-tight">
                {cand ? `Live ${cand}` : 'Data se anunță în câteva zile'}
              </p>
            </span>
            <p className="text-neutral-400 text-sm leading-relaxed masura-text">
              {EVENIMENT.durata}
              {EVENIMENT.platforma ? ` · ${EVENIMENT.platforma}` : ''}
              {'. '}
              {EVENIMENT.linkIntrare
                ? 'Linkul de intrare e mai jos și îl primești și pe email.'
                : 'Linkul de intrare vine pe email înainte de sesiune.'}
            </p>

            <div className="flex flex-wrap gap-3 mt-1">
              {EVENIMENT.linkIntrare && (
                <Buton href={EVENIMENT.linkIntrare} padding="px-6 py-3.5 text-sm">
                  <Radio size={16} /> Linkul de intrare
                </Buton>
              )}
              {calendar && (
                <Buton
                  href={calendar}
                  variant={EVENIMENT.linkIntrare ? 'contur' : 'neon'}
                  padding="px-6 py-3.5 text-sm"
                >
                  <CalendarPlus size={16} /> Adaugă în calendar
                </Buton>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex items-start gap-3 px-6 md:px-8 py-4 border-t border-white/[0.06] bg-black/30">
          <ShieldCheck size={15} className="text-neutral-600 shrink-0 mt-0.5" />
          <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed masura-mic">
            Sesiunea e gratuită, fără nicio condiție. Nu ți-am cerut cardul și nu te-ai angajat la
            nimic înscriindu-te.
          </p>
        </div>
      </Caseta>

      <Secventa>
        <Caseta radius="rounded-3xl" className="overflow-hidden">
          <div className="relative p-6 md:p-7">
            <Eticheta ton="mov">Ce vezi în sesiune</Eticheta>
            <ul className="mt-4 flex flex-col gap-3">
              {ACOPERA.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed">
                  <Check size={15} className="text-neon shrink-0 mt-0.5" strokeWidth={2.6} />
                  <span className="masura-mic">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </Caseta>
      </Secventa>

      <Secventa>
        <Caseta radius="rounded-3xl" className="overflow-hidden">
          <div className="relative p-6 md:p-7">
            <Eticheta ton="mov">Un lucru, până atunci</Eticheta>
            <p className="mt-3 text-white text-lg md:text-xl font-bold tracking-tight leading-snug masura-titlu">
              Vino cu un caz concret al tău.
            </p>
            <p className="mt-2.5 text-neutral-400 text-sm leading-relaxed masura-text">
              O firmă pe care o cunoști, un lucru pe care ai vrea să-l vinzi, o problemă pe care ai
              văzut-o la cineva. Cu cât e mai precis, cu atât ce arăt live îți folosește mai mult —
              și dacă îl pui în întrebări, lucrez pe el.
            </p>
          </div>
        </Caseta>
      </Secventa>
    </>
  );
}

/** Oferta cu termen limită: ceasul, avansul, butonul și rândul care le ține cinstite. */
function Oferta() {
  const ramas = useFereastra();
  const activa = ramas > 0;

  return (
    <Caseta
      radius="rounded-3xl"
      className={`overflow-hidden ${activa ? 'ring-1 ring-neon/25' : ''}`}
    >
      <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col sm:flex-row sm:items-stretch">
        {/* Ceasul, în coloana lui întunecată — afișaj, nu număr scris în paragraf. */}
        <div
          className={`shrink-0 flex flex-col justify-center px-6 md:px-8 py-6 md:py-7 bg-black/40 border-b sm:border-b-0 sm:border-r border-white/[0.06] ${
            activa ? '' : 'opacity-70'
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock
              size={13}
              strokeWidth={2.4}
              className={`shrink-0 ${activa ? 'text-neon' : 'text-neutral-500'}`}
            />
            <Eticheta ton={activa ? 'neon' : 'neutral'}>{OFERTA_AVANS.eticheta}</Eticheta>
          </span>
          <p
            aria-hidden
            className={`mt-2.5 text-[2.6rem] md:text-5xl font-bold tracking-[-0.04em] leading-[0.95] tabular-nums ${
              activa ? 'text-neon lumina-text' : 'text-neutral-700'
            }`}
          >
            {format(ramas)}
          </p>
          <span className="sr-only">
            {activa
              ? `Mai ai aproximativ ${Math.ceil(ramas / 3600)} ore din fereastra de avans.`
              : OFERTA_AVANS.expirat}
          </span>
          <p className="mt-2 text-neutral-600 text-[11px]">
            {activa ? `din ${OFERTA_ORE} de ore` : 'închisă'}
          </p>
        </div>

        <div className="flex-1 px-6 md:px-8 py-6 md:py-7 flex flex-col justify-center gap-3">
          <p className="text-white text-xl md:text-2xl font-bold leading-snug tracking-tight text-balance">
            {activa ? OFERTA_AVANS.titlu : OFERTA_AVANS.expirat}
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed masura-lat">
            {activa ? OFERTA_AVANS.text : OFERTA_AVANS.expiratText}
          </p>

          {activa && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1">
              <span className="text-neon text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
                {OFERTA_AVANS.avans} €
              </span>
              <span className="text-neutral-500 text-sm">
                acum · restul de {OFERTA_AVANS.rest} € înainte de zi
              </span>
            </div>
          )}
        </div>
      </div>

      {activa && (
        <div className="relative px-6 md:px-8 py-5 border-t border-white/[0.06] bg-black/25 flex flex-col sm:flex-row sm:items-center gap-4">
          {PLATA.url ? (
            <a
              href={PLATA.url}
              onClick={() => pixel('InitiateCheckout', { value: OFERTA_AVANS.avans, currency: 'EUR' })}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all text-center px-7 py-4 text-base bg-neon text-black hover:brightness-110 hover:-translate-y-0.5 lumina-bloc shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
            >
              <CreditCard size={17} /> Plătesc avansul de {OFERTA_AVANS.avans} €
            </a>
          ) : (
            /* Fără procesator nu există plată automată. Butonul mort ar fi mai
               rău decât lipsa lui: omul apasă, nu se întâmplă nimic, și ai
               pierdut exact clientul care era gata să plătească. */
            <div className="shrink-0 rounded-2xl border border-dashed border-neon/40 bg-neon/[0.04] px-5 py-4">
              <p className="text-neon text-sm font-bold">Aici intră butonul de plată</p>
              <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                Pune linkul în <code className="text-neutral-400">PLATA.url</code>. Vezi nota despre
                expirare din <code className="text-neutral-400">src/data/prezentare.ts</code>.
              </p>
            </div>
          )}
          <p className="text-neutral-500 text-xs leading-relaxed">
            {locuriLibere} {locuriLibere === 1 ? 'loc liber' : 'locuri libere'} din{' '}
            {OFERTA.locuriTotal}. Plata se face pe pagina securizată a procesatorului.
          </p>
        </div>
      )}

      {/* Rândul care face diferența dintre o ofertă și o minciună. Vezi regula 1
          din lib/fereastraOferta.ts — nu-l scoate. */}
      <div className="relative flex items-start gap-3 px-6 md:px-8 py-4 border-t border-white/[0.06] bg-black/30">
        <ShieldCheck size={15} className="text-neutral-600 shrink-0 mt-0.5" />
        <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed masura-lat">
          {OFERTA_AVANS.onest}
        </p>
      </div>
    </Caseta>
  );
}

/**
 * Ce se arată în locul ofertei cât timp nu există link de plată.
 *
 * Nu e o variantă „mai slabă", e singura variantă corectă: un ceas care
 * numără spre un buton inexistent e exact urgența falsă pe care tot
 * lib/fereastraOferta.ts încearcă s-o evite. Fără cale de plată nu afirmăm
 * niciun termen limită — spunem ce urmează, și atât.
 */
function FaraPlata() {
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />
      <div className="relative p-6 md:p-8">
        <Eticheta ton="neon">Ce urmează</Eticheta>
        <p className="mt-3 text-white text-xl md:text-2xl font-bold tracking-tight leading-snug">
          Te caută echipa în 48 de ore.
        </p>
        <p className="mt-2.5 text-neutral-400 text-sm md:text-base leading-relaxed masura-lat">
          Douăzeci de minute: te întrebăm ce vrei să construiești, îți spunem cinstit dacă se poate
          într-o zi, și primești toate detaliile — datele, prețul și condițiile. Decizi după, nu
          acum. Sunt {locuriLibere} {locuriLibere === 1 ? 'loc liber' : 'locuri libere'} din{' '}
          {OFERTA.locuriTotal}.
        </p>
      </div>
      <div className="relative flex items-start gap-3 px-6 md:px-8 py-4 border-t border-white/[0.06] bg-black/30">
        <ShieldCheck size={15} className="text-neutral-600 shrink-0 mt-0.5" />
        <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed masura-lat">
          Nu plătești nimic acum și nu te-ai angajat la nimic lăsându-ți datele.
        </p>
      </div>
    </Caseta>
  );
}

/** Partea de vânzare. Se arată DOAR după ce sesiunea a avut loc. */
function DupaSesiune() {
  return (
    <>
      <Video />

      {/* Oferta stă imediat sub înregistrare, nu la subsol: omul care termină
          de ascultat trebuie să poată apăsa fără să caute.

          Dar se arată DOAR dacă există cale de plată. Pe localhost o vedem
          oricum, ca să poată fi lucrată; în producție, fără link, ar fi un
          termen limită spre nicăieri. Vezi FaraPlata mai sus. */}
      {PLATA.url || import.meta.env.DEV ? <Oferta /> : <FaraPlata />}

      <Secventa>
        <div className="grid md:grid-cols-2 gap-4">
          <Caseta radius="rounded-3xl" className="overflow-hidden">
            <div className="relative p-6 md:p-7">
              <Eticheta ton="mov">Ce intră în preț</Eticheta>
              <ul className="mt-4 flex flex-col gap-3">
                {INCLUDE.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed">
                    <Check size={15} className="text-neon shrink-0 mt-0.5" strokeWidth={2.6} />
                    <span className="masura-lat">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Caseta>

          <Caseta radius="rounded-3xl" className="overflow-hidden">
            <div className="relative p-6 md:p-7">
              <Eticheta ton="mov">Ce se întâmplă după plată</Eticheta>
              <ol className="mt-4 flex flex-col gap-4">
                {DUPA_PLATA.map((p, i) => (
                  <li key={p.titlu} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full border border-mov/35 bg-mov/10 text-mov text-[11px] font-bold flex items-center justify-center tabular-nums">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-bold leading-snug">{p.titlu}</p>
                      <p className="text-neutral-500 text-xs leading-relaxed mt-0.5 masura-lat">
                        {p.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Caseta>
        </div>
      </Secventa>

      <Secventa>
        <Caseta radius="rounded-3xl" className="overflow-hidden">
          <div className="relative p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
            <p className="flex-1 text-neutral-300 text-sm leading-relaxed masura-lat">
              Vrei să recitești ce pleci cu, înainte să decizi? Pagina masterclass-ului e tot
              acolo, cu totul explicat pe larg.
            </p>
            <Buton href="/mentorat" variant="contur" className="shrink-0">
              Recitesc detaliile <ArrowRight size={15} />
            </Buton>
          </div>
        </Caseta>
      </Secventa>
    </>
  );
}

export default function Prezentare() {
  /* Starea e citită o dată, la montare. Dacă sesiunea începe exact cât omul
     stă pe pagină, cronometrul ajunge la zero și o reîncărcare îl trece pe
     partea cealaltă — nu schimbăm pagina sub el în secunda aia. */
  const stare = stareEveniment();
  const antet = ANTETE[stare];

  useEffect(() => { pixel('ViewContent'); }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon/30 font-sans tracking-tight p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />
      <div className="fixed -top-56 left-1/2 -translate-x-1/2 w-[760px] h-[440px] z-0 rounded-full bg-neon/[0.05] blur-[140px] pointer-events-none" />
      <div className="fixed top-[55%] -left-40 w-[640px] h-[640px] z-0 rounded-full bg-mov/[0.06] blur-[150px] pointer-events-none" />
      <div className="granulatie fixed inset-0 z-0 pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 flex flex-col gap-4 pb-16">
        <header className="flex flex-row justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white tracking-wide">VANDY</h1>
          <Eticheta ton="mov">{OFERTA.tip} · {OFERTA.numeProgram}</Eticheta>
        </header>

        <div className="px-1 md:px-2">
          <Eticheta ton="neon">{antet.eticheta}</Eticheta>
          <h2 className="mt-3 text-[1.9rem] md:text-[2.6rem] font-bold text-white tracking-tight leading-[1.1] echilibrat">
            {antet.titlu}
          </h2>
          <p className="mt-4 text-neutral-400 text-base md:text-lg leading-relaxed masura-text">
            {antet.text}
          </p>
        </div>

        {stare === 'trecut' ? <DupaSesiune /> : <InainteDeSesiune />}

        <p className="px-2 pt-2 text-neutral-600 text-[11px] leading-relaxed masura-mic">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
