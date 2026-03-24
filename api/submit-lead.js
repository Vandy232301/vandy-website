import { getEmail } from './_lib/emails.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://najyetpmxjqgjrppuytn.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, phone, verificationCode } = req.body || {};

  if (!firstName || !lastName || !email || !phone || !verificationCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailNorm = email.trim().toLowerCase();

  try {
    const verifyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/email_verifications?email=eq.${encodeURIComponent(emailNorm)}&code=eq.${verificationCode}&verified=eq.false&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!verifyRes.ok) {
      console.error('Verification check error:', await verifyRes.text());
      return res.status(500).json({ error: 'Verification check failed' });
    }

    const verifications = await verifyRes.json();
    if (!verifications.length) {
      return res.status(400).json({ error: 'Cod de verificare invalid sau expirat' });
    }

    const verification = verifications[0];
    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Codul a expirat. Solicită un cod nou.' });
    }

    await fetch(
      `${SUPABASE_URL}/rest/v1/email_verifications?id=eq.${verification.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ verified: true }),
      }
    );

    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: emailNorm,
        phone: phone.trim(),
        email_step: 1,
        last_email_sent_at: new Date().toISOString(),
      }),
    });

    if (!supaRes.ok) {
      const err = await supaRes.text();
      console.error('Supabase insert error:', err);
      if (err.includes('leads_email_unique')) {
        return res.status(409).json({ error: 'Acest email este deja înregistrat.' });
      }
      return res.status(500).json({ error: 'Failed to save lead' });
    }

    const welcomeEmail = getEmail(1, firstName.trim());
    if (welcomeEmail && RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'VANDY <noreply@vandy.ro>',
          to: [emailNorm],
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
        }),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Submit lead error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
