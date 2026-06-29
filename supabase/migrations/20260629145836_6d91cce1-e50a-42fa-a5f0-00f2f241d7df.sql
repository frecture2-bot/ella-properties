
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;

-- Storage policies for property-images bucket: public read, admin/editor write
CREATE POLICY "public read property images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'property-images');

CREATE POLICY "admins upload property images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "admins update property images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'property-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "admins delete property images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
