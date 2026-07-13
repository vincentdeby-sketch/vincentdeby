
-- Grant INSERT to anon/authenticated so the public estimation form can submit
GRANT INSERT ON public.estimations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.estimations TO authenticated;
GRANT ALL ON public.estimations TO service_role;

-- Align default status with the RLS policy ("pending")
ALTER TABLE public.estimations ALTER COLUMN status SET DEFAULT 'pending';
