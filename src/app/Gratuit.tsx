import { useEffect } from 'react';
import { Check, CalendarClock, Radio, ShieldCheck } from 'lucide-react';
import { Caseta, Secventa, Eticheta } from './components/mentorat/Bucati';
import { FormularScurt } from './components/mentorat/FormularScurt';
import { ANTET, BENEFICII, TEASER, DOVADA, DISCLAIMER } from '../data/gratuit';
import { EVENIMENT, dataScrisa } from '../data/eveniment';
import { vizita } from '../lib/pixel';

/**
 * Rândul care spune CÂND e sesiunea.
 *
 * Cât timp data nu e stabilită, spune cinstit că o trimit pe email. Nu inventăm
 * o dată și nu punem un cronometru spre nimic — aceeași regulă ca la VSL și la
 * linkul de plată.
 */
function Cand() {
  const cand = dataScrisa();
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-9 h-9 rounded-full border border-neon/30 bg-neon/[0.07] flex items-center justify-center mt-0.5">
        {cand ? (
          <CalendarClock size={17} className="text-neon" />
        ) : (
          <Radio size={17} className="text-neon" />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-white text-base font-bold leading-snug">
          {cand ? `Live ${cand}` : 'Live, în direct — data se anunță în câteva zile'}
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed mt-0.5">
          {EVENIMENT.durata}
          {EVENIMENT.platforma ? ` · ${EVENIMENT.platforma}` : ''}
          {cand ? '' : ' · îți trimit data și linkul pe email'}
        </p>
      </div>
    </div>
  );
}

/** Clipul scurt. Nu se randează deloc dacă nu există — vezi nota din data/gratuit.ts. */
function Teaser() {
  if (!TEASER.url) return null;
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <div className="relative aspect-video bg-black/70">
        <iframe
          src={TEASER.url}
          title={ANTET.subtitlu}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </Caseta>
  );
}

/**
 * /gratuit — pagina de aterizare pentru reclame.
 *
 * Un singur lucru de făcut: înscrierea. Fără meniu, fără linkuri care duc în
 * altă parte, fără subsol cu navigație. Tot ce poate fi apăsat pe pagina asta
 * duce în formular. Un click către altceva e un click plătit și pierdut.
 */
export default function Gratuit() {
  useEffect(() => { vizita(); }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon/30 font-sans tracking-tight p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />
      <div className="fixed -top-56 left-1/2 -translate-x-1/2 w-[760px] h-[440px] z-0 rounded-full bg-neon/[0.05] blur-[140px] pointer-events-none" />
      <div className="fixed top-[55%] -left-40 w-[640px] h-[640px] z-0 rounded-full bg-mov/[0.06] blur-[150px] pointer-events-none" />
      <div className="granulatie fixed inset-0 z-0 pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-5 pb-16">
        {/* Numele, nu un meniu. Nu e link: n-are unde să ducă de pe pagina asta. */}
        <header className="py-4">
          <p className="text-2xl font-bold text-white tracking-wide">VANDY</p>
        </header>

        {/*
          Ordinea din DOM e ordinea de pe TELEFON: titlu → formular → restul.
          Pe desktop, clasele `lg:col-start` / `lg:row-start` le pun înapoi în
          două coloane, cu formularul în dreapta pe toată înălțimea.

          Nu e o preferință de aranjare. Pe mobil, cu formularul la coadă,
          vizitatorul trebuia să treacă prin titlu, intro, panoul sesiunii,
          cinci beneficii și blocul de dovadă ca să ajungă la două câmpuri — iar
          pe trafic plătit fiecare derulare în plus e o parte din oameni care nu
          mai ajung acolo. Acum formularul e la a doua privire.
        */}
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5 items-start">
          {/* ── Titlul ──────────────────────────────────────────────────── */}
          <div className="lg:col-start-1 lg:row-start-1 min-w-0">
            <div className="px-1 md:px-2">
              <Eticheta ton="neon">{ANTET.eticheta}</Eticheta>
              {/* Titlul owner-ului. E lung, deci `echilibrat` îi împarte rândurile
                  egal în loc să lase un cuvânt singur pe ultimul rând. */}
              <h1 className="mt-3 text-[1.75rem] md:text-[2.4rem] font-bold text-white tracking-tight leading-[1.12] echilibrat">
                {ANTET.titlu}
              </h1>
              <p className="mt-4 text-neutral-200 text-base md:text-lg font-semibold leading-snug masura-intro">
                {ANTET.subtitlu}
              </p>
              <p className="mt-3 text-neutral-400 text-sm md:text-base leading-relaxed masura-text">
                {ANTET.text}
              </p>
            </div>
          </div>

          {/* ── Coloana de acțiune ──────────────────────────────────────────
              Lipită sus pe desktop: oricât derulează omul prin argument,
              formularul rămâne în ecran. Pe mobil vine imediat sub titlu. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-6 min-w-0">
            <Caseta radius="rounded-3xl" className="overflow-hidden ring-1 ring-neon/20">
              <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />
              <div className="relative">
                <FormularScurt />
              </div>
            </Caseta>
          </div>

          {/* ── Argumentul ──────────────────────────────────────────────── */}
          <div className="lg:col-start-1 lg:row-start-2 flex flex-col gap-5 min-w-0">
            <Teaser />

            <Caseta radius="rounded-3xl" className="overflow-hidden">
              <div className="relative p-6 md:p-7 flex flex-col gap-5">
                <Cand />
                <div className="h-px bg-white/[0.06]" />
                <div>
                  <Eticheta ton="mov">Ce vezi în sesiune</Eticheta>
                  <ul className="mt-4 flex flex-col gap-3">
                    {BENEFICII.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed">
                        <Check size={15} className="text-neon shrink-0 mt-0.5" strokeWidth={2.6} />
                        <span className="masura-mic">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Caseta>

            <Secventa>
              <Caseta radius="rounded-3xl" className="overflow-hidden">
                <div className="relative p-6 md:p-7">
                  <Eticheta ton="mov">{DOVADA.eticheta}</Eticheta>
                  <p className="mt-3 text-white text-lg md:text-xl font-bold tracking-tight leading-snug masura-titlu">
                    {DOVADA.titlu}
                  </p>
                  <p className="mt-2.5 text-neutral-400 text-sm leading-relaxed masura-text">
                    {DOVADA.text}
                  </p>
                </div>
              </Caseta>
            </Secventa>
          </div>
        </div>

        {/* Disclaimerul. Stă sub tot, dar pe pagină, nu ascuns după un link —
            vezi nota din data/gratuit.ts. Nu-l muta și nu-l scoate. */}
        <div className="flex items-start gap-3 px-2 pt-3">
          <ShieldCheck size={15} className="text-neutral-600 shrink-0 mt-0.5" />
          <p className="text-neutral-600 text-[11px] leading-relaxed masura-mic">
            {DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
