ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS block text,
  ADD COLUMN IF NOT EXISTS thana text,
  ADD COLUMN IF NOT EXISTS mouza text,
  ADD COLUMN IF NOT EXISTS owner_name text;