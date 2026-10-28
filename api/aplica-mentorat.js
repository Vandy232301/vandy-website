/**
 * Aplicările pentru ATELIER AI.
 *
 * Nu scrie în Supabase intenționat: proiectul vechi (cxamezffjphbbbswvhcw) e
 * mort — domeniul lui dă NXDOMAIN din 18.09.2026 — iar o serie de 10 locuri nu
 * are nevoie de bază de date. Aplicarea ajunge pe email la proprietar și, dacă
 * RESEND_AUDIENCE_ID e setat, contactul intră și în lista Resend pentru
 * secvența de emailuri. Dacă lista lipsește, aplicarea trece oricum.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';
const CATRE = process.env.MENTORAT_INBOX || 'vandy.souldesign@gmail.com';
const EXPEDITOR = process.env.MENTORAT_FROM || 'VANDY <noreply@vandy.ro>';
// Plasa de siguranță. Resend acceptă onboarding@resend.dev fără domeniu verificat,
// dar numai către adresa proprietarului contului — exact ce ne trebuie ca
// notificarea să ajungă chiar dacă vandy.ro nu e (încă) verificat pe cheia din producție.
const EXPEDITOR_REZERVA = 'ATELIER AI <onboarding@resend.dev>';

const DIRECTII = {
  agentie: 'AGENȚIA — vinde servicii cu AI',
  produs: 'PRODUSUL — își construiește aplicația',
  creativ: 'CREATIVUL — video cu AI pentru branduri',
  'nu-stiu': 'NU ȘTIE ÎNCĂ — are nevoie de ajutor să aleagă',
};

const STADII = {
  zero: 'Nu a început nimic',
  incercat: 'A încercat singur și s-a blocat',
  clienti: 'Are deja clienți, vrea să livreze cu AI',
  firma: 'Are firmă și echipă',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFON_REGEX = /^[\d\s+\-().]{7,20}$/;

/** Textul vine de la un necunoscut și ajunge într-un email HTML. */
function esc(v = '') {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailCatreProprietar(d) {
  const rand = (eticheta, valoare) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#737373;font-size:13px;font-family:Arial,sans-serif;width:150px;vertical-align:top">${eticheta}</td>` +
    `<td style="padding:10px 0;border-bottom:1px solid #222;color:#fff;font-size:14px;font-family:Arial,sans-serif;vertical-align:top">${valoare}</td></tr>`;

  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#000">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000">
<tr><td align="center" style="padding:32px 16px">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%">
    <tr><td style="padding-bottom:20px">
      <span style="display:inline-block;background:#111;border:1px solid #333;border-radius:50px;padding:5px 14px;font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif">Aplicare ATELIER AI</span>
    </td></tr>
    <tr><td bgcolor="#111111" style="background:#111;border:1px solid #222;border-radius:14px;padding:24px">
      <p style="margin:0 0 18px;color:#fff;font-size:20px;font-weight:700;font-family:Arial,sans-serif">${esc(d.nume)}</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${rand('Telefon', `<a href="tel:${esc(d.telefon.replace(/[^\d+]/g, ''))}" style="color:#fff;text-decoration:none">${esc(d.telefon)}</a>`)}
        ${rand('Email', `<a href="mailto:${esc(d.email)}" style="color:#fff;text-decoration:none">${esc(d.email)}</a>`)}
        ${rand('Direcția', esc(DIRECTII[d.directie] || d.directie))}
        ${rand('Unde e acum', esc(STADII[d.stadiu] || d.stadiu))}
      </table>
      <p style="margin:22px 0 8px;color:#737373;font-size:13px;font-family:Arial,sans-serif">Ce vrea să construiască</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid #fff;padding:12px 16px;background:#0a0a0a">
        <p style="margin:0;color:#d4d4d4;font-size:14px;line-height:1.65;font-family:Arial,sans-serif;white-space:pre-wrap">${esc(d.ceVreiSaConstruiesti)}</p>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;font-family:Arial,sans-serif">Primit ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })} · ora României</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function emailCatreAplicant(nume) {
  const prenume = esc(String(nume).trim().split(/\s+/)[0] || '');
  return `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#000">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000">
<tr><td align="center" style="padding:40px 16px">
  <table width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%">
    <tr><td align="center">
      <a href="https://vandy.ro" style="font-size:20px;font-weight:800;color:#fff;letter-spacing:3px;text-decoration:none;font-family:Arial,sans-serif">VANDY</a>
    </td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:28px">
      <p style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:700;line-height:1.35;font-family:Arial,sans-serif">${prenume}, am primit aplicarea ta.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Te sun în maximum 48 de ore, de pe un număr din România. Apelul durează 20 de minute.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Te întreb ce vrei să construiești, îți spun cinstit dacă se poate în trei zile, și stabilim pe care din cele trei direcții intri. Dacă nu ne potrivim, ți-o spun la telefon și nu ai pierdut nimic.</p>
    </td></tr>
    <tr><td style="padding:8px 0 20px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#111111" style="background:#111;border:1px solid #222;border-radius:14px;padding:20px">
        <p style="margin:0 0 10px;color:#fff;font-size:15px;font-weight:700;font-family:Arial,sans-serif">Un lucru, până vorbim</p>
        <p style="margin:0;color:#a3a3a3;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">Gândește-te la un singur lucru concret pe care ai vrea să îl ai gata la finalul celor trei zile. Nu o idee mare — un lucru. Cu cât e mai precis, cu atât apelul e mai scurt și mai util.</p>
      </td></tr></table>
    </td></tr>
    <tr><td align="center" style="padding-bottom:24px">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#ffffff" style="background:#fff;border-radius:50px">
        <a href="https://vandy.ro/mentorat" style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none;font-family:Arial,sans-serif">Recitește ce pleci cu</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif">Primești acest email pentru că ai aplicat la ATELIER AI pe vandy.ro/mentorat. ATELIER AI este un program de formare practică: nu reprezintă consultanță financiară sau de investiții și nu garantează niciun venit.</p>
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
    nume: String(body.nume || '').trim().slice(0, 120),
    email: String(body.email || '').trim().toLowerCase().slice(0, 160),
    telefon: String(body.telefon || '').trim().slice(0, 40),
    directie: String(body.directie || '').trim().slice(0, 20),
    stadiu: String(body.stadiu || '').trim().slice(0, 20),
    ceVreiSaConstruiesti: String(body.ceVreiSaConstruiesti || '').trim().slice(0, 4000),
  };

  if (d.nume.length < 3) return res.status(400).json({ error: 'Numele lipsește.' });
  if (!EMAIL_REGEX.test(d.email)) return res.status(400).json({ error: 'Adresa de email nu e validă.' });
  if (!TELEFON_REGEX.test(d.telefon)) return res.status(400).json({ error: 'Numărul de telefon nu e valid.' });
  if (!DIRECTII[d.directie]) return res.status(400).json({ error: 'Alege o direcție.' });
  if (!STADII[d.stadiu]) return res.status(400).json({ error: 'Alege unde ești acum.' });
  if (d.ceVreiSaConstruiesti.length < 20)
    return res.status(400).json({ error: 'Scrie câteva cuvinte în plus la ultima întrebare.' });

  if (!RESEND_API_KEY) {
    console.error('[aplica-mentorat] RESEND_API_KEY lipsește. Aplicare pierdută:', JSON.stringify(d));
    return res.status(500).json({ error: 'Nu pot trimite acum. Scrie-mi pe Instagram @vandy_o1.' });
  }

  // Notificarea proprietarului e singura parte care nu are voie să eșueze în
  // silență: fără ea aplicarea e pierdută, oricât de bine arată pagina.
  const notificare = {
    to: [CATRE],
    reply_to: d.email,
    subject: `Aplicare ATELIER AI — ${d.nume} (${DIRECTII[d.directie].split(' —')[0]})`,
    html: emailCatreProprietar(d),
  };

  try {
    await trimite({ from: EXPEDITOR, ...notificare });
  } catch (err) {
    console.error('[aplica-mentorat] expeditorul de brand a eșuat:', err);
    try {
      await trimite({ from: EXPEDITOR_REZERVA, ...notificare });
    } catch (err2) {
      console.error('[aplica-mentorat] și rezerva a eșuat:', err2, JSON.stringify(d));
      return res.status(500).json({ error: 'Nu am putut trimite aplicarea. Scrie-mi pe Instagram @vandy_o1.' });
    }
  }

  // De aici încolo aplicarea e deja în siguranță, deci nimic nu mai întoarce eroare.
  try {
    await trimite({
      from: EXPEDITOR,
      to: [d.email],
      subject: 'Am primit aplicarea ta pentru ATELIER AI',
      html: emailCatreAplicant(d.nume),
    });
  } catch (err) {
    console.error('[aplica-mentorat] confirmarea către aplicant a eșuat:', err);
  }

  if (RESEND_AUDIENCE_ID) {
    try {
      const [prenume, ...rest] = d.nume.split(/\s+/);
      await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: d.email,
          first_name: prenume,
          last_name: rest.join(' '),
          unsubscribed: false,
        }),
      });
    } catch (err) {
      console.error('[aplica-mentorat] adăugarea în lista Resend a eșuat:', err);
    }
  }

  return res.status(200).json({ ok: true });
}
