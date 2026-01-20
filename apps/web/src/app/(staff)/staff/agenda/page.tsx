"use client"

import { useEffect, useState } from "react"
import { getStaffAgenda } from "@/app/actions/staff-actions"
import { Scissors } from "lucide-react"

export default function StaffAgendaPage() {
    const [agenda, setAgenda] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAgenda()
        const interval = setInterval(loadAgenda, 60000)
        return () => clearInterval(interval)
    }, [])

    const loadAgenda = async () => {
        const result = await getStaffAgenda()
        if (result.success && result.data) {
            setAgenda(result.data)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-24 px-6 pt-12">
            <h1 className="text-3xl font-bold font-display mb-6">Agenda</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-800 rounded-xl animate-pulse" />)}
                </div>
            ) : agenda.length === 0 ? (
                <p className="text-zinc-500 text-center mt-10">Agenda vacía.</p>
            ) : (
                <div className="space-y-4">
                    {agenda.map(item => {
                        const start = new Date(item.start_time)
                        const isToday = new Date().toDateString() === start.toDateString()

                        return (
                            <div key={item.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700/50 flex gap-4">
                                <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-zinc-700 pr-4">
                                    <span className="text-lg font-bold">{start.getHours()}:{start.getMinutes().toString().padStart(2, '0')}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase">{isToday ? 'Hoy' : start.toLocaleDateString()}</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold">{item.cliente?.full_name || "Cliente"}</h3>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                                        <Scissors size={12} /> {item.servicio?.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'checked_in': return <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">EN SITIO</span>
        case 'confirmed': return <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded">CONFIRMADO</span>
        case 'completed': return <span className="bg-blue-500/20 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded">LISTO</span>
        default: return <span className="bg-zinc-700 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded">{status}</span>
    }
}
