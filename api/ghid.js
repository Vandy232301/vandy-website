/**
 * Lead magnetul: ghidul video gratuit.
 *
 * Două câmpuri, nume și email. Spre deosebire de /api/aplica-mentorat, aici
 * nu califică nimeni pe nimeni — omul a venit pentru un lucru anume și îl
 * primește. Calificarea se întâmplă mai târziu, în secvența de emailuri.
 *
 * Lista Resend e DELIBERAT alta decât cea de la masterclass
 * (RESEND_AUDIENCE_GHID_ID, nu RESEND_AUDIENCE_ID). Cine a cerut ghidul e la
 * începutul drumului; cine a aplicat pentru apel e la capătul lui. Dacă intră
 * în aceeași listă, le scrii la fel și îi pierzi pe amândoi. Dacă variabila
 * lipsește, contactul nu se salvează nicăieri, dar emailul tot pleacă —
 * niciodată în lista cealaltă.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_AUDIENCE_GHID_ID = process.env.RESEND_AUDIENCE_GHID_ID || '';
const CATRE = process.env.MENTORAT_INBOX || 'vandy.souldesign@gmail.com';
const EXPEDITOR = process.env.MENTORAT_FROM || 'VANDY <noreply@vandy.ro>';
const EXPEDITOR_REZERVA = 'VANDY <onboarding@resend.dev>';
const PAGINA = process.env.GHID_URL || 'https://vandy.ro/ghid';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function emailCatreOm(nume) {
  const prenume = esc(String(nume).split(/\s+/)[0] || '');
  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#000">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:32px 16px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a0a0a;border:1px solid #262626;border-radius:16px;padding:32px">
    <tr><td>
      <p style="margin:0 0 24px;color:#39ff14;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif">Ghidul tău</p>
      <p style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800;line-height:1.3;font-family:Arial,sans-serif">Salut, ${prenume}. Îl deschizi de aici.</p>
      <p style="margin:0 0 28px;color:#a3a3a3;font-size:15px;line-height:1.65;font-family:Arial,sans-serif">Videoul și lista de verificare sunt pe pagina de mai jos. Păstrează emailul ăsta — e singurul link de care ai nevoie ca să te întorci la el oricând.</p>
      <table cellpadding="0" cellspacing="0"><tr><td>
        <a href="${esc(PAGINA)}" style="display:inline-block;background:#39ff14;color:#000;font-size:15px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none;font-family:Arial,sans-serif">Deschide ghidul</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="height:28px;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif">Primești acest email pentru că ai cerut ghidul pe vandy.ro/ghid. Rezultatele depind de munca, priceperea și piața fiecăruia; ghidul este material educativ și nu reprezintă o garanție de venit.</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function emailCatreProprietar(d) {
  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:24px;background:#000;font-family:Arial,sans-serif">
  <p style="margin:0 0 12px;color:#39ff14;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Lead ghid</p>
  <p style="margin:0 0 6px;color:#fff;font-size:18px;font-weight:800">${esc(d.nume)}</p>
  <p style="margin:0;color:#a3a3a3;font-size:14px"><a href="mailto:${esc(d.email)}" style="color:#fff;text-decoration:none">${esc(d.email)}</a></p>
</body></html>`;
}

async function trimite(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
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
    nume: String(body.nume || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    email: String(body.email || '').trim().toLowerCase().slice(0, 160),
  };

  if (d.nume.length < 2) return res.status(400).json({ error: 'Scrie-ți numele.' });
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email)) {
    return res.status(400).json({ error: 'Emailul nu pare valid.' });
  }

  if (!RESEND_API_KEY) {
    console.error('[ghid] RESEND_API_KEY lipsește. Lead pierdut:', JSON.stringify(d));
    return res.status(500).json({ error: 'Nu pot trimite acum. Scrie-mi pe Instagram @vandy_o1.' });
  }

  // Emailul către om e singurul care nu are voie să eșueze în silență: el E
  // livrarea. Dacă nu ajunge, omul a dat datele degeaba.
  const livrarea = {
    to: [d.email],
    subject: 'Ghidul tău — site-uri simple, construite și vândute',
    html: emailCatreOm(d.nume),
  };
  try {
    await trimite({ from: EXPEDITOR, ...livrarea });
  } catch (err) {
    console.error('[ghid] expeditorul de brand a eșuat:', err);
    try {
      await trimite({ from: EXPEDITOR_REZERVA, ...livrarea });
    } catch (err2) {
      console.error('[ghid] și rezerva a eșuat:', err2, JSON.stringify(d));
      return res.status(500).json({ error: 'Nu am putut trimite ghidul. Scrie-mi pe Instagram @vandy_o1.' });
    }
  }

  // De aici încolo omul are deja ghidul, deci nimic nu mai întoarce eroare.
  try {
    await trimite({
      from: EXPEDITOR,
      to: [CATRE],
      reply_to: d.email,
      subject: `Lead ghid — ${d.nume}`,
      html: emailCatreProprietar(d),
    });
  } catch (err) {
    console.error('[ghid] notificarea către proprietar a eșuat:', err);
  }

  if (RESEND_AUDIENCE_GHID_ID) {
    try {
      const [prenume, ...rest] = d.nume.split(/\s+/);
      await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_GHID_ID}/contacts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: d.email, first_name: prenume, last_name: rest.join(' '), unsubscribed: false }),
      });
    } catch (err) {
      console.error('[ghid] adăugarea în lista de ghid a eșuat:', err);
    }
  }

  return res.status(200).json({ ok: true });
}
