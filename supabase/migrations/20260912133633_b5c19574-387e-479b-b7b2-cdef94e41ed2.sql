-- 1) Remove automatic "first user becomes admin" escalation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_role();

-- 2) Robust role check (no policy recursion), callable only by signed-in users / server
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3) Properties: admin-only writes; staff may read unpublished, others only published
DROP POLICY IF EXISTS "admins manage properties" ON public.properties;
DROP POLICY IF EXISTS "auth read all properties" ON public.properties;
CREATE POLICY "admins manage properties" ON public.properties
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "auth read properties" ON public.properties
  FOR SELECT TO authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 4) Property images: admin-only writes
DROP POLICY IF EXISTS "admins manage images" ON public.property_images;
CREATE POLICY "admins manage images" ON public.property_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5) Team members: signed-in non-admins see only active members
DROP POLICY IF EXISTS "auth read team" ON public.team_members;
CREATE POLICY "auth read team" ON public.team_members
  FOR SELECT TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

-- 6) Storage: admin-only writes to property-images
DROP POLICY IF EXISTS "admins upload property images" ON storage.objects;
DROP POLICY IF EXISTS "admins update property images" ON storage.objects;
DROP POLICY IF EXISTS "admins delete property images" ON storage.objects;
CREATE POLICY "admins upload property images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update property images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete property images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

-- 7) Inquiries: no direct inserts from the Data API; go through submit_inquiry()
DROP POLICY IF EXISTS "anyone can submit" ON public.inquiries;
DROP POLICY IF EXISTS "auth can submit" ON public.inquiries;
REVOKE ALL ON public.inquiries FROM anon;
REVOKE INSERT ON public.inquiries FROM authenticated;

CREATE TABLE IF NOT EXISTS public.inquiry_rate_limits (
  bucket_key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 1
);
GRANT ALL ON public.inquiry_rate_limits TO service_role;
ALTER TABLE public.inquiry_rate_limits ENABLE ROW LEVEL SECURITY;
-- no policies: locked for anon/authenticated

CREATE OR REPLACE FUNCTION public.submit_inquiry(
  _name text, _phone text, _email text, _message text, _property_id uuid, _client_key text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text := left(btrim(coalesce(_name, '')), 100);
  v_phone text := nullif(left(btrim(coalesce(_phone, '')), 40), '');
  v_email text := nullif(left(btrim(coalesce(_email, '')), 255), '');
  v_message text := left(btrim(coalesce(_message, '')), 2000);
  v_prop uuid := NULL;
  v_hits integer;
  v_id uuid;
BEGIN
  IF char_length(v_name) < 1 OR char_length(v_message) < 1 THEN
    RAISE EXCEPTION 'invalid_input' USING ERRCODE = '22023';
  END IF;
  IF v_email IS NOT NULL AND v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid_email' USING ERRCODE = '22023';
  END IF;
  IF v_phone IS NOT NULL AND v_phone !~ '^[0-9+()\s\-./]{5,40}$' THEN
    RAISE EXCEPTION 'invalid_phone' USING ERRCODE = '22023';
  END IF;
  IF _property_id IS NOT NULL THEN
    SELECT id INTO v_prop FROM public.properties WHERE id = _property_id AND is_published = true;
  END IF;

  -- housekeeping: drop stale windows
  DELETE FROM public.inquiry_rate_limits WHERE window_start < now() - interval '2 hours';

  -- per-visitor limit: 5 per hour
  INSERT INTO public.inquiry_rate_limits (bucket_key) VALUES ('ip:' || coalesce(_client_key, 'unknown'))
  ON CONFLICT (bucket_key) DO UPDATE SET
    hits = CASE WHEN inquiry_rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE inquiry_rate_limits.hits + 1 END,
    window_start = CASE WHEN inquiry_rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE inquiry_rate_limits.window_start END
  RETURNING hits INTO v_hits;
  IF v_hits > 5 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = '54000';
  END IF;

  -- global limit: 100 per hour
  INSERT INTO public.inquiry_rate_limits (bucket_key) VALUES ('global')
  ON CONFLICT (bucket_key) DO UPDATE SET
    hits = CASE WHEN inquiry_rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE inquiry_rate_limits.hits + 1 END,
    window_start = CASE WHEN inquiry_rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE inquiry_rate_limits.window_start END
  RETURNING hits INTO v_hits;
  IF v_hits > 100 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = '54000';
  END IF;

  INSERT INTO public.inquiries (name, phone, email, message, property_id, status)
  VALUES (v_name, v_phone, v_email, v_message, v_prop, 'Ново')
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.submit_inquiry(text, text, text, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_inquiry(text, text, text, text, uuid, text) TO service_role;