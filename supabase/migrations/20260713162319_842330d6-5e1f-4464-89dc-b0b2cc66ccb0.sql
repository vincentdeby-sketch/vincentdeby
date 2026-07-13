
-- 1. Move has_role out of exposed public schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- Recreate policies to use private.has_role
DROP POLICY IF EXISTS "Admins manage properties" ON public.properties;
DROP POLICY IF EXISTS "Admins read all properties" ON public.properties;
CREATE POLICY "Admins manage properties" ON public.properties FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins read all properties" ON public.properties FOR SELECT
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage articles" ON public.articles;
DROP POLICY IF EXISTS "Admins read all articles" ON public.articles;
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins read all articles" ON public.articles FOR SELECT
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage estimations" ON public.estimations;
DROP POLICY IF EXISTS "Admins read estimations" ON public.estimations;
CREATE POLICY "Admins manage estimations" ON public.estimations FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins read estimations" ON public.estimations FOR SELECT
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Wrapper in public that calls private version, kept for existing app code (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.has_role(_user_id, _role);
$$;

-- 2. Tighten permissive INSERT policy on estimations
DROP POLICY IF EXISTS "Anyone can submit estimation" ON public.estimations;
CREATE POLICY "Anyone can submit estimation" ON public.estimations FOR INSERT
  WITH CHECK (
    contact_email IS NOT NULL
    AND length(trim(contact_email)) > 3
    AND contact_email LIKE '%_@_%.__%'
    AND address IS NOT NULL
    AND length(trim(address)) > 0
    AND property_type IS NOT NULL
    AND status = 'pending'
  );
