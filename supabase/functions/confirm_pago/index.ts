import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    try {
        const body = await req.json();
        const { data } = body; // Wompi Payload structure
        const { reference, status, amount_in_cents } = data.transaction;

        // 1. Verify Signature (TODO: Implement Wompi signature check with secret)
        // const signature = body.signature; 
        // ...

        if (status !== 'APPROVED') {
            // Handle void/decline
            return new Response("Ignored", { status: 200 });
        }

        // 2. Find Booking by Reference
        const { data: booking, error: findError } = await supabaseAdmin
            .from('reservas')
            .select('*, barberias(*)')
            .eq('wompi_reference', reference)
            .single();

        if (findError || !booking) return new Response("Booking not found", { status: 404 });

        // 3. Mark Booking Confirmed
        await supabaseAdmin
            .from('reservas')
            .update({ status: 'confirmed' })
            .eq('id', booking.id);

        // 4. Record Payment Event
        await supabaseAdmin
            .from('pagos')
            .insert({
                reserva_id: booking.id,
                monto: amount_in_cents / 100,
                wompi_transaction_id: data.transaction.id,
                status: 'approved'
            });

        // 5. Check New Client logic (First booking?)
        const { count } = await supabaseAdmin
            .from('reservas')
            .select('id', { count: 'exact', head: true })
            .eq('cliente_id', booking.cliente_id)
            .eq('status', 'completed'); // Only count completed? Or confirmed? Document says "Primer servicio"

        if (count === 0) {
            // Create Commission Record (30%)
            await supabaseAdmin
                .from('comisiones_clientes_nuevos')
                .insert({
                    barberia_id: booking.barberia_id,
                    reserva_id: booking.id,
                    monto: (amount_in_cents / 100) * 0.30,
                    estado: 'pending'
                });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
