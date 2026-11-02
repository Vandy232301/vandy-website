/**
 * Solicitările de detalii pentru MASTERCLASS ATELIER AI.
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
/* Unde trimitem omul din emailul de confirmare.
   ⚠️ NU pe /prezentare. De pe 2026-11-02, aia e pagina sesiunii live gratuite,
   iar cine cere detalii despre masterclass nu s-a înscris la ea — ar primi un
   email despre un lucru la care nu s-a dus. Îl trimitem înapoi la pagina
   programului, unde poate reciti ce urmează. */
const PAGINA_PROGRAM = process.env.MENTORAT_URL || 'https://vandy.ro/mentorat';

const DIRECTII = {
  software: 'SOFTWARE — site-uri, aplicații, software la comandă',
  agenti: 'AGENȚI — agenția lui de marketing cu AI',
  automatizari: 'AUTOMATIZĂRI — eficientizează afaceri',
  doua: 'ORICARE DOUĂ dintre ele',
  toate: 'TOATE TREI',
  'nu-stiu': 'NU ȘTIE ÎNCĂ — are nevoie de ajutor să aleagă',
};

const STADII = {
  proiect: 'Construiește acum afacerea, încă fără venit constant',
  firma: 'Are firmă și clienți, dar AI-ul nu e în fluxul de lucru',
  punctual: 'Folosește AI punctual, fără sistem',
  echipa: 'Are echipă și vrea să o pună să lucreze cu AI',
};

/** Ce a declarat că ar investi. Nu e prețul — prețul se spune la apel. */
const BUGETE = {
  'pana-1000': 'Până în 1.000 €',
  '1000-3000': 'Între 1.000 și 3.000 €',
  'peste-3000': 'Peste 3.000 €',
};

