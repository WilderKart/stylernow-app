-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Enum for Role Type
CREATE TYPE public.role_type AS ENUM (
  'superuser',
  'admin',
  'barberia',
  'staff',
  'cliente'
);

-- 2. Create Public Users Table (Synced with Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role public.role_type NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS - Enable on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. RLS - Policies
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Policy: Users can update their own profile (restricted fields in frontend, strict here?)
-- We'll allow them to update basic info, but role is protected by ignoring it in update triggers or separate admin function.
-- For now, just SELECT is critical. UPDATE might be needed for profile data.

-- Policy: SuperUser can view all
-- We need a way to bootstrap the first SuperUser or define the policy based on the role itself.
-- Recursive policy issue: If we say "USING (get_user_role() = 'superuser')", we need get_user_role to read this table.
-- Solution: Use a JWT claim or a separate secure setup. For now, we will rely on a secure way later.
-- Let's stick to "Users can view own profile" for now.

-- 5. Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'cliente'); -- Default role is ALWAYS cliente
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Helper Function get_user_role (Phase 1.3)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.role_type AS $$
DECLARE
  v_role public.role_type;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
