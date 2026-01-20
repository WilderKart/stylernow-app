"use client"

import { useEffect, useState } from "react"
import { getStaffAgenda, completeReservation } from "@/app/actions/staff-actions"
import { Calendar, CheckCircle, Clock, DollarSign, User } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function StaffHomePage() {
    const [agenda, setAgenda] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ todayCount: 0, earnings: 0 })

    // Polling Logic (30s)
    useEffect(() => {
        loadAgenda()
        const interval = setInterval(loadAgenda, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadAgenda = async () => {
        const result = await getStaffAgenda()
        if (result.success && result.data) {
            setAgenda(result.data)
            calculateStats(result.data)
        }
        setLoading(false)
    }

    const calculateStats = (data: any[]) => {
        const today = new Date().toDateString()
        const todayBookings = data.filter((b: any) => new Date(b.start_time).toDateString() === today)
        // Simplified earnings calc
        const earnings = todayBookings
            .filter((b: any) => b.status === 'completed')
            .reduce((acc: number, curr: any) => acc + (curr.servicio?.price || 0), 0)

        setStats({
            todayCount: todayBookings.filter((b: any) => b.status !== 'cancelled').length,
            earnings
        })
    }

    const handleComplete = async (id: string) => {
        toast.message("Completando...", { id: 'completing' })
        const res = await completeReservation(id)
        if (res.success) {
            toast.success("¡Servicio completado!", { id: 'completing' })
            loadAgenda()
        } else {
            toast.error(res.error, { id: 'completing' })
        }
    }

    // Filter Next Appointment
    const activeService = agenda.find(b => b.status === 'checked_in')
    // Find next confirmed that is in the future OR within last 30 mins
    const nextUp = activeService || agenda.find(b => b.status === 'confirmed')

    // Note: 'agenda' is sorted by start_time ascending from DB action

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-24 px-6 pt-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-display">Dashboard</h1>
                    <p className="text-zinc-400 text-sm">Resumen del día</p>
                </div>
                <div className="p-2 bg-zinc-800 rounded-full">
                    <User className="text-brand-gold" size={24} />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-yellow-500" />
                        <span className="text-xs text-zinc-400 font-bold uppercase">Citas Hoy</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.todayCount}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={18} className="text-green-400" />
                        <span className="text-xs text-zinc-400 font-bold uppercase">Ganancia</span>
                    </div>
                    <p className="text-xl font-bold tracking-tight">${stats.earnings.toLocaleString()}</p>
                </div>
            </div>

            {/* Next Appointment Hero */}
            <h2 className="text-lg font-bold mb-4">Atención Actual</h2>
            {loading ? (
                <div className="h-40 bg-zinc-800 rounded-2xl animate-pulse" />
            ) : nextUp ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl border-2 shadow-2xl relative overflow-hidden ${nextUp.status === 'checked_in'
                            ? 'bg-green-900/10 border-green-500/50'
                            : 'bg-zinc-800 border-zinc-700'
                        }`}
                >
                    {nextUp.status === 'checked_in' && (
                        <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            CLIENTE EN SITIO
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold">{nextUp.cliente?.full_name || "Cliente"}</h3>
                            <p className="text-zinc-400">{nextUp.servicio?.name}</p>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded-xl text-center min-w-[60px]">
                            <span className="block text-xs text-zinc-500 font-bold">HORA</span>
                            <span className="text-lg font-bold text-white">
                                {new Date(nextUp.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    {nextUp.status === 'checked_in' ? (
                        <button
                            onClick={() => handleComplete(nextUp.id)}
                            className="w-full py-4 bg-green-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
                        >
                            <CheckCircle size={20} />
                            Terminar Servicio
                        </button>
                    ) : (
                        <div className="w-full py-3 bg-zinc-700/50 rounded-xl text-zinc-400 text-center text-sm font-medium border border-zinc-600 border-dashed">
                            Esperando llegada del cliente...
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="p-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 text-center">
                    <Clock size={40} className="mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400">Todo listo por ahora.</p>
                </div>
            )}
        </div>
    )
}
