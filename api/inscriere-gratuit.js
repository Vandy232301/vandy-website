/**
 * Înscrierile la SESIUNEA LIVE GRATUITĂ — pasul 1 din funnelul de reclame.
 *
 * Separat de `aplica-mentorat.js` intenționat, deși seamănă: aici intră trafic
 * RECE din reclame, cu două câmpuri, iar oamenii ăștia NU sunt lead-uri de
 * masterclass — sunt înscrieri la un lucru gratuit. Dacă ar ajunge în aceeași
 * listă, secvențele de emailuri s-ar amesteca și cineva care abia a aflat de
 * tine ar primi un email despre un avans de plătit. Vezi `ops/funnel.md` §5.
 *
 * Ca și celălalt endpoint, nu scrie în Supabase: proiectul vechi e mort
 * (NXDOMAIN din 18.09.2026), iar o listă de email nu are nevoie de el.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
/** Lista pentru înscrierile la gratuit. Cade pe lista generală dacă nu există
 *  una separată — mai bine într-o listă greșită decât pierdut. */
const RESEND_AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_GRATUIT_ID || process.env.RESEND_AUDIENCE_ID || '';
const CATRE = process.env.MENTORAT_INBOX || 'vandy.souldesign@gmail.com';
const EXPEDITOR = process.env.MENTORAT_FROM || 'VANDY <noreply@vandy.ro>';
/** Aceeași plasă ca în aplica-mentorat.js: Resend acceptă adresa asta fără
 *  domeniu verificat, dar numai către proprietarul contului. */
const EXPEDITOR_REZERVA = 'ATELIER AI <onboarding@resend.dev>';
/** Pagina cu detaliile. Aceeași destinație ca redirectul din FormularScurt.tsx. */
const DETALII = process.env.PREZENTARE_URL || 'https://vandy.ro/prezentare';

/**
 * Data sesiunii, pentru emailul de confirmare.
 *
 * ⚠️ Sursa de adevăr e `EVENIMENT.data` din `src/data/eveniment.ts`. Aici e a
 * doua oară, fiindcă funcția rulează pe Vercel și nu compilează TypeScript —
 * aceeași situație ca validarea duplicată din `aplica-mentorat.js`.
 * Dacă schimbi data acolo, pune-o și aici, în variabila de mediu.
 * Dacă lipsește, emailul spune cinstit că data vine ulterior.
 *
 *   EVENIMENT_DATA='joi, 20 noiembrie, ora 19:00'
 */
const EVENIMENT_DATA = process.env.EVENIMENT_DATA || '';

/* ────────────────────────────────────────────────────────────────────────
   VALIDAREA

   Oglinda lui `validPrenume` și `validEmail` din `src/lib/validare.ts`.
   ⚠️ Dacă schimbi regulile acolo, schimbă-le și aici — altfel browserul
   acceptă ce serverul respinge și omul vede o eroare pe care nu o poate
   repara. Serverul le reia pentru că validarea din browser se ocolește cu
   un curl.
   ──────────────────────────────────────────────────────────────────────── */

