DROP POLICY IF EXISTS "Anyone can submit lead" ON public.leads;

CREATE POLICY "Anyone can submit lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(location)) BETWEEN 1 AND 500
  AND length(btrim(timeline)) BETWEEN 1 AND 100
  AND length(btrim(occupation)) BETWEEN 1 AND 100
  AND length(btrim(price_basis)) BETWEEN 1 AND 200
  AND length(btrim(contact_method)) BETWEEN 1 AND 50
  AND length(btrim(contact_name)) BETWEEN 1 AND 200
  AND length(btrim(contact_value)) BETWEEN 1 AND 300
  AND (motivation IS NULL OR length(motivation) <= 1000)
  AND (slot IS NULL OR length(slot) <= 200)
);