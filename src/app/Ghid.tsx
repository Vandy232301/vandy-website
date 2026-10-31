import React, { useRef, useState } from 'react';
import {
  Target, MonitorPlay, Tag, Users, Check, X, Play,
  Loader2, ArrowRight, AlertCircle, FileText, Lock,
} from 'lucide-react';
import { Caseta, Secventa, Eticheta, Buton } from './components/mentorat/Bucati';
import { HERO, PRIMESTI, PENTRU_CINE, VIDEO, LISTA, LIVRARE, PUNTE, DISCLAIMER } from '../data/ghid';
import { validNume, validEmail, curataNume, curataEmail } from '../lib/validare';

const ICOANE = { tinta: Target, ecran: MonitorPlay, eticheta: Tag, oameni: Users } as const;

/**
 * Ține minte că omul a cerut deja ghidul, ca să nu-i cerem emailul a doua
 * oară când se întoarce din email pe pagină — exact drumul pe care îl va face.
 *
 * `localStorage`, nu `sessionStorage`: aici chiar vrem să supraviețuiască
 * închiderii filei. Și nu un token de la server: e un ghid gratuit, nimeni
 * n-are ce fura punând un rând în storage. Totul în try/catch, fiindcă în
 * navigare privată sau cu date blocate accesul aruncă — iar atunci pagina
 * doar cere emailul din nou, ceea ce nu strică nimic.
 */
const CHEIE = 'vandy-ghid-livrat';

function amPrimitDeja(): boolean {
  try {
    return localStorage.getItem(CHEIE) === '1';
  } catch {
    return false;
  }
}

function tineMinte() {
  try {
    localStorage.setItem(CHEIE, '1');
  } catch {
    /* rămâne doar pe durata vizitei; livrarea se vede oricum acum */
  }
}

