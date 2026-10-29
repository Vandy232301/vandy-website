import React, { useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { OPTIUNI_DIRECTIE, OPTIUNI_STADIU, locuriLibere } from '../../../data/mentorat';
import { Eticheta } from './Bucati';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFON_REGEX = /^[\d\s+\-().]{7,20}$/;

type Stare = 'formular' | 'trimis';

const GOL = {
  nume: '',
  email: '',
  telefon: '',
  directie: '',
  stadiu: '',
  ceVreiSaConstruiesti: '',
};

function valideaza(f: typeof GOL): string | null {
  if (f.nume.trim().length < 3) return 'Scrie numele complet.';
  if (!EMAIL_REGEX.test(f.email.trim())) return 'Adresa de email nu pare validă.';
  if (!TELEFON_REGEX.test(f.telefon.trim())) return 'Numărul de telefon nu pare valid.';
  if (!f.directie) return 'Alege o direcție. Dacă nu știi, alege ultima opțiune.';
  if (!f.stadiu) return 'Spune-mi unde ești acum.';
  if (f.ceVreiSaConstruiesti.trim().length < 20)
    return 'Scrie câteva cuvinte în plus la ultima întrebare — pe baza ei decid cine intră.';
  return null;
}

const eticheteCamp = 'block text-xs font-semibold text-neutral-400 mb-2';
const camp =
  'w-full bg-black/40 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/25 transition-colors';

export function Formular() {
  const [stare, setStare] = useState<Stare>('formular');
  const [form, setForm] = useState(GOL);
  const [eroare, setEroare] = useState('');
  const [seTrimite, setSeTrimite] = useState(false);
  const [acord, setAcord] = useState(false);

  const schimba = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (eroare) setEroare('');
  };

  const trimite = async () => {
    const problema = valideaza(form);
    if (problema) return setEroare(problema);
    if (!acord) return setEroare('Bifează acordul ca să pot să te contactez.');

    setSeTrimite(true);
    setEroare('');
    try {
      const res = await fetch('/api/aplica-mentorat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const date = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(date?.error || 'Trimiterea a eșuat.');
      setStare('trimis');
    } catch (err) {
      setEroare(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Nu am putut trimite aplicarea. Scrie-mi direct pe Instagram @vandy_o1 și o rezolvăm.',
      );
    } finally {
      setSeTrimite(false);
    }
  };

  if (stare === 'trimis') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10 px-6">
        <CheckCircle2
          size={40}
          className="text-neon drop-shadow-[0_0_18px_rgba(57,255,20,0.55)]"
          strokeWidth={1.5}
        />
        <h3 className="text-xl font-bold text-white tracking-tight">Am primit aplicarea.</h3>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
          Te sun în maximum 48 de ore de pe un număr din România. Apelul durează 20 de minute și la
          finalul lui știi dacă ai loc în serie.
        </p>
        <p className="text-neutral-600 text-xs max-w-md">
          Dacă nu prinzi apelul, te caut încă o dată. Ți-am trimis și un email de confirmare —
          verifică și în Spam, prima dată ajunge uneori acolo.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="space-y-2 mb-7">
        <Eticheta>Pasul 1 din 2</Eticheta>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Aplică pentru unul din {locuriLibere} locuri
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Completezi, te sun în 48 de ore, și dacă ne potrivim primești un loc. Nu plătești nimic
          până la apel.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nume" className={eticheteCamp}>Nume și prenume</label>
            <input id="nume" name="nume" value={form.nume} onChange={schimba} className={camp} placeholder="Andrei Popescu" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="telefon" className={eticheteCamp}>Telefon</label>
            <input id="telefon" name="telefon" value={form.telefon} onChange={schimba} className={camp} placeholder="07xx xxx xxx" autoComplete="tel" inputMode="tel" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={eticheteCamp}>Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={schimba} className={camp} placeholder="numele@exemplu.ro" autoComplete="email" inputMode="email" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="directie" className={eticheteCamp}>Ce direcție te interesează</label>
            <select id="directie" name="directie" value={form.directie} onChange={schimba} className={`${camp} appearance-none`}>
              <option value="">Alege...</option>
              {OPTIUNI_DIRECTIE.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stadiu" className={eticheteCamp}>Unde ești acum</label>
            <select id="stadiu" name="stadiu" value={form.stadiu} onChange={schimba} className={`${camp} appearance-none`}>
              <option value="">Alege...</option>
              {OPTIUNI_STADIU.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="ceVreiSaConstruiesti" className={eticheteCamp}>
            Ce vrei să construiești sau să vinzi? Scrie-mi concret.
          </label>
          <textarea
            id="ceVreiSaConstruiesti"
            name="ceVreiSaConstruiesti"
            value={form.ceVreiSaConstruiesti}
            onChange={schimba}
            rows={4}
            className={`${camp} resize-none`}
            placeholder="Ex: am o firmă de instalații și vreau o aplicație care îmi preia cererile de ofertă și le calculează singură."
          />
          <p className="text-neutral-600 text-[11px] mt-2">
            Răspunsul ăsta e cel care decide. Două rânduri serioase bat o pagină de generalități.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acord}
            onChange={(e) => { setAcord(e.target.checked); if (eroare) setEroare(''); }}
            className="mt-0.5 w-4 h-4 shrink-0 accent-neon"
          />
          <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
            Sunt de acord să fiu contactat telefonic și pe email în legătură cu această aplicare.
            Datele nu ajung la nimeni altcineva și le poți cere șterse oricând.
          </span>
        </label>

        {eroare && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
            {eroare}
          </p>
        )}

        <button
          type="button"
          onClick={trimite}
          disabled={seTrimite}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 bg-neon text-black text-sm font-bold tracking-tight lumina-bloc hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {seTrimite ? (
            <><Loader2 size={16} className="animate-spin" /> Se trimite...</>
          ) : (
            <>Trimite aplicarea <ArrowRight size={16} /></>
          )}
        </button>

        <p className="text-neutral-600 text-[11px] text-center">
          Nu îți cer cardul acum. Plata se discută la apel, după ce îți confirm locul.
        </p>
      </div>
    </div>
  );
}
