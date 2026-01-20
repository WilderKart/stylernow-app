"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js" // Client-side hydration
import { createBrowserClient } from "@supabase/ssr"
import { Reserva, Barberia, Servicio, Staff } from "@/types/db"
import { checkInReservation } from "@/app/actions/booking-actions"
import { Calendar, Clock, MapPin, CheckCircle, Navigation, AlertCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { toast } from "sonner" // Assuming sonner is available, or alert

// Types for joined data
type BookingWithDetails = Reserva & {
    barberia: Barberia
    servicio: Servicio
    staff: Staff
}

export default function AppointmentsPage() {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

    // Client-side fetcher (Using supabase-js for easy relational query)
    // In strict Next.js, this should be a Server Component fetching data, 
    // but for Client Interactive Search/Filter, 'use client' is fine with useEffect.
    useEffect(() => {
        const fetchBookings = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    barberia:barberias(*),
                    servicio:servicios(*),
                    staff:staff(*)
                `)
                .eq('cliente_id', user.id)
                .order('start_time', { ascending: true })

            if (!error && data) {
                setBookings(data as any)
            }
            setLoading(false)
        }
        fetchBookings()
    }, [])

    const handleCheckIn = async (bookingId: string) => {
        const result = await checkInReservation(bookingId)
        if (result.success) {
            // Optimistic update or refetch
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'checked_in' } : b
            ))
            alert("¡Llegaste! Tu estilista ha sido notificado.")
        } else {
            alert(result.error)
        }
    }

    // Filter logic
    const upcoming = bookings.filter(b => ['pending', 'confirmed', 'checked_in'].includes(b.status))
    const history = bookings.filter(b => ['completed', 'cancelled', 'no_show'].includes(b.status))

    const displayed = activeTab === 'upcoming' ? upcoming : history

    return (
        <div className="bg-gray-50 min-h-screen pb-24 px-6 pt-12">
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-6">Mis Citas</h1>

            {/* Tabs */}
            <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                    Próximas
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                    Historial
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />)}
                </div>
            ) : displayed.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">No tienes citas en esta sección.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayed.map(booking => {
                        const start = new Date(booking.start_time)
                        const isConfirmed = booking.status === 'confirmed'
                        const isCheckedIn = booking.status === 'checked_in'

                        return (
                            <motion.div
                                key={booking.id}
                                layout
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative">
                                            <Image src={booking.barberia?.banner_url || "/placeholder.jpg"} alt="Logo" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{booking.servicio?.name}</h3>
                                            <p className="text-xs text-gray-500">{booking.barberia?.name}</p>
                                        </div>
                                    </div>
                                    {/* Status Badge */}
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-500'
                                        }`}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        <span className="font-medium">{start.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span className="font-medium">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {activeTab === 'upcoming' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {isConfirmed && (
                                            <button
                                                onClick={() => handleCheckIn(booking.id)}
                                                className="col-span-2 py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-brand/20"
                                            >
                                                <Navigation size={18} />
                                                ¡Llegué! (Check-in)
                                            </button>
                                        )}
                                        {isCheckedIn && (
                                            <div className="col-span-2 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-blue-100">
                                                <CheckCircle size={18} />
                                                En espera de atención
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
