
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS attachments TEXT[] NOT NULL DEFAULT '{}';

-- Allow anonymous (public) uploads to media bucket under quote-uploads/ prefix only
CREATE POLICY "Public upload quote attachments" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'quote-uploads');
