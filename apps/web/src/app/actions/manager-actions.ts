'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Types
export type SedeDashboardStats = {
    todaySales: number
    activeStaff: number
    clientsOnSite: number
    occupancy: number // simple %
}

export type StaffStatus = {
    id: string
    name: string
    status: 'idle' | 'busy' | 'offline' // derived
    currentBooking?: any
}

export async function getSedeDashboard() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => { } // Read-only mostly
            },
        }
    )

    // 1. Auth & Consistency
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // 2. Identify Sede via Staff Table
    // Manager must be linked to a Sede
    const { data: managerProfile } = await supabase
        .from('staff')
        .select('sede_id')
        .eq('user_id', user.id)
        .single()

    if (!managerProfile?.sede_id) {
        return { success: false, error: 'Manager not assigned to any Sede' }
    }
    const sedeId = managerProfile.sede_id

    // 3. Gather KPIs (Strictly from DB)
    const today = new Date().toISOString().split('T')[0]

    // Query Today's Bookings for this Sede
    const { data: bookings } = await supabase
        .from('reservas')
        .select(`
            id, status, start_time, checkin_at,
            servicio:servicios(price, duration_minutes),
            staff_id
        `)
        .eq('sede_id', sedeId)
        .gte('start_time', `${today}T00:00:00`)
        .lt('start_time', `${today}T23:59:59`)

    const todayBookings = bookings || []

    // A. Sales (Completed only)
    const todaySales = todayBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.servicio?.price || 0), 0)

    // B. Clients On Site (checked_in)
    const clientsOnSite = todayBookings.filter(b => b.status === 'checked_in').length

    // C. Active Staff (Staff with check_in or confirmed booking NOW)
    // Simple logic: Count unique staff_ids in bookings today? No, active NOW.
    // Let's count unique staff_ids who have a booking overlapping NOW or checking_in status.
    // Better: Query 'staff' table for this Sede, then map against bookings.

    const { data: allStaff } = await supabase
        .from('staff')
        .select('id, name, is_active')
        .eq('sede_id', sedeId)
        .eq('is_active', true)

    const staffList = allStaff || []

    // Determine status per staff
    const now = new Date()
    const staffStatuses: StaffStatus[] = staffList.map(s => {
        // Is busy if has a booking that is 'checked_in' OR 'confirmed' & time overlaps
        const activeBooking = todayBookings.find(b => {
            if (b.staff_id !== s.id) return false
            if (b.status === 'checked_in') return true // Definitely busy

            // If confirmed, check time window
            if (b.status === 'confirmed') {
                const start = new Date(b.start_time)
                const end = new Date(start.getTime() + (b.servicio?.duration_minutes || 30) * 60000)
                return now >= start && now <= end
            }
            return false
        })

        return {
            id: s.id,
            name: s.name,
            status: activeBooking ? 'busy' : 'idle',
            currentBooking: activeBooking
        }
    })

    const activeStaffCount = staffStatuses.filter(s => s.status === 'busy').length

    // D. Occupancy (Busy / Total Active Staff)
    const occupancy = staffList.length > 0
        ? Math.round((activeStaffCount / staffList.length) * 100)
        : 0

    return {
        success: true,
        data: {
            stats: {
                todaySales,
                clientsOnSite,
                activeStaff: activeStaffCount,
                occupancy
            },
            liveStaff: staffStatuses
        }
    }
}
