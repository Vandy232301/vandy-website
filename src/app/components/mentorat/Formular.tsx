import React, { useRef, useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { OPTIUNI_DIRECTIE, OPTIUNI_STADIU, OPTIUNI_BUGET } from '../../../data/mentorat';
import { Eticheta } from './Bucati';
import {
  validNume, validEmail, validTelefon, validDescriere,
  curataNume, curataEmail, curataTelefon,
} from '../../../lib/validare';

type Camp = 'nume' | 'email' | 'telefon' | 'directie' | 'stadiu' | 'ceVreiSaConstruiesti' | 'buget';
type Stare = 'formular' | 'trimis';

const GOL: Record<Camp, string> = {
  nume: '',
  email: '',
  telefon: '',
  directie: '',
  stadiu: '',
  ceVreiSaConstruiesti: '',
  buget: '',
};

/** Regulile stau în lib/validare.ts; aici doar le legăm de câmpuri, în ordine. */
const REGULI: Record<Camp, (v: string) => string | null> = {
  nume: validNume,
  email: validEmail,
  telefon: validTelefon,
  directie: (v) => (v ? null : 'Alege o direcție. Dacă nu știi, alege ultima opțiune.'),
  stadiu: (v) => (v ? null : 'Spune-ne unde ești acum.'),
  ceVreiSaConstruiesti: validDescriere,
  buget: (v) => (v ? null : 'Alege un interval. E o orientare, nu un angajament.'),
};

const ORDINEA: Camp[] = ['nume', 'telefon', 'email', 'directie', 'stadiu', 'ceVreiSaConstruiesti', 'buget'];

/**
 * Ce se poate tasta, pe măsură ce se tastează. Nu înlocuiește validarea — o
 * face inutilă în cazurile evidente: în nume nu intră cifre, în telefon nu
 * intră litere. E mai blând să nu apară caracterul decât să apară o eroare roșie.
 */
const FILTRE: Partial<Record<Camp, (v: string) => string>> = {
  nume: (v) => v.replace(/[^\p{L}\p{M}'’\-. ]/gu, '').slice(0, 80),
  telefon: (v) => v.replace(/[^\d+\s()\-.]/g, '').slice(0, 24),
  email: (v) => v.replace(/\s/g, '').slice(0, 160),
};

const eticheteCamp = 'block text-xs font-semibold text-neutral-400 mb-2';
const campBaza =
  'w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 transition-colors';
const campBun = 'border-neutral-800 focus:border-neon/60 focus:ring-neon/25';
const campRau = 'border-red-500/60 focus:border-red-500 focus:ring-red-500/25';

export function Formular() {
  const [stare, setStare] = useState<Stare>('formular');
  const [form, setForm] = useState(GOL);
  const [erori, setErori] = useState<Partial<Record<Camp, string>>>({});
  const [eroareGenerala, setEroareGenerala] = useState('');
  const [seTrimite, setSeTrimite] = useState(false);
  const [acord, setAcord] = useState(false);
  const campuri = useRef<Partial<Record<Camp, HTMLElement | null>>>({});

  const schimba = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const camp = e.target.name as Camp;
    const filtru = FILTRE[camp];
    const valoare = filtru ? filtru(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [camp]: valoare }));
    // Eroarea se stinge singură când câmpul devine valid — nu-l ținem pe om
    // cu roșu în față până apasă din nou pe buton.
    if (erori[camp] && !REGULI[camp](valoare)) setErori((p) => ({ ...p, [camp]: undefined }));
    if (eroareGenerala) setEroareGenerala('');
  };

  /** La ieșirea din câmp verificăm o dată — acolo e momentul în care omul a terminat de scris. */
  const verifica = (camp: Camp) => {
    const problema = REGULI[camp](form[camp]);
    setErori((p) => ({ ...p, [camp]: problema || undefined }));
  };

  const trimite = async () => {
    const gasite: Partial<Record<Camp, string>> = {};
    for (const camp of ORDINEA) {
      const problema = REGULI[camp](form[camp]);
      if (problema) gasite[camp] = problema;
    }
    setErori(gasite);

    const primul = ORDINEA.find((c) => gasite[c]);
    if (primul) {
      campuri.current[primul]?.focus();
      campuri.current[primul]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!acord) return setEroareGenerala('Bifează acordul ca să te putem contacta.');

    setSeTrimite(true);
    setEroareGenerala('');
    try {
      const res = await fetch('/api/aplica-mentorat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          nume: curataNume(form.nume),
          email: curataEmail(form.email),
          telefon: curataTelefon(form.telefon),
        }),
      });
      const date = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(date?.error || 'Trimiterea a eșuat.');
      setStare('trimis');
    } catch (err) {
      setEroareGenerala(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Nu am putut trimite datele. Scrie-mi direct pe Instagram @vandy_o1 și o rezolvăm.',
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
        <h3 className="text-2xl font-bold text-white tracking-tight">Am primit datele tale.</h3>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
          Te contactează echipa în maximum 48 de ore, de pe un număr din România. Primești toate
          detaliile — datele exacte, direcția potrivită pentru tine și cum se face plata — și abia
          după aceea decizi.
        </p>
        <p className="text-neutral-600 text-xs max-w-md">
          Dacă nu prinzi apelul, te căutăm încă o dată. Ți-am trimis și un email de confirmare —
          verifică și în Spam, prima dată ajunge uneori acolo.
        </p>
      </div>
    );
  }

  /** Un câmp cu eticheta, mesajul de eroare și legătura dintre ele pentru cititoarele de ecran. */
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
      <div className="space-y-2 mb-7">
        <Eticheta ton="mov">Pasul 1 din 2</Eticheta>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Lasă-ți datele și te contactăm
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Durează 30 de secunde. Te caută echipa în maximum 48 de ore și îți dă toate detaliile:
          datele exacte, direcția potrivită pentru tine și cum se face plata. Nu plătești nimic acum.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nume" className={eticheteCamp}>Nume și prenume</label>
            <input
              {...propsCamp('nume')}
              ref={(el) => { campuri.current.nume = el; }}
              placeholder="Andrei Popescu"
              autoComplete="name"
            />
            <Mesaj camp="nume" />
          </div>
          <div>
            <label htmlFor="telefon" className={eticheteCamp}>Telefon</label>
            <input
              {...propsCamp('telefon')}
              ref={(el) => { campuri.current.telefon = el; }}
              placeholder="07xx xxx xxx"
              autoComplete="tel"
              inputMode="tel"
            />
            <Mesaj camp="telefon" />
          </div>
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
          />
          <Mesaj camp="email" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="directie" className={eticheteCamp}>Ce direcție te interesează</label>
            <select
              {...propsCamp('directie')}
              ref={(el) => { campuri.current.directie = el; }}
              className={`${propsCamp('directie').className} appearance-none`}
            >
              <option value="">Alege...</option>
              {OPTIUNI_DIRECTIE.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Mesaj camp="directie" />
          </div>
          <div>
            <label htmlFor="stadiu" className={eticheteCamp}>Unde ești acum</label>
            <select
              {...propsCamp('stadiu')}
              ref={(el) => { campuri.current.stadiu = el; }}
              className={`${propsCamp('stadiu').className} appearance-none`}
            >
              <option value="">Alege...</option>
              {OPTIUNI_STADIU.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Mesaj camp="stadiu" />
          </div>
        </div>

        <div>
          <label htmlFor="ceVreiSaConstruiesti" className={eticheteCamp}>
            Ce vrei să construiești sau să vinzi? Scrie concret.
          </label>
          <textarea
            {...propsCamp('ceVreiSaConstruiesti')}
            ref={(el) => { campuri.current.ceVreiSaConstruiesti = el; }}
            rows={4}
            className={`${propsCamp('ceVreiSaConstruiesti').className} resize-none`}
            placeholder="Ex: am o firmă de instalații și vreau o aplicație care îmi preia cererile de ofertă și le calculează singură."
          />
          <Mesaj camp="ceVreiSaConstruiesti" />
          {!erori.ceVreiSaConstruiesti && (
            <p className="text-neutral-600 text-[11px] mt-2">
              Pe baza răspunsului pregătim apelul. Două rânduri serioase bat o pagină de generalități.
            </p>
          )}
        </div>

        {/* Bugetul. Întrebarea califică discuția; prețul e fix și NU e stabilit
            de răspunsul ăsta — scrie negru pe alb sub câmp, ca să nu sugerăm
            altceva. */}
        <div>
          <label htmlFor="buget" className={eticheteCamp}>
            Cât ai fi dispus să investești într-un astfel de program?
          </label>
          <select
            {...propsCamp('buget')}
            ref={(el) => { campuri.current.buget = el; }}
            className={`${propsCamp('buget').className} appearance-none`}
          >
            <option value="">Alege...</option>
            {OPTIUNI_BUGET.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Mesaj camp="buget" />
          {!erori.buget && (
            <p className="text-neutral-600 text-[11px] mt-2">
              Răspunsul nu stabilește prețul — prețul e fix și îl afli la apel. Ne ajută doar să
              știm cu ce venim la discuție.
            </p>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acord}
            onChange={(e) => { setAcord(e.target.checked); if (eroareGenerala) setEroareGenerala(''); }}
            className="mt-0.5 w-4 h-4 shrink-0 accent-neon"
          />
          <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
            Sunt de acord să fiu contactat telefonic și pe email de echipa ATELIER AI în legătură cu
            această solicitare. Datele nu ajung la nimeni altcineva și le poți cere șterse oricând.
          </span>
        </label>

        {eroareGenerala && (
          <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
            {eroareGenerala}
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
            <>Trimite datele <ArrowRight size={16} /></>
          )}
        </button>

        <p className="text-neutral-600 text-[11px] text-center">
          Nu îți cerem cardul și nu plătești nimic acum. Plata se discută la apel.
        </p>
      </div>
    </div>
  );
}
