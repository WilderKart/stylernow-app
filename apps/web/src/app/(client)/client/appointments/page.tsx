"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, MoreVertical, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

    const upcomingAppointments = [
        {
            id: 1,
            barber: "Wade Warren",
            service: "Corte Clásico + Barba",
            date: "Hoy, 20 Ene",
            time: "16:00",
            price: "45€",
            status: "confirmed",
            avatar: "W"
        },
        {
            id: 2,
            barber: "Jerome Bell",
            service: "Afeitado Royal",
            date: "Mañana, 21 Ene",
            time: "10:30",
            price: "20€",
            status: "pending",
            avatar: "J"
        }
    ];

    const pastAppointments = [
        {
            id: 3,
            barber: "Wade Warren",
            service: "Corte Clásico",
            date: "10 Dic, 2025",
            time: "15:00",
            price: "25€",
            status: "completed",
            avatar: "W"
        }
    ];

    const currentList = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="px-6 pt-14 pb-4 sticky top-0 bg-background/95 backdrop-blur-md z-30 flex justify-between items-center">
                <h1 className="text-2xl font-bold font-heading">Mis Citas</h1>
                <div className="flex gap-2 bg-secondary p-1 rounded-full">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === "upcoming" ? "bg-primary text-black shadow-md" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Próximas
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === "history" ? "bg-primary text-black shadow-md" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Historial
                    </button>
                </div>
            </div>

            <div className="px-6 space-y-4 mt-2">
                <AnimatePresence mode="popLayout">
                    {currentList.length > 0 ? (
                        currentList.map((app) => (
                            <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-card rounded-3xl p-5 border border-white/5 relative overflow-hidden group"
                            >
                                {/* Status Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${app.status === 'confirmed' ? 'bg-primary' :
                                        app.status === 'pending' ? 'bg-orange-400' : 'bg-green-500'
                                    }`} />

                                <div className="flex justify-between items-start mb-4 pl-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                            {app.avatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground text-lg leading-none">{app.barber}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{app.service}</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase tracking-wide text-foreground/80">
                                        {app.price}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pl-3 text-sm font-medium text-foreground/90 bg-secondary/30 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-primary" />
                                        {app.date}
                                    </div>
                                    <div className="w-[1px] h-3 bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-primary" />
                                        {app.time}
                                    </div>
                                </div>

                                {activeTab === "upcoming" && (
                                    <div className="flex gap-2 mt-4 pl-3">
                                        <button className="flex-1 py-2.5 rounded-xl bg-primary text-black text-xs font-bold hover:bg-white transition-colors">
                                            Reprogramar
                                        </button>
                                        <button className="px-4 py-2.5 rounded-xl bg-white/5 text-foreground hover:bg-red-500/20 hover:text-red-500 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <Calendar size={32} className="text-muted-foreground" />
                            </div>
                            <p className="font-bold text-lg">No tienes citas {activeTab === "upcoming" ? "próximas" : "pasadas"}</p>
                            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Explora barberías y reserva tu próximo estilo.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
