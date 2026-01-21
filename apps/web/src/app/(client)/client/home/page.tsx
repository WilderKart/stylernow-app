"use client";

import { useState } from "react";
import { Search, MapPin, Bell, Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClientHomePage() {
    const [activeCategory, setActiveCategory] = useState("Corte");

    const categories = [
        { name: "Corte", id: "corte" },
        { name: "Barba", id: "barba" },
        { name: "Tinte", id: "tinte" },
        { name: "Afeitado", id: "afeitado" },
    ];

    const specialists = [
        { id: 1, name: "Wade Warren", rating: 5.0, image: "/images/barber1.jpg" },
        { id: 2, name: "Darrell Steward", rating: 4.8, image: "/images/barber2.jpg" },
        { id: 3, name: "Jerome Bell", rating: 4.9, image: "/images/barber3.jpg" },
    ];

    return (
        <div className="min-h-full pb-32 bg-background text-foreground">
            {/* Header */}
            <header className="px-6 pt-14 pb-4 sticky top-0 z-30 bg-background/95 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading">Hola, Alex!</h1>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin size={14} className="text-primary" />
                            <p>Stylernow - Madrid</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
                        {/* Edit Icon as per image or Bell */}
                        <div className="w-full h-full rounded-full bg-slate-200 relative overflow-hidden">
                            {/* Placeholder Avatar */}
                            <div className="absolute inset-0 bg-secondary flex items-center justify-center text-xs">YO</div>
                        </div>
                    </button>
                </div>
            </header>

            <div className="px-6 space-y-8">
                {/* Hero / Premium Pack Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-48 rounded-[2rem] bg-gradient-to-br from-[#e0e0e0] to-[#a0a0a0] p-6 relative overflow-hidden shadow-lg"
                >
                    {/* Metallic/Silver Gradient Card logic */}
                    <div className="absolute top-0 right-0 p-6">
                        <span className="text-xl font-bold text-black/80">35€</span>
                    </div>

                    <div className="h-full flex flex-col justify-center text-black/80 z-10 relative">
                        <h2 className="text-2xl font-bold mb-1">Pack Premium</h2>
                        <p className="text-sm opacity-70 mb-4">Corte + Barba + Estilo<br />Exclusivo en App</p>

                        <button className="w-fit px-6 py-2 bg-white/40 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/60 transition-colors">
                            Reservar
                        </button>
                    </div>

                    {/* Background shine effect */}
                    <div className="absolute -right-10 -bottom-20 w-48 h-48 bg-white/20 blur-3xl rounded-full pointer-events-none" />
                </motion.div>

                {/* Services */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Servicios</h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.name
                                        ? "bg-black text-white border border-transparent" // Active: Black button as per image
                                        : "bg-card text-muted-foreground border border-transparent hover:bg-secondary"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Especialistas */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Especialistas</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                        {specialists.map((specialist) => (
                            <Link href={`/barber/${specialist.id}`} key={specialist.id}>
                                <div className="w-40 h-56 rounded-3xl bg-card overflow-hidden relative group border border-border/50">
                                    <div className="absolute inset-0 bg-secondary/50" /> {/* Image Placeholder */}
                                    {/* Real image would go here with fill */}

                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
                                        <p className="text-white font-bold text-sm leading-tight mb-1">{specialist.name}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[10px] text-yellow-400">
                                                <Star size={10} fill="currentColor" />
                                                <span>{specialist.rating}</span>
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <ChevronRight size={14} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