const DOAR_LITERE = /^[\p{L}\p{M}'’\-. ]+$/u;
const EMAIL_REGEX = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/;

const DOMENII_TEMPORARE = [
  'mailinator.com', 'yopmail.com', 'yopmail.fr', '10minutemail.com', 'guerrillamail.com',
  'sharklasers.com', 'grr.la', 'temp-mail.org', 'tempmail.com', 'tempmailo.com',
  'trashmail.com', 'throwawaymail.com', 'getnada.com', 'maildrop.cc', 'dispostable.com',
  'mailnesia.com', 'spam4.me', 'moakt.com', 'emailondeck.com', 'inboxkitten.com',
  'mail.tm', '1secmail.com', 'fakemail.net', 'tempr.email', 'mohmal.com',
];

const TASTATURA = ['qwert', 'werty', 'asdf', 'sdfg', 'zxcv', 'xcvb', 'hjkl', 'uiop', '1234', '2345', 'abcd'];
const tastaturaApasata = (v) => {
  const t = String(v).toLowerCase().replace(/\s+/g, '');
  return TASTATURA.some((x) => t.includes(x));
};
const literePrelungite = (v) => /(\p{L})\1{2,}/u.test(String(v));

function validatorul(d) {
  if (!d.prenume) return 'Scrie-ți prenumele.';
  if (/\d/.test(d.prenume)) return 'Prenumele nu poate conține cifre.';
  if (!DOAR_LITERE.test(d.prenume)) return 'Prenumele poate conține doar litere, cratimă și apostrof.';
  if (d.prenume.replace(/[^\p{L}]/gu, '').length < 2) return 'Prenumele e prea scurt.';
  if (d.prenume.length > 40) return 'Prenumele e prea lung.';
  if (literePrelungite(d.prenume) || tastaturaApasata(d.prenume)) return 'Prenumele ăsta nu pare real.';

  if (!d.email) return 'Scrie o adresă de email.';
  if (d.email.length > 160) return 'Adresa e prea lungă.';
  if (d.email.includes('..')) return 'Adresa are două puncte unul după altul.';
  if (!EMAIL_REGEX.test(d.email)) return 'Adresa nu e validă. Verifică @ și ce e după punct.';
  const domeniu = d.email.split('@')[1];
  if (DOMENII_TEMPORARE.includes(domeniu))
    return 'Adresele temporare nu merg aici. Dă-mi una pe care chiar o citești.';
  if (tastaturaApasata(d.email.split('@')[0])) return 'Adresa asta nu pare reală.';
  return null;
}

function esc(v = '') {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailCatreProprietar(d) {
  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#000">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000">
<tr><td align="center" style="padding:32px 16px">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%">
    <tr><td style="padding-bottom:20px">
      <span style="display:inline-block;background:#39ff14;border-radius:50px;padding:5px 14px;font-size:11px;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif">Înscriere sesiune gratuită</span>
    </td></tr>
    <tr><td bgcolor="#111111" style="background:#111;border:1px solid #222;border-radius:14px;padding:24px">
      <p style="margin:0 0 6px;color:#fff;font-size:20px;font-weight:700;font-family:Arial,sans-serif">${esc(d.prenume)}</p>
      <p style="margin:0;font-size:14px;font-family:Arial,sans-serif"><a href="mailto:${esc(d.email)}" style="color:#39ff14;text-decoration:none">${esc(d.email)}</a></p>
      <p style="margin:16px 0 0;color:#737373;font-size:13px;line-height:1.6;font-family:Arial,sans-serif">Venit din reclame, prin /gratuit. Nu e lead de masterclass — e înscriere la sesiunea live.</p>
    </td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;font-family:Arial,sans-serif">Primit ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })} · ora României</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

/**
 * Emailul A0 din secvență: LIVREAZĂ, nu vinde.
 *
 * Nimic despre masterclass, nimic despre preț, nicio ofertă. Dacă primul email
 * vinde, omul învață în trei secunde că ești vânzător, nu meșter — și restul
 * secvenței vorbește cu cineva care s-a închis deja.
 * Vezi `ops/funnel.md` §5, brațul A.
 */
function emailCatreInscris(prenume) {
  const cand = EVENIMENT_DATA
    ? `Sesiunea e <strong style="color:#fff">${esc(EVENIMENT_DATA)}</strong>, ora României.`
    : 'Stabilesc data în câteva zile și îți scriu imediat ce e fixată.';

  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#000">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000">
<tr><td align="center" style="padding:40px 16px">
  <table width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%">
    <tr><td align="center">
      <a href="https://vandy.ro" style="font-size:20px;font-weight:800;color:#fff;letter-spacing:3px;text-decoration:none;font-family:Arial,sans-serif">VANDY</a>
    </td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:28px">
      <p style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:700;line-height:1.35;font-family:Arial,sans-serif">${esc(prenume)}, ești pe listă.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">${cand} Îți trimit linkul de intrare înainte, pe adresa asta — deci păstrează emailul.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Intru live și construiesc în fața ta. Nu e înregistrare și nu sunt slide-uri: dacă ai o întrebare, o pui și îți răspund atunci.</p>
    </td></tr>
    <tr><td align="center" style="padding:8px 0 24px">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#39ff14" style="background:#39ff14;border-radius:50px">
        <a href="${esc(DETALII)}" style="display:inline-block;background:#39ff14;color:#000;font-size:15px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none;font-family:Arial,sans-serif">Vezi detaliile sesiunii</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif">Primești acest email pentru că te-ai înscris la sesiunea live gratuită pe vandy.ro. Rezultatele depind de munca, priceperea și piața fiecăruia; nu reprezintă consultanță financiară sau de investiții și nu garantează niciun venit.</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

async function trimite(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const d = {
    prenume: String(body.prenume || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    email: String(body.email || '').trim().toLowerCase().slice(0, 160),
  };

  const problema = validatorul(d);
  if (problema) return res.status(400).json({ error: problema });

  if (!RESEND_API_KEY) {
    console.error('[inscriere-gratuit] RESEND_API_KEY lipsește. Înscriere pierdută:', JSON.stringify(d));
    return res.status(500).json({ error: 'Nu pot înscrie acum. Scrie-mi pe Instagram @vandy_o1.' });
  }

  /* Ordinea contează, și e inversă față de aplica-mentorat.js.
     Acolo notificarea către proprietar e cea care nu are voie să eșueze.
     Aici, LISTA e activul: un lead din reclamă pentru care ai plătit click-ul
     și care nu intră în listă e bani aruncați, chiar dacă ți-a ajuns un email
     în inbox. Deci lista întâi, și ea decide răspunsul. */
  if (RESEND_AUDIENCE_ID) {
    try {
      const r = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: d.email, first_name: d.prenume, unsubscribed: false }),
      });
      if (!r.ok) throw new Error(`Resend audiences ${r.status}: ${await r.text()}`);
    } catch (err) {
      console.error('[inscriere-gratuit] adăugarea în listă a eșuat:', err, JSON.stringify(d));
      return res.status(500).json({ error: 'Nu am putut finaliza înscrierea. Mai încearcă o dată.' });
    }
  } else {
    // Fără listă, secvența de emailuri nu are cui să scrie. Înscrierea trece,
    // dar rămâne scris în jurnal că omul nu e nicăieri.
    console.error('[inscriere-gratuit] NICIO listă Resend configurată. Contact doar pe email:', JSON.stringify(d));
  }

  // De aici încolo înscrierea e în siguranță, deci nimic nu mai întoarce eroare.
  try {
    await trimite({ from: EXPEDITOR, to: [d.email], subject: 'Ești pe listă — sesiunea live', html: emailCatreInscris(d.prenume) });
  } catch (err) {
    console.error('[inscriere-gratuit] confirmarea către înscris a eșuat:', err);
  }

  const notificare = {
    to: [CATRE],
    reply_to: d.email,
    subject: `Înscriere sesiune gratuită — ${d.prenume}`,
    html: emailCatreProprietar(d),
  };
  try {
    await trimite({ from: EXPEDITOR, ...notificare });
  } catch (err) {
    console.error('[inscriere-gratuit] notificarea a eșuat, încerc rezerva:', err);
    try {
      await trimite({ from: EXPEDITOR_REZERVA, ...notificare });
    } catch (err2) {
      console.error('[inscriere-gratuit] și rezerva a eșuat:', err2, JSON.stringify(d));
    }
  }

  return res.status(200).json({ ok: true });
}
