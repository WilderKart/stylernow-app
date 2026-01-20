"use client"

import { useEffect, useState } from "react"
import { getSedeDashboard, SedeDashboardStats, StaffStatus } from "@/app/actions/manager-actions"
import { DollarSign, Users, Briefcase, UserCheck } from "lucide-react"

export default function ManagerDashboardPage() {
    const [stats, setStats] = useState<SedeDashboardStats | null>(null)
    const [staffList, setStaffList] = useState<StaffStatus[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 60000) // 1 min poll
        return () => clearInterval(interval)
    }, [])

    const loadData = async () => {
        const res = await getSedeDashboard()
        if (res.success && res.data) {
            setStats(res.data.stats)
            setStaffList(res.data.liveStaff)
        }
        setLoading(false)
    }

    if (loading) return <div className="p-8 text-black">Cargando tablero...</div>

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 px-6 pt-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-gray-900">Sede Dashboard</h1>
                <p className="text-gray-500">Supervisión en tiempo real</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <KPICard
                    icon={<DollarSign className="text-green-600" size={20} />}
                    label="Ventas Hoy"
                    value={`$${stats?.todaySales.toLocaleString()}`}
                    color="bg-green-50 text-green-700 border-green-200"
                />
                <KPICard
                    icon={<UserCheck className="text-blue-600" size={20} />}
                    label="Clientes en Sitio"
                    value={stats?.clientsOnSite.toString() || "0"}
                    color="bg-blue-50 text-blue-700 border-blue-200"
                />
                <KPICard
                    icon={<Users className="text-purple-600" size={20} />}
                    label="Staff Activo"
                    value={stats?.activeStaff.toString() || "0"}
                    color="bg-purple-50 text-purple-700 border-purple-200"
                />
                <KPICard
                    icon={<Briefcase className="text-orange-600" size={20} />}
                    label="Ocupación"
                    value={`${stats?.occupancy}%`}
                    color="bg-orange-50 text-orange-700 border-orange-200"
                />
            </div>

            {/* Live Floor */}
            <h2 className="text-xl font-bold mb-4">Piso en Vivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffList.map(staff => (
                    <div key={staff.id} className={`p-4 rounded-xl border flex justify-between items-center ${staff.status === 'busy'
                            ? 'bg-white border-brand-orange/30 shadow-sm border-l-4 border-l-brand-orange'
                            : 'bg-white border-gray-200 opacity-80'
                        }`}>
                        <div>
                            <p className="font-bold text-lg">{staff.name}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                {staff.status === 'busy' ? "OCUPADO" : "DISPONIBLE"}
                            </p>
                        </div>
                        {staff.status === 'busy' && staff.currentBooking && (
                            <div className="text-right">
                                <span className="block text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md mb-1">
                                    {staff.currentBooking.status === 'checked_in' ? 'CLIENTE LLEGÓ' : 'CONFIRMADO'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(staff.currentBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )}
                        {staff.status === 'idle' && (
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function KPICard({ label, value, icon, color }: any) {
    return (
        <div className={`p-4 rounded-2xl border ${color}`}>
            <div className="flex items-center gap-2 mb-2 opacity-80">
                {icon}
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}