type Camp = 'nume' | 'email';
const ORDINEA: Camp[] = ['nume', 'email'];
const REGULI: Record<Camp, (v: string) => string | null> = { nume: validNume, email: validEmail };
const FILTRE: Record<Camp, (v: string) => string> = {
  nume: (v) => v.replace(/[^\p{L}\p{M}'’\-. ]/gu, '').slice(0, 80),
  email: (v) => v.replace(/\s/g, '').slice(0, 160),
};

const campBaza =
  'w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 transition-colors';
const campBun = 'border-neutral-800 focus:border-neon/60 focus:ring-neon/25';
const campRau = 'border-red-500/60 focus:border-red-500 focus:ring-red-500/25';

/**
 * Formularul magnetului: două câmpuri, nimic altceva.
 *
 * Pagina de masterclass cere șapte, fiindcă acolo omul aplică pentru un apel
 * și fiecare răspuns în plus califică. Aici e fix invers — fiecare câmp în
 * plus e un om pierdut. Nume și email, atât.
 */
function FormularGhid({ laReusita }: { laReusita: () => void }) {
  const [form, setForm] = useState<Record<Camp, string>>({ nume: '', email: '' });
  const [erori, setErori] = useState<Partial<Record<Camp, string>>>({});
  const [eroareGenerala, setEroareGenerala] = useState('');
  const [seTrimite, setSeTrimite] = useState(false);
  const campuri = useRef<Partial<Record<Camp, HTMLInputElement | null>>>({});

  const schimba = (e: React.ChangeEvent<HTMLInputElement>) => {
    const camp = e.target.name as Camp;
    const valoare = FILTRE[camp](e.target.value);
    setForm((p) => ({ ...p, [camp]: valoare }));
    if (erori[camp] && !REGULI[camp](valoare)) setErori((p) => ({ ...p, [camp]: undefined }));
    if (eroareGenerala) setEroareGenerala('');
  };

  const trimite = async () => {
    const gasite: Partial<Record<Camp, string>> = {};
    for (const camp of ORDINEA) {
      const problema = REGULI[camp](form[camp]);
      if (problema) gasite[camp] = problema;
    }
    setErori(gasite);
    const primul = ORDINEA.find((c) => gasite[c]);
    if (primul) return campuri.current[primul]?.focus();

    setSeTrimite(true);
    setEroareGenerala('');
    try {
      const res = await fetch('/api/ghid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nume: curataNume(form.nume), email: curataEmail(form.email) }),
      });
      const date = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(date?.error || 'Trimiterea a eșuat.');
      laReusita();
    } catch (err) {
      setEroareGenerala(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Nu am putut trimite. Verifică conexiunea și încearcă din nou.',
      );
      setSeTrimite(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {ORDINEA.map((camp) => (
          <div key={camp}>
            <input
              ref={(el) => { campuri.current[camp] = el; }}
              name={camp}
              type={camp === 'email' ? 'email' : 'text'}
              value={form[camp]}
              onChange={schimba}
              onBlur={() => setErori((p) => ({ ...p, [camp]: REGULI[camp](form[camp]) || undefined }))}
              onKeyDown={(e) => e.key === 'Enter' && trimite()}
              placeholder={camp === 'nume' ? 'Numele tău' : 'Emailul tău'}
              aria-label={camp === 'nume' ? 'Numele tău' : 'Emailul tău'}
              aria-invalid={!!erori[camp]}
              className={`${campBaza} ${erori[camp] ? campRau : campBun}`}
            />
            {erori[camp] && (
              <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                {erori[camp]}
              </p>
            )}
          </div>
        ))}
      </div>

      <Buton onClick={trimite} padding="px-7 py-4 text-base" className="w-full">
        {seTrimite ? (
          <><Loader2 size={17} className="animate-spin" /> Se trimite…</>
        ) : (
          <>Trimite-mi ghidul <ArrowRight size={17} /></>
        )}
      </Buton>

      {eroareGenerala && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle size={13} className="shrink-0" />
          {eroareGenerala}
        </p>
      )}

      <p className="text-neutral-500 text-[11px] leading-relaxed flex items-start gap-1.5">
        <Lock size={11} className="shrink-0 mt-0.5" />
        Fără spam. Te poți dezabona dintr-un clic, din orice email.
      </p>
    </div>
  );
}

/** Ce vede omul imediat după ce a lăsat datele. E livrarea, nu o confirmare. */
function Livrare() {
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden ring-1 ring-neon/25">
      <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />

      <div className="relative p-6 md:p-8">
        <Eticheta ton="neon">{LIVRARE.titlu}</Eticheta>
        <p className="mt-3 text-neutral-300 text-sm md:text-base leading-relaxed masura-lat">
          {VIDEO.url ? LIVRARE.text : LIVRARE.fara}
        </p>

        <div className="mt-6 aspect-video rounded-2xl overflow-hidden border border-white/[0.08] bg-black/60">
          {VIDEO.url ? (
            <iframe
              src={VIDEO.url}
              title={HERO.titlu}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            /* Locul gol, arătat ca atare. Vezi comentariul de pe VIDEO în
               data/ghid.ts: fără înregistrare nu există magnet, și o pagină
               care pretinde că livrează ceva inexistent e exact problema. */
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
              <span className="w-14 h-14 rounded-full border border-neon/30 bg-neon/10 flex items-center justify-center">
                <Play size={20} className="text-neon ml-0.5" />
              </span>
              <p className="text-neutral-400 text-sm font-semibold">
                Aici intră videoul de {VIDEO.durata}
              </p>
              <p className="text-neutral-600 text-xs max-w-xs leading-relaxed">
                Nu e încă înregistrat. Pune linkul în <code className="text-neutral-500">VIDEO.url</code>,
                în <code className="text-neutral-500">src/data/ghid.ts</code>, și se aprinde singur.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-start gap-3 px-6 md:px-8 py-5 border-t border-white/[0.06] bg-black/25">
        <FileText size={16} className="text-mov shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-white text-sm font-bold">{LISTA.titlu}</p>
          <p className="text-neutral-500 text-xs leading-relaxed mt-0.5">
            {LISTA.fisier ? LISTA.text : 'Se pregătește. Îți vine pe email, în același mesaj cu videoul.'}
          </p>
        </div>
        {LISTA.fisier && (
          <a
            href={LISTA.fisier}
            download
            className="ml-auto shrink-0 text-xs font-bold text-neon hover:underline"
          >
            Descarcă
          </a>
        )}
      </div>
    </Caseta>
  );
}

export default function Ghid() {
  const [livrat, setLivrat] = useState(amPrimitDeja);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon/30 font-sans tracking-tight p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />
      <div className="fixed -top-56 left-1/2 -translate-x-1/2 w-[760px] h-[440px] z-0 rounded-full bg-neon/[0.05] blur-[140px] pointer-events-none" />
      <div className="fixed top-[55%] -left-40 w-[640px] h-[640px] z-0 rounded-full bg-mov/[0.06] blur-[150px] pointer-events-none" />
      <div className="granulatie fixed inset-0 z-0 pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col gap-4 pb-16">
        <header className="flex flex-row justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white tracking-wide">VANDY</h1>
          <Eticheta ton="mov">{HERO.eticheta}</Eticheta>
        </header>

        {/* Hero. Formularul stă aici, nu la subsol: pe o pagină cu o singură
            treabă, omul decide în primele cinci secunde. Dacă trebuie să
            deruleze ca să-l găsească, l-ai pierdut. */}
        <Caseta radius="rounded-3xl" className="overflow-hidden">
          <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />
          <div className="relative p-6 md:p-10">
            <h2 className="text-[2rem] md:text-[2.9rem] font-bold text-white tracking-tight leading-[1.08] echilibrat">
              {HERO.titlu}
            </h2>
            <p className="mt-5 text-neutral-400 text-base md:text-lg leading-relaxed masura-lat">
              {HERO.subtitlu}
            </p>

            <div className="mt-8">
              {livrat ? (
                <Livrare />
              ) : (
                <>
                  <p className="text-neon text-sm font-bold mb-3">{HERO.nota}</p>
                  <FormularGhid
                    laReusita={() => {
                      tineMinte();
                      setLivrat(true);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </Caseta>

        {/* Ce e în video. Patru celule într-un singur obiect, cu fire interioare
            de un pixel — aceeași construcție ca grila de încredere de pe
            /mentorat, ca cele două pagini să pară din aceeași mână. */}
        <Secventa>
          <Caseta radius="rounded-3xl" className="overflow-hidden">
            <div className="relative px-6 md:px-8 pt-6 md:pt-7">
              <Eticheta ton="mov">Ce înveți, concret</Eticheta>
            </div>
            <div className="relative grid sm:grid-cols-2 mt-5 -ml-px">
              {PRIMESTI.map((p) => {
                const Icoana = ICOANE[p.icon];
                return (
                  <div
                    key={p.titlu}
                    className="border-t border-l border-white/[0.06] p-6 md:p-7 flex flex-col gap-2.5"
                  >
                    <span className="w-9 h-9 rounded-lg bg-mov/10 border border-mov/25 flex items-center justify-center">
                      <Icoana size={16} className="text-mov" />
                    </span>
                    <p className="text-white text-base font-bold leading-snug">{p.titlu}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed masura-lat">{p.text}</p>
                  </div>
                );
              })}
            </div>
          </Caseta>
        </Secventa>

        {/* Pentru cine / pentru cine nu. Un magnet care nu respinge pe nimeni
            aduce liste moarte: oamenii greșiți nu cumpără niciodată și strică
            rata de deschidere pentru cei buni. */}
        <Secventa>
          <Caseta radius="rounded-3xl" className="overflow-hidden">
            <div className="relative p-6 md:p-8">
              <Eticheta ton="mov">{PENTRU_CINE.eticheta}</Eticheta>
              <p className="mt-3 text-white text-xl md:text-2xl font-bold tracking-tight leading-snug">
                {PENTRU_CINE.titlu}
              </p>
            </div>
            <div className="relative grid md:grid-cols-2 border-t border-white/[0.06]">
              <ul className="p-6 md:p-8 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-white/[0.06]">
                {PENTRU_CINE.da.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed">
                    <Check size={15} className="text-neon shrink-0 mt-0.5" strokeWidth={2.6} />
                    <span className="masura-lat">{r}</span>
                  </li>
                ))}
              </ul>
              <ul className="p-6 md:p-8 flex flex-col gap-3 bg-black/20">
                {PENTRU_CINE.nu.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-neutral-500 text-sm leading-relaxed">
                    <X size={15} className="text-neutral-600 shrink-0 mt-0.5" strokeWidth={2.6} />
                    <span className="masura-lat">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Caseta>
        </Secventa>

        {/* Puntea. Spune pe față ce NU e în ghid — de aia se crede ce zice că este. */}
        <Secventa>
          <Caseta radius="rounded-3xl" className="overflow-hidden">
            <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 min-w-0">
                <Eticheta ton="neon">{PUNTE.eticheta}</Eticheta>
                <p className="mt-3 text-white text-xl md:text-2xl font-bold tracking-tight leading-snug">
                  {PUNTE.titlu}
                </p>
                <p className="mt-2.5 text-neutral-400 text-sm leading-relaxed masura-lat">
                  {PUNTE.text}
                </p>
              </div>
              <Buton href={PUNTE.href} variant="contur" className="shrink-0">
                {PUNTE.buton} <ArrowRight size={15} />
              </Buton>
            </div>
          </Caseta>
        </Secventa>

        <p className="px-2 pt-2 text-neutral-600 text-[11px] leading-relaxed masura-lat">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
