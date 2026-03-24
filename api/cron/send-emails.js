import { getEmail, EMAIL_SCHEDULE } from '../_lib/emails.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cxamezffjphbbbswvhcw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YW1lemZmanBoYmJic3d2aGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjgwOTIsImV4cCI6MjA4ODgwNDA5Mn0.4aN_ZJv4DB9ckCxdJoHQarw0mwl_ff8WSLI1xdbRpM4';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!RESEND_API_KEY || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const leadsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?email_step=lt.5&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!leadsRes.ok) {
      console.error('Failed to fetch leads:', await leadsRes.text());
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }

    const leads = await leadsRes.json();
    let sent = 0;
    let skipped = 0;

    for (const lead of leads) {
      const nextStep = lead.email_step + 1;
      const daysRequired = EMAIL_SCHEDULE[nextStep];

      if (daysRequired === undefined) {
        skipped++;
        continue;
      }

      const createdAt = new Date(lead.created_at);
      const now = new Date();
      const daysSinceSignup = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceSignup < daysRequired) {
        skipped++;
        continue;
      }

      if (lead.last_email_sent_at) {
        const lastSent = new Date(lead.last_email_sent_at);
        const hoursSinceLastEmail = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastEmail < 20) {
          skipped++;
          continue;
        }
      }

      const emailData = getEmail(nextStep, lead.first_name);
      if (!emailData) {
        skipped++;
        continue;
      }

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'VANDY <noreply@vandy.ro>',
          to: [lead.email],
          subject: emailData.subject,
          html: emailData.html,
        }),
      });

      if (emailRes.ok) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email_step: nextStep,
              last_email_sent_at: new Date().toISOString(),
            }),
          }
        );
        sent++;
      } else {
        console.error(`Failed to send email to ${lead.email}:`, await emailRes.text());
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return res.status(200).json({
      success: true,
      total: leads.length,
      sent,
      skipped,
    });
  } catch (err) {
    console.error('Cron error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
