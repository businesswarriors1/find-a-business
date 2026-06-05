-- ============================================================
-- findabusiness.com.au — Supabase Database Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------
-- STATES
-- ------------------------------------------------------------------
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  abbreviation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ------------------------------------------------------------------
-- SUBURBS
-- ------------------------------------------------------------------
CREATE TABLE suburbs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  postcode TEXT,
  state_id UUID NOT NULL REFERENCES states(id),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(slug, state_id)
);

CREATE INDEX idx_suburbs_state_id ON suburbs(state_id);
CREATE INDEX idx_suburbs_slug ON suburbs(slug);

-- ------------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ------------------------------------------------------------------
-- BUSINESSES
-- ------------------------------------------------------------------
CREATE TYPE business_status AS ENUM ('pending', 'active', 'suspended');

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  address TEXT,
  suburb_id UUID REFERENCES suburbs(id),
  state_id UUID REFERENCES states(id),
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES categories(id),
  logo_url TEXT,
  status business_status DEFAULT 'pending',
  is_claimed BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  claimed_by UUID,
  google_place_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_category_id ON businesses(category_id);
CREATE INDEX idx_businesses_suburb_id ON businesses(suburb_id);
CREATE INDEX idx_businesses_state_id ON businesses(state_id);

-- ------------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------------
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  reviewer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  status review_status DEFAULT 'pending',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- ------------------------------------------------------------------
-- LISTING REQUESTS
-- ------------------------------------------------------------------
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE listing_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT,
  category TEXT,
  suburb TEXT,
  state TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  chat_transcript TEXT,
  honeypot_field TEXT,
  ip_address TEXT,
  source TEXT DEFAULT 'chat',
  business_id UUID REFERENCES businesses(id),
  rejection_reason TEXT,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_listing_requests_status ON listing_requests(status);

-- ------------------------------------------------------------------
-- LEADS
-- ------------------------------------------------------------------
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'qualified', 'client');

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  listing_request_id UUID REFERENCES listing_requests(id),
  stage lead_stage DEFAULT 'new',
  notes TEXT,
  assigned_to TEXT,
  next_followup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_leads_business_id ON leads(business_id);

-- ------------------------------------------------------------------
-- EMAIL SEQUENCE LOG
-- ------------------------------------------------------------------
CREATE TABLE email_sequence_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  sequence_step TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_email_sequence_log_business_id ON email_sequence_log(business_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE suburbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- --- businesses ---
CREATE POLICY "Public read active businesses" ON businesses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admin full access businesses" ON businesses
  FOR ALL USING (auth.role() = 'service_role');

-- --- reviews ---
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin manage reviews" ON reviews
  FOR ALL USING (auth.role() = 'service_role');

-- --- listing_requests ---
CREATE POLICY "Public insert listing requests" ON listing_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read listing requests" ON listing_requests
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Admin update listing requests" ON listing_requests
  FOR UPDATE USING (auth.role() = 'service_role');

-- --- leads ---
CREATE POLICY "Admin manage leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');

-- --- email_sequence_log ---
CREATE POLICY "Admin manage email sequence log" ON email_sequence_log
  FOR ALL USING (auth.role() = 'service_role');

-- ------------------------------------------------------------------
-- ADMIN (authenticated) ACCESS
-- V1 has a single admin account, so any authenticated user IS the admin.
-- These policies let the logged-in admin read/moderate via the browser
-- (anon key + session) on the admin dashboard. Privileged writes that must
-- never depend on the client (creating businesses on approval) still go
-- through server routes using the service role.
-- NOTE: revisit before introducing consumer accounts in V2.
-- ------------------------------------------------------------------

-- Admin can read every business regardless of status (dashboard/management)
CREATE POLICY "Authenticated read all businesses" ON businesses
  FOR SELECT TO authenticated USING (true);

-- Admin can read + moderate all reviews
CREATE POLICY "Authenticated read all reviews" ON reviews
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update reviews" ON reviews
  FOR UPDATE TO authenticated USING (true);

-- Admin can read + edit listing requests
CREATE POLICY "Authenticated read listing requests" ON listing_requests
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update listing requests" ON listing_requests
  FOR UPDATE TO authenticated USING (true);

-- --- states (public read) ---
CREATE POLICY "Public read states" ON states
  FOR SELECT USING (true);

-- --- suburbs (public read) ---
CREATE POLICY "Public read suburbs" ON suburbs
  FOR SELECT USING (true);

-- --- categories (public read) ---
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);
