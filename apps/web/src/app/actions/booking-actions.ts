'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Configuration (Should be in Env/Settings in V3)
const CHECKIN_WINDOW_START_MIN = -15 // 15 min before
const CHECKIN_WINDOW_END_MIN = 10    // 10 min after

export async function checkInReservation(bookingId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            (cookieStore as any).set(name, value, options)
                        )
                    } catch {
                        // Server Action called from Client Component, ignored
                    }
                },
            },
        }
    )

    // 1. Validate Session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    // 2. Fetch Booking
    const { data: booking, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('id', bookingId)
        .single()

    if (error || !booking) {
        return { success: false, error: 'Booking not found' }
    }

    // 3. Validate Ownership & Status
    if (booking.cliente_id !== user.id) {
        return { success: false, error: 'Unauthorized access to booking' }
    }

    if (booking.status === 'checked_in') {
        return { success: true, message: 'Already checked in' }
    }

    if (booking.status !== 'confirmed') {
        return { success: false, error: `Invalid status for check-in: ${booking.status}` }
    }

    // 4. Validate Time Window
    const now = new Date()
    const startTime = new Date(booking.start_time)
    const diffMin = (now.getTime() - startTime.getTime()) / 60000

    // e.g. Start 10:00. Now 09:40. Diff = -20. Window Start = -15. Too early.
    // e.g. Start 10:00. Now 10:05. Diff = +5. Window End = 10. OK.
    // e.g. Start 10:00. Now 10:15. Diff = +15. Too late.

    // STRICT MODE: Uncomment for production enforcement
    /*
    if (diffMin < CHECKIN_WINDOW_START_MIN) {
         return { success: false, error: 'Too early to check in. Try 15 mins before.' }
    }
    if (diffMin > CHECKIN_WINDOW_END_MIN) {
         return { success: false, error: 'Check-in window expired.' }
    }
    */

    // NOTE: For MVP Demo, we allow check-in anytime if confirmed, 
    // BUT since user asked for REAL LOGIC, I will enforce it but maybe allow a larger window for testing?
    // User said: "Validate Time Window". I will enforce it but make it wide enough or log it.
    // Actually, I'll enforce it as requested but maybe warn.
    // DECISION: Strict Window Enforced as per "Lógica Real".

    // (Self-Correction): If I enforce strict window, testing right now is hard unless I book for NOW.
    // I will enforce it. User must book a slot close to NOW.

    if (diffMin < CHECKIN_WINDOW_START_MIN) {
        return { success: false, error: 'Es muy temprano. Puedes hacer check-in 15 min antes.' }
    }
    if (diffMin > CHECKIN_WINDOW_END_MIN) {
        return { success: false, error: 'La ventana de check-in ha expirado.' }
    }

    // 5. Perform Update
    const { error: updateError } = await supabase
        .from('reservas')
        .update({
            status: 'checked_in',
            checkin_at: new Date().toISOString()
        })
        .eq('id', bookingId)

    if (updateError) {
        return { success: false, error: 'DB Update Failed' }
    }

    revalidatePath('/client/appointments')
    return { success: true }
}
