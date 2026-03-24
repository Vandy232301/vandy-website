const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cxamezffjphbbbswvhcw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YW1lemZmanBoYmJic3d2aGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjgwOTIsImV4cCI6MjA4ODgwNDA5Mn0.4aN_ZJv4DB9ckCxdJoHQarw0mwl_ff8WSLI1xdbRpM4';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

function verificationEmailHtml(code, firstName) {
  return `<!DOCTYPE html>
<html lang="ro" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Verificare Email - VANDY</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;">
  <tr>
    <td align="center" bgcolor="#000000" style="background-color:#000000;padding:40px 16px;">
      <table width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
        <tr>
          <td align="center" bgcolor="#000000" style="background-color:#000000;padding:0;">

            <!-- Logo -->
            <a href="https://vandy.ro" style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:3px;text-decoration:none;font-family:Arial,sans-serif;">VANDY</a>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>

            <!-- Headline -->
            <p style="margin:0 0 12px;color:#ffffff;font-size:22px;font-weight:700;font-family:Arial,sans-serif;text-align:center;">Ești la un pas distanță.</p>
            <p style="margin:0 0 24px;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;text-align:center;">Salut${firstName ? ', <strong style="color:#ffffff">' + firstName + '</strong>' : ''}! Confirmă-ți adresa de email cu codul de mai jos și obține acces la cele mai bune oportunități:</p>

            <!-- Code box -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
              <tr>
                <td align="center" bgcolor="#111111" style="background-color:#111111;border:2px solid #34d399;border-radius:16px;padding:20px 40px;">
                  <span style="letter-spacing:10px;font-size:36px;font-weight:800;color:#ffffff;font-family:'Courier New',Courier,monospace;">${code}</span>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;color:#737373;font-size:13px;font-family:Arial,sans-serif;text-align:center;">Codul expiră în <strong style="color:#ffffff;">10 minute</strong>.</p>
            <p style="margin:0 0 24px;color:#525252;font-size:13px;font-family:Arial,sans-serif;text-align:center;">Dacă nu ai solicitat acest cod, ignoră acest email.</p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>

            <!-- Footer -->
            <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif;text-align:center;">&copy; 2026 VANDY. Toate drepturile rezervate.</p>
            <p style="margin:6px 0 0;color:#525252;font-size:12px;line-height:1.6;font-family:Arial,sans-serif;text-align:center;">Primești acest email pentru că te-ai înscris pe <a href="https://vandy.ro" style="color:#525252;text-decoration:underline;">vandy.ro</a>.</p>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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
