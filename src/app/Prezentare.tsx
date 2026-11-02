import { useEffect, useRef, useState } from 'react';
import { Play, Check, Clock, ShieldCheck, ArrowRight, CreditCard, Lock, Gift } from 'lucide-react';
import { Caseta, Secventa, Eticheta, Buton } from './components/mentorat/Bucati';
import {
  ANTET, VIDEO, REZERVARE, OFERTA_REZERVARE, BONUS, PLATA, INCLUDE, DUPA_PLATA, DISCLAIMER,
} from '../data/prezentare';
import { OFERTA } from '../data/mentorat';
import { porneste, secundeRamase, format, OFERTA_ORE } from '../lib/fereastraOferta';
import {
  progres, noteazaProgres, corectiePozitie, esteDeblocat, deblocheaza, incarcaVimeo,
} from '../lib/vsl';
import { trimite as pixel } from '../lib/pixel';

const locuriLibere = OFERTA.locuriTotal - OFERTA.locuriLuate;

/**
 * Fereastra de 48 de ore. Pornește la prima vizită și se ține minte — vezi
 * regulile din lib/fereastraOferta.ts. Acoperă și videoul, și rezervarea.
 * `porneste()` e idempotent, deci nu contează de câte ori se montează.
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
 * Adresa de embed Vimeo, cu toate comenzile stinse.
 *
 * `controls=0` scoate bara de progres și durata, `keyboard=0` taie derularea
 * din tastatură (săgeți, cifre) — fără el, tot ce facem cu SDK-ul se ocolește
 * apăsând „→". Restul scot logo, titlu și sugestiile de la final.
 *
 * Acceptă ce e mai probabil să lipească owner-ul: `vimeo.com/123`,
 * `vimeo.com/123/hash` sau un link de player gata făcut.
 */
function srcVimeo(url: string): string {
  let id = '';
  let h = '';
  const player = url.match(/player\.vimeo\.com\/video\/(\d+)/);
  const simplu = url.match(/vimeo\.com\/(?:channels\/[\w]+\/)?(\d+)(?:\/(\w+))?/);
  if (player) {
    id = player[1];
    h = new URL(url, 'https://vimeo.com').searchParams.get('h') || '';
  } else if (simplu) {
    id = simplu[1];
    h = simplu[2] || '';
  }
  if (!id) return url;
  const p = new URLSearchParams({
    controls: '0', keyboard: '0', title: '0', byline: '0',
    portrait: '0', pip: '0', dnt: '1',
  });
  if (h) p.set('h', h);
  return `https://player.vimeo.com/video/${id}?${p.toString()}`;
}

type PlayerVimeo = {
  on: (ev: string, cb: (d: { seconds: number }) => void) => void;
  setCurrentTime: (s: number) => Promise<number>;
};

/**
 * Videoul educativ: fără bară de progres, fără durată, fără derulare înainte.
 *
 * Cerut de owner pe 2026-11-02. Raționamentul și limitele fiecărei bucăți sunt
 * în `src/lib/vsl.ts` și în nota de la `VIDEO` din `src/data/prezentare.ts`.
 *
 * `onDeblocare` se cheamă o singură dată, când omul a ajuns la capăt (sau la
 * secunda configurată). Din momentul ăla apare oferta.
 */
