import React, { useRef, useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { FORMULAR, CONFIRMARE } from '../../../data/gratuit';
import { Eticheta } from './Bucati';
import { validPrenume, validEmail, curataNume, curataEmail } from '../../../lib/validare';
import { trimite as pixel } from '../../../lib/pixel';

/** Pasul 2: pagina cu detaliile sesiunii. Rută definită în vercel.json. */
const DESTINATIE = '/prezentare';

type Camp = 'prenume' | 'email';

const GOL: Record<Camp, string> = { prenume: '', email: '' };

const REGULI: Record<Camp, (v: string) => string | null> = {
  prenume: validPrenume,
  email: validEmail,
};

const ORDINEA: Camp[] = ['prenume', 'email'];

/** Ce nu are ce căuta în câmp, filtrat pe măsură ce se tastează. Mai blând
 *  decât o eroare roșie: caracterul pur și simplu nu apare. */
const FILTRE: Record<Camp, (v: string) => string> = {
  prenume: (v) => v.replace(/[^\p{L}\p{M}'’\- ]/gu, '').slice(0, 40),
  email: (v) => v.replace(/\s/g, '').slice(0, 160),
};

const eticheteCamp = 'block text-xs font-semibold text-neutral-400 mb-2';
const campBaza =
  'w-full bg-black/40 border rounded-xl px-4 py-3.5 text-base text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 transition-colors';
const campBun = 'border-neutral-800 focus:border-neon/60 focus:ring-neon/25';
const campRau = 'border-red-500/60 focus:border-red-500 focus:ring-red-500/25';

/**
 * Formularul scurt, pentru traficul din reclame. DOUĂ câmpuri.
 *
 * Fratele lui mare, `Formular.tsx`, are șapte și e corect așa: acolo vine omul
 * care caută masterclass-ul, iar răspunsurile pregătesc un apel. Aici vine
 * omul care a dat click pe o reclamă acum opt secunde și nu te cunoaște —
 * fiecare câmp în plus e o parte din înscrieri pierdută. Calificarea se mută
 * după sesiune. Vezi `ops/funnel.md` §1, decizia 3.
 *
 * Câmpurile sunt `text-base` (16px), nu `text-sm`: pe iOS orice input sub 16px
 * face Safari să mărească pagina la focus, iar pagina sărită din loc în
 * momentul în care omul începe să scrie e cel mai scump bug posibil aici.
 */
export function FormularScurt() {
  const [trimis, setTrimis] = useState(false);
  const [form, setForm] = useState(GOL);
  const [erori, setErori] = useState<Partial<Record<Camp, string>>>({});
  const [eroareGenerala, setEroareGenerala] = useState('');
  const [seTrimite, setSeTrimite] = useState(false);
  const [acord, setAcord] = useState(false);
  const campuri = useRef<Partial<Record<Camp, HTMLInputElement | null>>>({});

  const schimba = (e: React.ChangeEvent<HTMLInputElement>) => {
    const camp = e.target.name as Camp;
    const valoare = FILTRE[camp](e.target.value);
    setForm((p) => ({ ...p, [camp]: valoare }));
    if (erori[camp] && !REGULI[camp](valoare)) setErori((p) => ({ ...p, [camp]: undefined }));
    if (eroareGenerala) setEroareGenerala('');
  };

  const verifica = (camp: Camp) => {
    setErori((p) => ({ ...p, [camp]: REGULI[camp](form[camp]) || undefined }));
  };

  const inscrie = async () => {
    const gasite: Partial<Record<Camp, string>> = {};
    for (const camp of ORDINEA) {
      const problema = REGULI[camp](form[camp]);
      if (problema) gasite[camp] = problema;
    }
    setErori(gasite);

    const primul = ORDINEA.find((c) => gasite[c]);
    if (primul) {
      campuri.current[primul]?.focus();
      return;
    }
    if (!acord) return setEroareGenerala('Bifează acordul ca să-ți pot trimite linkul.');

    setSeTrimite(true);
    setEroareGenerala('');
    try {
      const res = await fetch('/api/inscriere-gratuit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenume: curataNume(form.prenume),
          email: curataEmail(form.email),
        }),
      });
      const date = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(date?.error || 'Înscrierea a eșuat.');

      // Evenimentul de conversie, trimis DOAR după ce serverul a confirmat.
      // Dacă l-am trimite la apăsarea butonului, campania ar învăța din
      // înscrieri care n-au existat și ar optimiza spre oamenii greșiți.
      pixel('Lead');

      setTrimis(true);
      window.location.href = DESTINATIE;
    } catch (err) {
      setEroareGenerala(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Nu am putut trimite datele. Scrie-mi pe Instagram @vandy_o1 și te adaug manual.',
      );
    } finally {
      setSeTrimite(false);
    }
  };

  if (trimis) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10 px-6">
        <CheckCircle2
          size={40}
          className="text-neon drop-shadow-[0_0_18px_rgba(57,255,20,0.55)]"
          strokeWidth={1.5}
        />
        <h3 className="text-2xl font-bold text-white tracking-tight">{CONFIRMARE.titlu}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed masura-text">{CONFIRMARE.text}</p>
        <a
          href={DESTINATIE}
          className="text-neon text-sm font-bold hover:underline inline-flex items-center gap-1.5"
        >
          {CONFIRMARE.link} <ArrowRight size={15} />
        </a>
      </div>
    );
  }

  const Mesaj = ({ camp }: { camp: Camp }) =>
    erori[camp] ? (
      <p id={`eroare-${camp}`} role="alert" className="flex items-start gap-1.5 text-red-400 text-[11px] mt-2">
        <AlertCircle size={12} className="mt-px shrink-0" />
        {erori[camp]}
      </p>
    ) : null;

  const propsCamp = (camp: Camp) => ({
    id: camp,
    name: camp,
    value: form[camp],
    onChange: schimba,
    onBlur: () => verifica(camp),
    'aria-invalid': Boolean(erori[camp]),
    'aria-describedby': erori[camp] ? `eroare-${camp}` : undefined,
    className: `${campBaza} ${erori[camp] ? campRau : campBun}`,
  });

  return (
    <div className="p-6 md:p-8">
      <div className="space-y-2 mb-6">
        <Eticheta ton="neon">{FORMULAR.eticheta}</Eticheta>
        <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-[1.15]">
          {FORMULAR.titlu}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed masura-text">{FORMULAR.text}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prenume" className={eticheteCamp}>Prenume</label>
          <input
            {...propsCamp('prenume')}
            ref={(el) => { campuri.current.prenume = el; }}
            placeholder="Andrei"
            autoComplete="given-name"
          />
          <Mesaj camp="prenume" />
        </div>

        <div>
          <label htmlFor="email" className={eticheteCamp}>Email</label>
          <input
            {...propsCamp('email')}
            ref={(el) => { campuri.current.email = el; }}
            type="email"
            placeholder="numele@exemplu.ro"
            autoComplete="email"
            inputMode="email"
            onKeyDown={(e) => { if (e.key === 'Enter' && !seTrimite) inscrie(); }}
          />
          <Mesaj camp="email" />
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acord}
            onChange={(e) => { setAcord(e.target.checked); if (eroareGenerala) setEroareGenerala(''); }}
            className="mt-0.5 w-4 h-4 shrink-0 accent-neon"
          />
          <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
            {FORMULAR.acord}
          </span>
        </label>

        {eroareGenerala && (
          <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
            {eroareGenerala}
          </p>
        )}

        <button
          type="button"
          onClick={inscrie}
          disabled={seTrimite}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 bg-neon text-black text-base font-bold tracking-tight lumina-bloc hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {seTrimite ? (
            <><Loader2 size={16} className="animate-spin" /> {FORMULAR.butonTrimite}</>
          ) : (
            <>{FORMULAR.buton} <ArrowRight size={17} /></>
          )}
        </button>

        <p className="text-neutral-600 text-[11px] text-center">{FORMULAR.subButon}</p>
      </div>
    </div>
  );
}
