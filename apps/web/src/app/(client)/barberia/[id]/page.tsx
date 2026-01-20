"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBarberiaById, getServiciosByBarberia, getStaffByBarberia } from "@/lib/api";
import { Barberia, Servicio, Staff } from "@/types/db";
import { Star, MapPin, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookingSheet from "@/components/booking-sheet"; // Component to be created
import { AnimatePresence } from "framer-motion";

export default function BarberiaDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [barberia, setBarberia] = useState<Barberia | undefined>();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedService, setSelectedService] = useState<Servicio | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        async function load() {
            const [b, s, sv] = await Promise.all([
                getBarberiaById(id),
                getStaffByBarberia(id),
                getServiciosByBarberia(id)
            ]);
            setBarberia(b);
            setStaff(s);
            setServicios(sv);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-white animate-pulse" />;
    if (!barberia) return <div className="p-6">Barbería no encontrada</div>;

    const handleBook = (servicio: Servicio) => {
        setSelectedService(servicio);
        setIsBookingOpen(true);
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Hero */}
            <div className="relative h-72 w-full">
                <Image
                    src={barberia.banner_url || "/placeholder.jpg"}
                    alt={barberia.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

                {/* Navbar Action */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                    <Link href="/client/home" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <Star size={20} />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Premium Partner</span>
                    </div>
                    <h1 className="text-4xl font-bold font-display leading-tight">{barberia.name}</h1>
                    <p className="flex items-center gap-1 text-sm mt-2 opacity-90 font-medium">
                        <MapPin size={16} className="text-brand-orange" /> Bogotá, Zona T • 1.2 km
                    </p>
                </div>
            </div>

            <div className="px-6 py-6 space-y-8">

                {/* Info Cards */}
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    <div className="flex-shrink-0 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700"><Star size={18} fill="currentColor" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Rating</p>
                            <p className="text-sm font-bold text-gray-900">4.9 (1.2k)</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-700"><Clock size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Abierto</p>
                            <p className="text-sm font-bold text-gray-900">Hasta 8pm</p>
                        </div>
                    </div>
                </div>

                {/* Staff Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Profesionales Top</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {staff.map(s => (
                            <div key={s.id} className="flex-shrink-0 w-28 flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden relative border-2 border-white shadow-md">
                                    <Image src={s.photo_url || "/placeholder.jpg"} alt={s.name} fill className="object-cover" />
                                </div>
                                <p className="text-xs font-bold text-center leading-tight line-clamp-2">{s.name}</p>
                                <span className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand rounded-full font-semibold">{s.nivel}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Services Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Servicios</h2>
                    <div className="space-y-4">
                        {servicios.map(servicio => (
                            <div key={servicio.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-bold text-gray-900">{servicio.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 max-w-[200px] line-clamp-1">{servicio.description}</p>
                                    <p className="text-sm font-semibold text-gray-400 mt-2">{servicio.duration_minutes} min • ${servicio.price.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => handleBook(servicio)}
                                    className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors"
                                >
                                    Reservar
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Booking Sheet */}
            <AnimatePresence>
                {isBookingOpen && selectedService && barberia && (
                    <BookingSheet
                        service={selectedService}
                        barberia={barberia}
                        staffList={staff}
                        onClose={() => setIsBookingOpen(false)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
