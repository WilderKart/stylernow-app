-- Phase 2: Core Business Entities
-- Strict Order: barberias -> sedes -> staff -> servicios -> horarios -> bloqueos_horarios

-- 1. Table: barberias
CREATE TABLE public.barberias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) NOT NULL, -- Link to the User (Role: barberia)
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'ESSENTIAL', -- ESSENTIAL, STUDIO, PRESTIGE, SIGNATURE
  status TEXT NOT NULL DEFAULT 'active', -- active, blocked, past_due
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.barberias ENABLE ROW LEVEL SECURITY;

-- 2. Table: sedes
CREATE TABLE public.sedes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barberia_id UUID REFERENCES public.barberias(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;

-- 3. Table: staff
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id), -- Optional: if staff member has a login
  barberia_id UUID REFERENCES public.barberias(id) ON DELETE CASCADE NOT NULL,
  sede_id UUID REFERENCES public.sedes(id), -- Optional: if assigned to specific sede
  name TEXT NOT NULL,
  nivel TEXT DEFAULT 'Junior', -- Junior, Pro, Expert, Master
  porcentaje_ganancia NUMERIC(5,2) DEFAULT 50.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 4. Table: servicios
CREATE TABLE public.servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barberia_id UUID REFERENCES public.barberias(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

-- 5. Table: horarios (Availability)
CREATE TABLE public.horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true
);
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

-- 6. Table: bloqueos_horarios (Time Blocks)
CREATE TABLE public.bloqueos_horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES public.users(id) -- Who approved/created this block
);
ALTER TABLE public.bloqueos_horarios ENABLE ROW LEVEL SECURITY;


-- POLICIES (RLS) - "Security > UX"

-- Barberias
-- Public: Read active
CREATE POLICY "Public read active barberias" ON public.barberias FOR SELECT USING (status = 'active');
-- Owner: R/W own
CREATE POLICY "Owner manage own barberia" ON public.barberias FOR ALL USING (auth.uid() = owner_id);
-- Admin: Read all (TODO: define Admin lookup)

-- Sedes
-- Public: Read
CREATE POLICY "Public read sedes" ON public.sedes FOR SELECT USING (true);
-- Owner: Manage via barberia ownership
CREATE POLICY "Owner manage sedes" ON public.sedes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.barberias WHERE id = sedes.barberia_id AND owner_id = auth.uid())
);

-- Staff
-- Public: Read basic info
CREATE POLICY "Public read staff" ON public.staff FOR SELECT USING (is_active = true);
-- Owner: Manage
CREATE POLICY "Owner manage staff" ON public.staff FOR ALL USING (
  EXISTS (SELECT 1 FROM public.barberias WHERE id = staff.barberia_id AND owner_id = auth.uid())
);
-- Staff Member: Read/Update own basic info (if user_id linked)
CREATE POLICY "Staff update self" ON public.staff FOR UPDATE USING (user_id = auth.uid());

-- Servicios
-- Public: Read
CREATE POLICY "Public read servicios" ON public.servicios FOR SELECT USING (true);
-- Owner: Manage
CREATE POLICY "Owner manage servicios" ON public.servicios FOR ALL USING (
  EXISTS (SELECT 1 FROM public.barberias WHERE id = servicios.barberia_id AND owner_id = auth.uid())
);

-- Horarios & Bloqueos
-- Similar Owner Strategy...