/* ────────────────────────────────────────────────────────────────────────
   VALIDAREA

   Aceleași reguli ca în `src/lib/validare.ts`, rescrise aici în JS simplu
   pentru că funcția rulează pe Vercel și nu compilează TypeScript.
   ⚠️ Dacă schimbi ceva acolo, schimbă și aici — altfel clientul acceptă ce
   serverul respinge, și omul vede o eroare pe care nu o poate repara.

   Rostul lor: să nu intre în inbox date cu care nu poți suna pe nimeni.
   Serverul le reia pentru că validarea din browser se ocolește cu un curl.
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

function curataTelefon(brut) {
  let t = String(brut).replace(/[^\d+]/g, '');
  if (t.startsWith('00')) t = '+' + t.slice(2);
  if (t.startsWith('+40')) t = '0' + t.slice(3);
  else if (/^40[237]\d{8}$/.test(t)) t = '0' + t.slice(2);
  return t;
}

// Pragul de 8 cifre crescătoare, nu 5: la 5, `0721234567` pica degeaba.
function cifreInventate(cifre) {
  // Aceeași cifră pe aproape toate pozițiile: 0700000000. Pragul e 9 din 10,
  // ca un număr „de aur" ca 0744444444 să treacă.
  const frecvente = new Map();
  for (const c of cifre) frecvente.set(c, (frecvente.get(c) || 0) + 1);
  if (Math.max(...frecvente.values()) >= 9) return true;

  let crescator = 0;
  for (let i = 1; i < cifre.length; i++) {
    crescator = +cifre[i] === +cifre[i - 1] + 1 ? crescator + 1 : 0;
    if (crescator >= 7) return true;
  }
  return false;
}

function formateazaTelefon(brut) {
  const v = curataTelefon(brut);
  return /^0\d{9}$/.test(v) ? `${v.slice(0, 4)} ${v.slice(4, 7)} ${v.slice(7)}` : v;
}

/** Întoarce primul mesaj de eroare, sau null dacă datele sunt bune. */
function validatorul(d) {
  const nume = d.nume;
  if (/\d/.test(nume)) return 'Numele nu poate conține cifre.';
  if (!DOAR_LITERE.test(nume)) return 'Numele poate conține doar litere, cratimă și apostrof.';
  if (nume.length < 5 || nume.length > 80) return 'Scrie numele complet.';
  const cuvinte = nume.split(' ').filter((c) => c.replace(/[^\p{L}]/gu, '').length >= 2);
  if (cuvinte.length < 2) return 'Scrie și numele, și prenumele.';
  if (new Set(cuvinte.map((c) => c.toLowerCase())).size < cuvinte.length) return 'Numele ăsta nu pare real.';
  if (/(\p{L})\1{2,}/u.test(nume) || tastaturaApasata(nume)) return 'Numele ăsta nu pare real.';

  if (d.email.includes('..') || !EMAIL_REGEX.test(d.email)) return 'Adresa de email nu e validă.';
  if (DOMENII_TEMPORARE.includes(d.email.split('@')[1]))
    return 'Adresele temporare nu merg aici. Dă-ne una pe care chiar o citești.';
  if (tastaturaApasata(d.email.split('@')[0])) return 'Adresa asta nu pare reală.';

  const tel = d.telefon;
  if (tel.startsWith('+')) {
    if (!/^\+[1-9]\d{7,14}$/.test(tel)) return 'Numărul internațional trebuie scris cu + și prefixul țării.';
  } else if (!/^0[237]\d{8}$/.test(tel)) {
    return 'Scrie un număr din România, 10 cifre: 07xx xxx xxx.';
  }
  if (cifreInventate(tel.replace(/\D/g, ''))) return 'Numărul ăsta nu pare real.';

  if (!DIRECTII[d.directie]) return 'Alege ce te interesează.';
  if (!STADII[d.stadiu]) return 'Alege unde ești acum.';
  if (!BUGETE[d.buget]) return 'Alege un interval de buget.';

  const desc = d.ceVreiSaConstruiesti;
  if (desc.length < 25) return 'Mai scrie puțin la ultima întrebare.';
  if ((desc.match(/\p{L}/gu) || []).length < 15) return 'Scrie în cuvinte, te rog.';
  if (desc.split(' ').filter((c) => c.length >= 2).length < 5) return 'Scrie o propoziție întreagă.';
  if (tastaturaApasata(desc) || /(.)\1{4,}/.test(desc)) return 'Răspunsul ăsta nu spune nimic.';
  return null;
}

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
      <span style="display:inline-block;background:#39ff14;border-radius:50px;padding:5px 14px;font-size:11px;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif">Lead MASTERCLASS ATELIER AI</span>
    </td></tr>
    <tr><td bgcolor="#111111" style="background:#111;border:1px solid #222;border-radius:14px;padding:24px">
      <p style="margin:0 0 18px;color:#fff;font-size:20px;font-weight:700;font-family:Arial,sans-serif">${esc(d.nume)}</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${rand('Telefon', `<a href="tel:${esc(d.telefon)}" style="color:#fff;text-decoration:none">${esc(formateazaTelefon(d.telefon))}</a>`)}
        ${rand('Email', `<a href="mailto:${esc(d.email)}" style="color:#fff;text-decoration:none">${esc(d.email)}</a>`)}
        ${rand('Ce vrea', esc(DIRECTII[d.directie] || d.directie))}
        ${rand('Unde e acum', esc(STADII[d.stadiu] || d.stadiu))}
        ${rand('Ar investi', `<strong style="color:#39ff14">${esc(BUGETE[d.buget] || d.buget)}</strong>`)}
        ${rand('Bonus surpriză', d.bonus === true
          ? '<strong style="color:#39ff14">DA — a trimis în primele 10 minute</strong>'
          : '<span style="color:#737373">nu</span>')}
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
      <p style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:700;line-height:1.35;font-family:Arial,sans-serif">${prenume}, ești înăuntru.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Te contactează echipa în maximum 48 de ore, de pe un număr din România. Apelul durează 20 de minute.</p>
      <p style="margin:0 0 14px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Te întrebăm ce vrei să construiești, îți spunem cinstit dacă se poate într-o zi, stabilim pe care din cele trei masterclass-uri intri — unul, două sau toate — și primești toate detaliile: datele exacte, prețul și condițiile. Dacă nu ne potrivim, ți-o spunem la telefon și nu ai pierdut nimic.</p>
    </td></tr>
    <tr><td style="padding:8px 0 20px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#111111" style="background:#111;border:1px solid #222;border-radius:14px;padding:20px">
        <p style="margin:0 0 10px;color:#fff;font-size:15px;font-weight:700;font-family:Arial,sans-serif">Un lucru, până vorbim</p>
        <p style="margin:0;color:#a3a3a3;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">Gândește-te la un singur lucru concret pe care ai vrea să îl ai gata la finalul zilei. Nu o idee mare — un lucru. Cu cât e mai precis, cu atât apelul e mai scurt și mai util.</p>
      </td></tr></table>
    </td></tr>
    <tr><td align="center" style="padding-bottom:24px">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#39ff14" style="background:#39ff14;border-radius:50px">
        <a href="${esc(PAGINA_PROGRAM)}" style="display:inline-block;background:#39ff14;color:#000;font-size:15px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none;font-family:Arial,sans-serif">Recitesc ce pleci cu</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="height:1px;background:#333;font-size:1px;line-height:1px">&nbsp;</td></tr>
    <tr><td style="padding-top:18px">
      <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif">Primești acest email pentru că ți-ai lăsat datele la MASTERCLASS ATELIER AI pe vandy.ro/mentorat. Este un program de formare practică: nu reprezintă consultanță financiară sau de investiții și nu garantează niciun venit.</p>
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

  // Normalizăm întâi, validăm pe urmă: regulile de mai jos presupun un telefon
  // adus deja la `07…`/`+…` și un nume fără spații duble.
  const body = req.body || {};
  const d = {
    nume: String(body.nume || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    email: String(body.email || '').trim().toLowerCase().slice(0, 160),
    telefon: curataTelefon(String(body.telefon || '').slice(0, 40)),
    directie: String(body.directie || '').trim().slice(0, 20),
    stadiu: String(body.stadiu || '').trim().slice(0, 20),
    buget: String(body.buget || '').trim().slice(0, 20),
    ceVreiSaConstruiesti: String(body.ceVreiSaConstruiesti || '').replace(/\s+/g, ' ').trim().slice(0, 3000),
  };

  const problema = validatorul(d);
  if (problema) return res.status(400).json({ error: problema });

  if (!RESEND_API_KEY) {
    console.error('[aplica-mentorat] RESEND_API_KEY lipsește. Lead pierdut:', JSON.stringify(d));
    return res.status(500).json({ error: 'Nu pot trimite acum. Scrie-mi pe Instagram @vandy_o1.' });
  }

  // Notificarea proprietarului e singura parte care nu are voie să eșueze în
  // silență: fără ea aplicarea e pierdută, oricât de bine arată pagina.
  const notificare = {
    to: [CATRE],
    reply_to: d.email,
    subject: `Lead MASTERCLASS — ${d.nume} (${DIRECTII[d.directie].split(' —')[0]}, ${BUGETE[d.buget]})`,
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
      return res.status(500).json({ error: 'Nu am putut trimite datele. Scrie-mi pe Instagram @vandy_o1.' });
    }
  }

  // De aici încolo aplicarea e deja în siguranță, deci nimic nu mai întoarce eroare.
  try {
    await trimite({
      from: EXPEDITOR,
      to: [d.email],
      subject: 'Am primit datele tale pentru MASTERCLASS ATELIER AI',
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
