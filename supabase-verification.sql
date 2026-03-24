-- Run this in Supabase SQL Editor for project "VANDY Website"
-- Adds email verification support

CREATE TABLE public.email_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.email_verifications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON public.email_verifications
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous update" ON public.email_verifications
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_email_verifications_email_code ON public.email_verifications (email, code);

-- Also add UNIQUE constraint on leads email to prevent duplicates
ALTER TABLE public.leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