function Video({ onDeblocare }: { onDeblocare: () => void }) {
  const cadru = useRef<HTMLIFrameElement>(null);
  const corecteaza = useRef(false);
  const [eroare, setEroare] = useState(false);

  useEffect(() => {
    if (!VIDEO.url || VIDEO.provider !== 'vimeo' || !cadru.current) return;
    let anulat = false;

    incarcaVimeo()
      .then((Vimeo) => {
        if (anulat || !cadru.current) return;
        const V = Vimeo as { Player: new (el: HTMLIFrameElement) => PlayerVimeo };
        const player = new V.Player(cadru.current);

        const verificaDeblocarea = (secunde: number) => {
          if (VIDEO.dezvaluieLaSecunda !== null && secunde >= VIDEO.dezvaluieLaSecunda) {
            onDeblocare();
          }
        };

        player.on('timeupdate', ({ seconds }) => {
          noteazaProgres(seconds);
          verificaDeblocarea(seconds);
        });

        /* Săritura înainte: îl aducem înapoi la maximul atins. Steagul oprește
           bucla — `setCurrentTime` declanșează el însuși un `seeked`. */
        player.on('seeked', ({ seconds }) => {
          if (corecteaza.current) { corecteaza.current = false; return; }
          const inapoi = corectiePozitie(seconds);
          if (inapoi === null) return;
          corecteaza.current = true;
          player.setCurrentTime(inapoi).catch(() => { corecteaza.current = false; });
        });

        player.on('ended', () => onDeblocare());
      })
      .catch(() => { if (!anulat) setEroare(true); });

    return () => { anulat = true; };
  }, [onDeblocare]);

  /* Fără provider care raportează poziția nu putem ști unde a ajuns. Atunci
     deblocăm pe ceas, de la montare — o aproximare, nu o verificare, și e
     scris ca atare în data/prezentare.ts. */
  useEffect(() => {
    if (!VIDEO.url || VIDEO.provider === 'vimeo') return;
    const prag = VIDEO.dezvaluieLaSecunda ?? 20 * 60;
    const t = setTimeout(onDeblocare, prag * 1000);
    return () => clearTimeout(t);
  }, [onDeblocare]);

  if (!VIDEO.url) {
    return (
      <Caseta radius="rounded-3xl" className="overflow-hidden">
        <div className="relative aspect-video bg-black/70">
          {/* Fără înregistrare nu există VSL. Două mesaje diferite, deliberat:
              pe localhost scrie dezvoltatorului unde pune linkul; în producție
              scrie OMULUI ce urmează. Un vizitator care tocmai și-a lăsat
              datele n-are ce căuta în fața unui nume de variabilă. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <span className="w-16 h-16 rounded-full border border-neon/30 bg-neon/10 flex items-center justify-center">
              <Play size={22} className="text-neon ml-1" />
            </span>
            {import.meta.env.DEV ? (
              <>
                <p className="text-neutral-300 text-base font-bold">
                  Aici intră videoul de {VIDEO.durata}
                </p>
                <p className="text-neutral-600 text-xs max-w-sm leading-relaxed">
                  Pune linkul de Vimeo în <code className="text-neutral-500">VIDEO.url</code>, în{' '}
                  <code className="text-neutral-500">src/data/prezentare.ts</code>. Comenzile se
                  sting singure.
                </p>
              </>
            ) : (
              <>
                <p className="text-neutral-300 text-base font-bold">Videoul urmează.</p>
                <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">
                  Îl înregistrez zilele astea și îți trimit linkul pe email, la adresa pe care
                  tocmai ai lăsat-o.
                </p>
              </>
            )}
          </div>
        </div>
      </Caseta>
    );
  }

  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        <iframe
          ref={cadru}
          src={VIDEO.provider === 'vimeo' ? srcVimeo(VIDEO.url) : VIDEO.url}
          title={ANTET.titlu}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {eroare && (
        <p className="px-6 py-3 text-amber-400/90 text-xs leading-relaxed border-t border-white/[0.06] bg-black/30">
          Playerul nu s-a încărcat complet. Videoul merge, dar dacă ai probleme reîncarcă pagina.
        </p>
      )}
    </Caseta>
  );
}

/** Ce stă în locul ofertei până când omul ajunge la capătul videoului. */
function OfertaBlocata() {
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <div className="relative flex items-start gap-3.5 p-6 md:p-7">
        <span className="shrink-0 w-9 h-9 rounded-full border border-neutral-800 bg-white/[0.03] flex items-center justify-center mt-0.5">
          <Lock size={16} className="text-neutral-500" />
        </span>
        <div className="min-w-0">
          <p className="text-white text-base md:text-lg font-bold leading-snug">
            La finalul videoului urmează un singur pas.
          </p>
          <p className="mt-1.5 text-neutral-400 text-sm leading-relaxed masura-text">
            Nu-l pun aici sus, pentru că fără ce e în video n-ar însemna nimic. Uită-te până la
            capăt și apare singur, pe pagina asta.
          </p>
        </div>
      </div>
    </Caseta>
  );
}

/** Oferta: ceasul, rezervarea, bonusul dacă există, butonul și rândul cinstit. */
function Oferta({ ramas }: { ramas: number }) {
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
            <Eticheta ton={activa ? 'neon' : 'neutral'}>{OFERTA_REZERVARE.eticheta}</Eticheta>
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
              ? `Mai ai aproximativ ${Math.ceil(ramas / 3600)} ${
                  Math.ceil(ramas / 3600) === 1 ? 'oră' : 'ore'
                }.`
              : OFERTA_REZERVARE.expirat}
          </span>
          <p className="mt-2 text-neutral-600 text-[11px]">
            {activa ? `din ${OFERTA_ORE} de ore` : 'închisă'}
          </p>
        </div>

        <div className="flex-1 px-6 md:px-8 py-6 md:py-7 flex flex-col justify-center gap-3">
          <p className="text-white text-xl md:text-2xl font-bold leading-snug tracking-tight text-balance">
            {activa ? OFERTA_REZERVARE.titlu : OFERTA_REZERVARE.expirat}
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed masura-text">
            {activa ? OFERTA_REZERVARE.text : OFERTA_REZERVARE.expiratText}
          </p>

          {activa && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1">
              <span className="text-neon text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
                {REZERVARE} €
              </span>
              <span className="text-neutral-500 text-sm">
                acum · restul de {OFERTA_REZERVARE.rest} € înainte de zi
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bonusul apare doar dacă există unul adevărat. Vezi nota de la BONUS. */}
      {activa && BONUS && (
        <div className="relative flex items-start gap-3.5 px-6 md:px-8 py-5 border-t border-white/[0.06] bg-mov/[0.05]">
          <Gift size={17} className="text-mov shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-white text-sm font-bold leading-snug">{BONUS.titlu}</p>
            <p className="text-neutral-400 text-xs leading-relaxed mt-1 masura-text">{BONUS.text}</p>
          </div>
        </div>
      )}

      {activa && (
        <div className="relative px-6 md:px-8 py-5 border-t border-white/[0.06] bg-black/25 flex flex-col sm:flex-row sm:items-center gap-4">
          {PLATA.url ? (
            <a
              href={PLATA.url}
              onClick={() => pixel('InitiateCheckout', { value: REZERVARE, currency: 'EUR' })}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all text-center px-7 py-4 text-base bg-neon text-black hover:brightness-110 hover:-translate-y-0.5 lumina-bloc shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
            >
              <CreditCard size={17} /> Îmi rezerv locul — {REZERVARE} €
            </a>
          ) : import.meta.env.DEV ? (
            /* Numai pe localhost. În producție nu se ajunge aici — fără link de
               plată se randează `FaraPlata` în locul întregii oferte — dar
               gardul trebuie pus TOT AICI, nu doar în jurul componentei:
               `Oferta` devine accesibilă în momentul în care există un link, iar
               atunci textul ăsta ar pleca spre clienți. Exact asta s-a întâmplat
               la build-ul din 02.11.2026, prins de verificarea bundle-ului. */
            <div className="shrink-0 rounded-2xl border border-dashed border-neon/40 bg-neon/[0.04] px-5 py-4">
              <p className="text-neon text-sm font-bold">Aici intră butonul de plată</p>
              <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                Pune linkul în <code className="text-neutral-400">PLATA.url</code>. Vezi nota despre
                expirare din <code className="text-neutral-400">src/data/prezentare.ts</code>.
              </p>
            </div>
          ) : null}
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
        <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed masura-mic">
          {OFERTA_REZERVARE.onest}
        </p>
      </div>
    </Caseta>
  );
}

/**
 * Ce se arată în locul ofertei cât timp nu există link de plată.
 *
 * Nu e o variantă „mai slabă", e singura corectă: un ceas care numără spre un
 * buton inexistent e exact urgența falsă pe care o evită
 * lib/fereastraOferta.ts. Fără cale de plată nu afirmăm niciun termen limită —
 * spunem ce urmează, și atât.
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
        <p className="mt-2.5 text-neutral-400 text-sm md:text-base leading-relaxed masura-text">
          Douăzeci de minute: te întrebăm ce vrei să construiești, îți spunem cinstit dacă se poate
          într-o zi, și primești toate detaliile — datele, prețul și condițiile. Decizi după, nu
          acum. Sunt {locuriLibere} {locuriLibere === 1 ? 'loc liber' : 'locuri libere'} din{' '}
          {OFERTA.locuriTotal}.
        </p>
      </div>
      <div className="relative flex items-start gap-3 px-6 md:px-8 py-4 border-t border-white/[0.06] bg-black/30">
        <ShieldCheck size={15} className="text-neutral-600 shrink-0 mt-0.5" />
        <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed masura-mic">
          Nu plătești nimic acum și nu te-ai angajat la nimic lăsându-ți datele.
        </p>
      </div>
    </Caseta>
  );
}

/**
 * Ce rămâne după ce trec cele 48 de ore.
 *
 * Nu o pagină goală și nu un zid: omul a lăsat date reale, iar dacă a ratat
 * fereastra tot vrei să poți vorbi cu el. Dar videoul chiar dispare — altfel
 * termenul limită e o minciună, și tot restul paginii se sprijină pe el.
 */
function Expirat() {
  return (
    <Caseta radius="rounded-3xl" className="overflow-hidden">
      <span aria-hidden className="lumina-hero pointer-events-none absolute inset-0" />
      <div className="relative p-6 md:p-8">
        <Eticheta ton="neutral">{OFERTA_REZERVARE.expirat}</Eticheta>
        <p className="mt-3 text-white text-xl md:text-2xl font-bold tracking-tight leading-snug masura-titlu">
          Cele 48 de ore au trecut.
        </p>
        <p className="mt-2.5 text-neutral-400 text-sm md:text-base leading-relaxed masura-text">
          {OFERTA_REZERVARE.expiratText}
        </p>
      </div>
      <div className="relative px-6 md:px-8 py-5 border-t border-white/[0.06] bg-black/25">
        <Buton href="/mentorat" variant="contur">
          Vezi masterclass-ul <ArrowRight size={15} />
        </Buton>
      </div>
    </Caseta>
  );
}

export default function Prezentare() {
  const ramas = useFereastra();
  const [deblocat, setDeblocat] = useState(() => esteDeblocat());

  useEffect(() => { pixel('ViewContent'); }, []);

  /* Dacă s-a întors după ce văzuse deja videoul, oferta e acolo de la prima
     secundă. Nu-l punem să demonstreze a doua oară. */
  useEffect(() => {
    if (esteDeblocat()) setDeblocat(true);
    else if (VIDEO.dezvaluieLaSecunda !== null && progres() >= VIDEO.dezvaluieLaSecunda) {
      deblocheaza();
      setDeblocat(true);
    }
  }, []);

  const laDeblocare = () => {
    deblocheaza();
    setDeblocat(true);
  };

  const inchisa = ramas <= 0;
  /* Pe localhost arătăm oferta oricum, ca să poată fi lucrată fără să stăm
     douăzeci de minute în fața unui video care nici nu există încă. */
  const aratOferta = deblocat || import.meta.env.DEV;

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

        {/* Centrat, cerut de owner pe 2026-11-02. Pe o pagină de VSL antetul
            n-are de făcut decât un lucru — să confirme că omul e unde trebuie —
            iar un titlu centrat deasupra videoului citește ca o scenă, nu ca
            începutul unui articol. `masura-titlu` ține rândurile la 34ch: fără
            el, pe desktop fraza s-ar întinde pe toată lățimea și s-ar citi în
            două rânduri lungi, nu ca un titlu. */}
        <div className="px-1 md:px-2 flex flex-col items-center text-center gap-3">
          <Eticheta ton="neon">{ANTET.eticheta}</Eticheta>
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold text-white tracking-tight leading-[1.12] echilibrat masura-titlu">
            {ANTET.titlu}
          </h2>
        </div>

        {inchisa ? (
          <Expirat />
        ) : (
          <>
            <Video onDeblocare={laDeblocare} />

            {/* Oferta stă imediat sub video, nu la subsol: omul care tocmai a
                terminat de ascultat trebuie să poată apăsa fără să caute.
                Trei stări, în ordinea întrebărilor: a ajuns la capăt? există
                cale de plată? dacă nu, ce îi spunem în loc. */}
            {!aratOferta ? (
              <OfertaBlocata />
            ) : PLATA.url || import.meta.env.DEV ? (
              <Oferta ramas={ramas} />
            ) : (
              <FaraPlata />
            )}

            {aratOferta && (
              <Secventa>
                <div className="grid md:grid-cols-2 gap-4">
                  <Caseta radius="rounded-3xl" className="overflow-hidden">
                    <div className="relative p-6 md:p-7">
                      <Eticheta ton="mov">Ce intră în preț</Eticheta>
                      <ul className="mt-4 flex flex-col gap-3">
                        {INCLUDE.map((r) => (
                          <li key={r} className="flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed">
                            <Check size={15} className="text-neon shrink-0 mt-0.5" strokeWidth={2.6} />
                            <span className="masura-mic">{r}</span>
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
                              <p className="text-neutral-500 text-xs leading-relaxed mt-0.5 masura-mic">
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
            )}
          </>
        )}

        <p className="px-2 pt-2 text-neutral-600 text-[11px] leading-relaxed masura-mic">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
