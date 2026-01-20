"use client";

import { useEffect, useState } from "react";
import { getBarberiaKPIs, getGlobalAgenda, AdminKPIsReal } from "@/lib/api";
import { Reserva } from "@/types/db";
import { Wallet, Users, CalendarCheck, Ban, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function AdminDashboardPage() {
    const [kpis, setKpis] = useState<AdminKPIsReal | null>(null);
    const [globalAgenda, setGlobalAgenda] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Real API calls rely on authenticated user context (Owner), no need to pass ID
            const [k, a] = await Promise.all([
                getBarberiaKPIs(),
                getGlobalAgenda()
            ]);
            setKpis(k);
            setGlobalAgenda(a);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="pb-6">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Panel de Control</p>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">Mustache Barber Club</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Operando Normal
                </p>
            </header>

            {/* KPI Grid */}
            <div className="px-6 py-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={20} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Ingresos Mes</p>
                        <p className="text-lg font-bold text-gray-900 leading-tight">
                            ${loading ? '...' : (kpis?.monthly_revenue / 1000000).toFixed(1)}M
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><CalendarCheck size={20} /></div>
                        <span className="text-xs font-bold text-gray-400">Total</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Citas Mes</p>
                        <p className="text-lg font-bold text-gray-900 leading-tight">
                            {loading ? '...' : kpis?.total_appointments}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 col-span-2 flex-row items-center px-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Users size={20} /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase">Equipo Activo</p>
                            <p className="text-lg font-bold text-gray-900">{loading ? '...' : kpis?.active_staff}</p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-100 mx-4" />
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Ocupación</p>
                        <p className="text-lg font-bold text-gray-900">{loading ? '...' : kpis?.occupancy_rate}%</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions (Mocked) */}
            <div className="px-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Acciones Rápidas</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    <button className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-200">
                            <Ban size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Bloquear</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-200">
                            <PlusCircle size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Servicio</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-200">
                            <Users size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Nuevo Staff</span>
                    </button>
                </div>
            </div>

            {/* Global Agenda Live Feed */}
            <div className="px-6 mt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Agenda Global (En vivo)</h3>
                <div className="bg-white rounded-3xl border border-gray-100 p-4 space-y-4">
                    {loading ? <div className="h-20 bg-gray-100 rounded-xl animate-pulse" /> :
                        globalAgenda.map(reserva => (
                            <div key={reserva.id} className="flex gap-4 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                <div className="flex flex-col items-center justify-center w-12 bg-gray-50 rounded-xl px-2">
                                    <span className="text-xs font-bold text-gray-900">{reserva.start_time.split('T')[1].substring(0, 5)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Corte Clásico</p>
                                    <p className="text-xs text-gray-500">Staff: {reserva.staff_id === 'st1' ? 'Carlos' : 'Julian'} • {reserva.status}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
