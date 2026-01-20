-- 1. Add checkin_at column for audit/logic
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS checkin_at TIMESTAMPTZ;

-- 2. Enforce Strict FSM States via Check Constraint
-- Drop old constraint if exists (safe retry)
ALTER TABLE public.reservas DROP CONSTRAINT IF EXISTS reservas_status_check;

-- Add new strict constraint
ALTER TABLE public.reservas 
ADD CONSTRAINT reservas_status_check 
CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'));

-- 3. Comment for documentation
COMMENT ON COLUMN public.reservas.status IS 'FSM: pending -> confirmed -> checked_in -> completed';
