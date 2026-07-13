-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('uploads', 'uploads', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can view public uploads
CREATE POLICY "Public view uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

-- RLS: authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads'
    AND auth.role() = 'authenticated'
  );

-- RLS: users can update/delete their own uploads
CREATE POLICY "Users update own uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'uploads'
    AND auth.uid() = owner
  );

CREATE POLICY "Users delete own uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads'
    AND auth.uid() = owner
  );
