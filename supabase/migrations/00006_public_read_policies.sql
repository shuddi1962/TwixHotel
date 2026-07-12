-- Public read access so the guest-facing site can render without auth
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active hotels" ON hotels;
CREATE POLICY "Public can view active hotels" ON hotels
  FOR SELECT USING (status = 1);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view rooms" ON rooms;
CREATE POLICY "Public can view rooms" ON rooms
  FOR SELECT USING (true);

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view amenities" ON amenities;
CREATE POLICY "Public can view amenities" ON amenities
  FOR SELECT USING (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (true);
