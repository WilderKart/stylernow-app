-- Phase 5: Ingresos & Facturación

-- 1. Table: propinas
CREATE TABLE public.propinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES public.reservas(id) NOT NULL,
  staff_id UUID REFERENCES public.staff(id) NOT NULL,
  monto NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.propinas ENABLE ROW LEVEL SECURITY;

-- 2. Table: staff_earnings (Aggregated)
CREATE TABLE public.staff_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) NOT NULL,
  periodo_start DATE NOT NULL,
  periodo_end DATE NOT NULL,
  total_servicios NUMERIC(10,2) DEFAULT 0,
  total_propinas NUMERIC(10,2) DEFAULT 0,
  total_pagar NUMERIC(10,2) GENERATED ALWAYS AS (total_servicios + total_propinas) STORED,
  status TEXT DEFAULT 'calculated', -- calculated, paid
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.staff_earnings ENABLE ROW LEVEL SECURITY;

-- 3. Table: comisiones_clientes_nuevos
CREATE TABLE public.comisiones_clientes_nuevos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barberia_id UUID REFERENCES public.barberias(id) NOT NULL,
  reserva_id UUID REFERENCES public.reservas(id) NOT NULL,
  monto NUMERIC(10,2) NOT NULL, -- 30% of first service
  estado TEXT DEFAULT 'pending', -- pending, billed, paid
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.comisiones_clientes_nuevos ENABLE ROW LEVEL SECURITY;

-- 4. Table: suscripciones
CREATE TABLE public.suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barberia_id UUID REFERENCES public.barberias(id) NOT NULL,
  plan TEXT NOT NULL, -- ESSENTIAL, etc.
  precio_mensual NUMERIC(10,2) NOT NULL,
  renovacion_next DATE NOT NULL,
  estado TEXT DEFAULT 'active', -- active, past_due, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

-- 5. Table: facturas (Monthly Bill to Barberia)
CREATE TABLE public.facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barberia_id UUID REFERENCES public.barberias(id) NOT NULL,
  periodo_mes DATE NOT NULL, -- First day of month
  total_suscripcion NUMERIC(10,2) NOT NULL,
  total_comisiones NUMERIC(10,2) NOT NULL,
  total_pagar NUMERIC(10,2) GENERATED ALWAYS AS (total_suscripcion + total_comisiones) STORED,
  estado TEXT DEFAULT 'pending', -- pending, paid, overdue
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

-- RLS
-- Propinas: Client (Write), Staff (Read own), Owner (Read)
CREATE POLICY "Client insert propinas" ON public.propinas FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reservas WHERE id = propinas.reserva_id AND cliente_id = auth.uid())
);
CREATE POLICY "Staff read own propinas" ON public.propinas FOR SELECT USING (
  staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
);
CREATE POLICY "Owner read propinas" ON public.propinas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reservas r JOIN public.barberias b ON r.barberia_id = b.id WHERE r.id = propinas.reserva_id AND b.owner_id = auth.uid())
);

-- Facturas: Owner (Read), Admin (All)
CREATE POLICY "Owner read own facturas" ON public.facturas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.barberias WHERE id = facturas.barberia_id AND owner_id = auth.uid())
);
