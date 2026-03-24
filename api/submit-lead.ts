import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEmail } from './_lib/emails';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://najyetpmxjqgjrppuytn.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, phone } = req.body || {};

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
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
        email: email.trim(),
        phone: phone.trim(),
        email_step: 1,
        last_email_sent_at: new Date().toISOString(),
      }),
    });

    if (!supaRes.ok) {
      const err = await supaRes.text();
      console.error('Supabase insert error:', err);
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
          to: [email.trim()],
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
