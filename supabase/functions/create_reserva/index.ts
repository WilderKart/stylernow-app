import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Get Auth User
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) throw new Error("Unauthorized")

        const { staff_id, service_id, start_time } = await req.json()

        if (!staff_id || !service_id || !start_time) {
            throw new Error("Missing required fields: staff_id, service_id, start_time")
        }

        // Initialize Admin Client for queries that might require bypass (e.g. checking other people's reservations)
        // Actually, checking availability usually requires seeing other reservations. 
        // RLS 'Guest view assigned reservas' might not cover "checking if slot is busy without seeing details".
        // For safety, we use Service Role to CHECK availability, but we insert as User to respect RLS or just separate concerns.
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 2. Fetch Service Details (Duration, Price) & Staff Details (Barberia)
        const { data: service, error: serviceError } = await supabaseAdmin
            .from('servicios')
            .select('*')
            .eq('id', service_id)
            .single();

        if (serviceError || !service) throw new Error("Service not found");

        const { data: staff, error: staffError } = await supabaseAdmin
            .from('staff')
            .select('barberia_id, headquarters:sede_id(*)') // assuming relation or just ID
            .eq('id', staff_id)
            .single();

        if (staffError || !staff) throw new Error("Staff not found");

        // 3. Calculate End Time
        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(startTimeDate.getTime() + service.duration_minutes * 60000);
        const end_time = endTimeDate.toISOString();

        // 4. Validate Overlap in Reservas
        const { data: conflicts } = await supabaseAdmin
            .from('reservas')
            .select('id')
            .eq('staff_id', staff_id)
            .neq('status', 'cancelled')
            .neq('status', 'no_show') // Maybe?
            // Logic: (StartA < EndB) and (EndA > StartB)
            .lt('start_time', end_time)
            .gt('end_time', start_time)

        if (conflicts && conflicts.length > 0) {
            return new Response(JSON.stringify({ error: "El horario seleccionado ya no está disponible." }), {
                status: 409,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 5. Validate Bloqueos
        const { data: blocks } = await supabaseAdmin
            .from('bloqueos_horarios')
            .select('id')
            .eq('staff_id', staff_id)
            .lt('start_date', end_time)
            .gt('end_date', start_time)

        if (blocks && blocks.length > 0) {
            return new Response(JSON.stringify({ error: "El especialista no está disponible en este horario." }), {
                status: 409,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 6. Create Reservation (Pending) using SERVICE ROLE to bypass "INSERT DENY ALL" on table
        // (Since we decided RLS defaults to DENY for Insert, forcing use of this Function)
        const { data: reserva, error: createError } = await supabaseAdmin
            .from('reservas')
            .insert({
                cliente_id: user.id,
                staff_id,
                service_id,
                barberia_id: staff.barberia_id,
                sede_id: staff.sede_id || null, // Handle optional
                start_time,
                end_time,
                status: 'pending',
                wompi_reference: `REF-${Date.now()}-${user.id.slice(0, 4)}`
            })
            .select()
            .single();

        if (createError) throw createError;

        // 7. Success Response
        return new Response(JSON.stringify({
            data: reserva,
            payment_info: {
                reference: reserva.wompi_reference,
                amount_in_cents: service.price * 100,
                currency: 'COP',
                public_key: 'pub_test_...' // Should be env var
            }
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        })
    }
})
