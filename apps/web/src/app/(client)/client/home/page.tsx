"use client";

import { useEffect, useState } from "react";
import { getBarberias } from "@/lib/api";
import { Barberia } from "@/types/db";
import { Search, MapPin, Star, Scissors, Sparkles, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClientHomePage() {
    const [barberias, setBarberias] = useState<Barberia[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Todos");

    // Mock Categories
    const categories = [
        { name: "Todos", icon: null },
        { name: "Corte", icon: <Scissors size={14} /> },
        { name: "Barba", icon: <Star size={14} /> },
        { name: "Spa", icon: <Sparkles size={14} /> },
        { name: "Color", icon: <Sparkles size={14} /> },
    ];

    useEffect(() => {
        getBarberias().then((data) => {
            setBarberias(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-full pb-24 bg-gray-50">
            {/* Header & Search */}
            <header className="px-6 pt-12 pb-6 bg-white rounded-b-3xl shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ubicación Actual</p>
                        <div className="flex items-center gap-1 text-gray-900 font-bold text-lg">
                            <MapPin size={18} className="text-brand-orange" />
                            Bogotá, Chicó
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {/* Placeholder Avatar */}
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">YO</div>
                    </div>
                </div>

                <div className="relative shadow-sm rounded-2xl">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Busca barberías o servicios..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </header>

            {/* Categories Scroll */}
            <div className="mt-6 px-6 overflow-x-auto no-scrollbar pb-2">
                <div className="flex gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.name
                                    ? "bg-gray-900 text-white shadow-lg"
                                    : "bg-white text-gray-500 border border-gray-100 shadow-sm"
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Near Me Section (Carrousel) */}
            <div className="mt-8 px-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Cerca de mí</h2>
                    <button className="text-brand-orange text-xs font-bold flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <Navigation size={12} /> Mapa
                    </button>
                </div>

                {/* Horizontal Scroll for Recommended */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="min-w-[280px] h-48 bg-gray-200 rounded-2xl animate-pulse" />)
                    ) : (
                        barberias.slice(0, 3).map((barberia) => (
                            <Link key={barberia.id} href={`/barberia/${barberia.id}`} className="block">
                                <div className="min-w-[280px] bg-white rounded-2xl shadow-ios overflow-hidden relative group">
                                    <div className="h-32 w-full relative">
                                        <Image
                                            src={barberia.banner_url || "/placeholder.jpg"}
                                            alt={barberia.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400" /> 4.9
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 truncate">{barberia.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">A 1.2 km • Abierto ahora</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* All Barberias (Vertical) */}
            <div className="mt-6 px-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recomendado para ti</h2>
                <div className="grid gap-5">
                    {loading ? (
                        [1, 2].map(i => <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />)
                    ) : (
                        barberias.map((barberia) => (
                            <Link key={barberia.id} href={`/barberia/${barberia.id}`}>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <div className="relative h-44 w-full">
                                        <Image
                                            src={barberia.banner_url || "/placeholder.jpg"}
                                            alt={barberia.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-md">PRO</span>
                                                <span className="text-[10px] font-medium opacity-90">Barbería & Spa</span>
                                            </div>
                                            <h3 className="text-xl font-bold">{barberia.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex justify-between items-center">
                                        <div className="flex gap-3">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-100" />
                                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-100" />
                                                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center text-[10px] font-bold text-white">+3</div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Expertos</p>
                                                <p className="text-xs font-bold text-gray-900">5 disponibles hoy</p>
                                            </div>
                                        </div>
                                        <button className="bg-gray-900 text-white rounded-xl px-5 py-2 text-sm font-bold shadow-lg shadow-gray-900/20">
                                            Reservar
                                        </button>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
