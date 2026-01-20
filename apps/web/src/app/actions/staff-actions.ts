'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getStaffAgenda() {
    const cookieStore = cookies()
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
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Action called from Client Component
                    }
                },
            },
        }
    )

    // 1. Authenticate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // 2. Identify Staff Profile
    // We assume staff.user_id = auth.uid. RLS also enforces this.
    // Fetch directly from reservas where staff_id matches our profile.
    // First get staff profile ID
    const { data: staffProfile } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!staffProfile) return { success: false, error: 'Staff profile not found' }

    // 3. Fetch Agenda (Today + Future) from DB
    // STRICT: Source of Truth = DB
    const { data: agenda, error } = await supabase
        .from('reservas')
        .select(`
            *,
            servicio:servicios(name, duration_minutes, price),
            cliente:users(full_name, email, phone) 
        `) // Note: 'cliente' relation might need explicit name in Schema if strictly mapped
        .eq('staff_id', staffProfile.id)
        .order('start_time', { ascending: true })

    if (error) return { success: false, error: error.message }

    return { success: true, data: agenda }
}

export async function completeReservation(bookingId: string) {
    const cookieStore = cookies()
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
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )

    // 1. Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // 2. Get Staff Profile
    const { data: staffProfile } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!staffProfile) return { success: false, error: 'Not a staff member' }

    // 3. Fetch Booking & Validate Ownership + State
    const { data: booking } = await supabase
        .from('reservas')
        .select('*')
        .eq('id', bookingId)
        .single()

    if (!booking) return { success: false, error: 'Booking not found' }

    if (booking.staff_id !== staffProfile.id) {
        return { success: false, error: 'Access denied: Valid check-in ownership required.' }
    }

    // STRICT FSM: checked_in -> completed ONLY
    if (booking.status !== 'checked_in') {
        return { success: false, error: `Invalid transition. Must be checked_in to complete. Current: ${booking.status}` }
    }

    // 4. Update
    const { error: updateError } = await supabase
        .from('reservas')
        .update({ status: 'completed' })
        .eq('id', bookingId)

    if (updateError) return { success: false, error: 'DB Update Failed' }

    revalidatePath('/staff/home')
    revalidatePath('/staff/agenda')

    return { success: true }
}
