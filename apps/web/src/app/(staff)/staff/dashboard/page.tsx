"use client";

import { useEffect, useState } from "react";
import { getStaffAppointments, getStaffDailyEarnings, StaffEarningsReal } from "@/lib/api";
import { Reserva } from "@/types/db";
import { useAuth } from "@/hooks/use-auth";
import { Clock, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import clsx from "clsx";

export default function StaffDashboardPage() {
    const { user } = useAuth();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [earnings, setEarnings] = useState<StaffEarningsReal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Real API calls rely on current session, no need to pass ID manually often
            const [r, e] = await Promise.all([
                getStaffAppointments(),
                getStaffDailyEarnings()
            ]);
            setReservas(r);
            setEarnings(e);
            setLoading(false);
        }
        load();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-gray-100 text-gray-600';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente Pago';
            case 'confirmed': return 'Confirmada';
            case 'completed': return 'Finalizada';
            default: return status;
        }
    };

    return (
        <div className="pb-6">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 rounded-b-3xl shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Hola,</p>
                        <h1 className="text-2xl font-bold text-gray-900">Carlos "Fade"</h1>
                        <p className="text-xs text-brand font-semibold bg-brand/10 px-2 py-0.5 rounded-md inline-block mt-1">Nivel Master</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                </div>

                {/* Quick Earnings Card */}
                <div className="mt-6 bg-gray-900 rounded-2xl p-4 text-white hover:scale-[1.01] transition-transform">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Ganancias Hoy (Est.)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold tracking-tight">
                            ${earnings?.total_pagar.toLocaleString() ?? '...'}
                        </span>
                        <span className="text-sm text-gray-500">COP</span>
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-gray-400 border-t border-gray-800 pt-3">
                        <span>Servicios: ${earnings?.total_servicios.toLocaleString()}</span>
                        <span>Propinas: ${earnings?.total_propinas.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Agenda Section */}
            <div className="px-6 mt-6">
                <div className="flex justify-between items-baseline mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Tu Agenda</h2>
                    <span className="text-sm text-gray-500">Hoy</span>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="space-y-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 z-0 content-['']" />

                        {reservas.map((reserva) => {
                            const time = new Date(reserva.start_time).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={reserva.id} className="relative z-10 pl-10">
                                    <div className="absolute left-2.5 top-6 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-20" />

                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-mono font-bold text-gray-900 text-lg">{time}</span>
                                            <span className={clsx(
                                                "px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide",
                                                getStatusColor(reserva.status)
                                            )}>
                                                {getStatusLabel(reserva.status)}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900">Corte Clásico + Lavado</h3>
                                            <p className="text-sm text-gray-500">Cliente: Juan Pérez</p>
                                        </div>

                                        {reserva.status === 'confirmed' && (
                                            <div className="mt-2 pt-2 border-t border-gray-50 flex gap-2 text-xs text-gray-400">
                                                <Clock size={14} /> 45 min
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {reservas.length === 0 && (
                            <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p>No tienes citas para hoy.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
