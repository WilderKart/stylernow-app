-- V2.1 Refinements
-- 1. Subscription Status Enum
-- Must include: active, past_due, canceled, trialing, blocked
CREATE TYPE public.subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing', 'blocked');

-- 2. Drop old default first (to avoid casting errors)
ALTER TABLE public.subscriptions ALTER COLUMN status DROP DEFAULT;

-- 3. Alter Subscriptions to use Enum (Strict Casting)
ALTER TABLE public.subscriptions 
  ALTER COLUMN status TYPE public.subscription_status 
  USING status::text::public.subscription_status;

-- 4. Default to 'trialing' (V2.1 Requirement)
ALTER TABLE public.subscriptions ALTER COLUMN status SET DEFAULT 'trialing'::public.subscription_status;


-- 4. Manager Logic Note:
-- Manager role is logically distinct from Staff.
-- They will coexist in 'staff' table but RLS policies must treat them differently based on user.role = 'manager'.

-- ROLLBACK PLAN:
-- 1. ALTER TABLE public.subscriptions ALTER COLUMN status DROP DEFAULT;
-- 2. ALTER TABLE public.subscriptions ALTER COLUMN status TYPE text USING status::text;
-- 3. DROP TYPE public.subscription_status;


