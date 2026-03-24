-- Run this in Supabase SQL Editor for project "VANDY Website"
-- https://supabase.com/dashboard → VANDY Website → SQL Editor

CREATE TABLE public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  email_step integer DEFAULT 0 NOT NULL,
  last_email_sent_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON public.leads
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous update" ON public.leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
