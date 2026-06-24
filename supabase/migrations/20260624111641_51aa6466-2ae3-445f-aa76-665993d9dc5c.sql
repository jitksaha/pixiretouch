
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('image','video')),
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL DEFAULT 0,
  width int,
  height int,
  tags text[] NOT NULL DEFAULT '{}',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view media" ON public.media_assets
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert media" ON public.media_assets
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update media" ON public.media_assets
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete media" ON public.media_assets
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER media_assets_set_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX media_assets_created_at_idx ON public.media_assets (created_at DESC);
CREATE INDEX media_assets_tags_idx ON public.media_assets USING GIN (tags);

-- Storage policies for the 'media' bucket
CREATE POLICY "Authenticated read media bucket" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Admins upload to media bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update media bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete media bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
