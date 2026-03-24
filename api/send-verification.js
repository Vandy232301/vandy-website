const SUPABASE_URL = process.env.SUPABASE_URL || 'https://najyetpmxjqgjrppuytn.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

function verificationEmailHtml(code, firstName) {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
<title>Verificare Email - VANDY</title>
<style>
  body{margin:0;padding:0;background:#000;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
  .wrapper{max-width:480px;margin:0 auto;padding:40px 24px;text-align:center}
  .logo{font-size:20px;font-weight:800;color:#fff;letter-spacing:2px;text-decoration:none}
  .divider{height:1px;background:linear-gradient(90deg,transparent,#333,transparent);margin:28px 0}
  h1{color:#fff;font-size:22px;font-weight:700;margin:0 0 12px}
  p{color:#a3a3a3;font-size:15px;line-height:1.7;margin:0 0 16px}
  .code-box{display:inline-block;background:#111;border:2px solid #34d399;border-radius:16px;padding:20px 40px;margin:24px 0;letter-spacing:12px;font-size:36px;font-weight:800;color:#fff;font-family:'SF Mono',Monaco,Menlo,monospace}
  .expire{color:#737373;font-size:13px}
  .footer{text-align:center;padding-top:24px;color:#525252;font-size:12px}
</style>
</head>
<body>
<div class="wrapper">
  <a href="https://vandy.ro" class="logo">VANDY</a>
  <div class="divider"></div>
  <h1>Ești la un pas distanță.</h1>
  <p>Salut${firstName ? ', ' + firstName : ''}! Confirmă-ți adresa de email cu codul de mai jos și obține acces la cele mai bune oportunități:</p>
  <div class="code-box">${code}</div>
  <p class="expire">Codul expiră în <strong style="color:#fff">10 minute</strong>.</p>
  <p style="color:#525252;font-size:13px">Dacă nu ai solicitat acest cod, ignoră acest email.</p>
  <div class="divider"></div>
  <div class="footer">
    <p>&copy; 2026 VANDY. Toate drepturile rezervate.</p>
  </div>
</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, firstName } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalid' });
  }

  try {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/email_verifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        code,
        expires_at: expiresAt,
        verified: false,
      }),
    });

    if (!supaRes.ok) {
      console.error('Supabase verification insert error:', await supaRes.text());
      return res.status(500).json({ error: 'Failed to create verification' });
    }

    if (RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'VANDY <noreply@vandy.ro>',
          to: [email.trim().toLowerCase()],
          subject: `${code} - Codul tău de verificare VANDY`,
          html: verificationEmailHtml(code, firstName),
        }),
      });

      if (!emailRes.ok) {
        console.error('Resend error:', await emailRes.text());
        return res.status(500).json({ error: 'Failed to send verification email' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send verification error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
