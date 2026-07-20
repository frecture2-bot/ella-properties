
DROP POLICY IF EXISTS "public read active team" ON public.team_members;
REVOKE SELECT ON public.team_members FROM anon;
GRANT SELECT (id, name, role, photo_url, description, sort_order, is_active, created_at, updated_at)
  ON public.team_members TO anon;
CREATE POLICY "public read active team" ON public.team_members
  FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "admins manage inquiries" ON public.inquiries;
CREATE POLICY "admins read inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "staff update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "anyone can submit" ON public.inquiries;
DROP POLICY IF EXISTS "auth can submit" ON public.inquiries;
CREATE POLICY "anyone can submit" ON public.inquiries
  FOR INSERT TO anon
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 100
    AND char_length(trim(message)) BETWEEN 1 AND 2000
    AND (email IS NULL OR char_length(email) <= 255)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND status = 'Ново'
  );
CREATE POLICY "auth can submit" ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 100
    AND char_length(trim(message)) BETWEEN 1 AND 2000
    AND (email IS NULL OR char_length(email) <= 255)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND status = 'Ново'
  );
