-- Phase 3: Reservas + FSM
-- Phase 4: Pagos (Indirectos)

-- 1. Table: reservas
CREATE TABLE public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.users(id) NOT NULL,
  barberia_id UUID REFERENCES public.barberias(id) NOT NULL,
  sede_id UUID REFERENCES public.sedes(id), -- Optional
  staff_id UUID REFERENCES public.staff(id) NOT NULL,
  servicio_id UUID REFERENCES public.servicios(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- FSM States: pending, confirmed, cancelled, completed, no_show
  status TEXT NOT NULL DEFAULT 'pending',
  wompi_reference TEXT, -- Reference returned to client for payment
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 2. Table: pagos
-- Stylernow DOES NOT CUSTODY MONEY. This table records the EVENT of payment.
CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE NOT NULL,
  monto NUMERIC(10,2) NOT NULL,
  wompi_transaction_id TEXT,
  status TEXT DEFAULT 'approved', -- approved, voided
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Reservas
-- INSERT: DENY ALL (Must use Edge Function create_reserva)
-- SELECT: 
-- 1. Cliente: Own
CREATE POLICY "Cliente view own reservas" ON public.reservas FOR SELECT USING (cliente_id = auth.uid());
-- 2. Staff: Assigned
-- Need a way to match staff.user_id to auth.uid()
CREATE POLICY "Staff view assigned reservas" ON public.reservas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.staff WHERE id = reservas.staff_id AND user_id = auth.uid())
);
-- 3. Barberia Owner: All in barberia
CREATE POLICY "Owner view barberia reservas" ON public.reservas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.barberias WHERE id = reservas.barberia_id AND owner_id = auth.uid())
);

-- Pagos
-- SELECT: Similar to reservas
CREATE POLICY "Cliente view own pagos" ON public.pagos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reservas WHERE id = pagos.reserva_id AND cliente_id = auth.uid())
);
CREATE POLICY "Owner view stats pagos" ON public.pagos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reservas r 
          JOIN public.barberias b ON r.barberia_id = b.id 
          WHERE r.id = pagos.reserva_id AND b.owner_id = auth.uid())
);
