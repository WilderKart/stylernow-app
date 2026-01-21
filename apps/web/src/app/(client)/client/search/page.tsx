"use client";

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Navigation, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientSearchPage() {
    const [view, setView] = useState<"map" | "list">("map");

    const results = [
        { id: 1, name: "Gentleman's Cut", distance: "0.8 km", rating: 4.9, price: "25€", image: "/images/shop1.jpg", coords: { top: "40%", left: "30%" } },
        { id: 2, name: "Urban Stylez", distance: "1.2 km", rating: 4.7, price: "20€", image: "/images/shop2.jpg", coords: { top: "60%", left: "60%" } },
        { id: 3, name: "Barber King", distance: "2.5 km", rating: 4.8, price: "30€", image: "/images/shop3.jpg", coords: { top: "30%", left: "70%" } },
    ];

    return (
        <div className="min-h-full pb-24 bg-background relative flex flex-col h-screen overflow-hidden">

            {/* Floating Search Header */}
            <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-14 pb-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="relative pointer-events-auto flex gap-3">
                    <div className="flex-1 relative shadow-lg">
                        <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar servicios o barberos..."
                            className="w-full pl-12 pr-4 py-3 bg-card/90 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>
                    <button className="w-12 h-12 bg-card/90 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-foreground shadow-lg active:scale-95 transition-transform">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Map Layer (Background) */}
            <div className="absolute inset-0 z-0 bg-[#242f3e] overflow-hidden">
                {/* Fake Map Elements for premium look */}
                <div className="absolute inset-0 opacity-30 bg-cover bg-center grayscale"
                    style={{
                        backgroundImage: "url('/images/map-dark.png')", // Ideally we have an image
                        backgroundColor: "#242f3e"
                    }}
                />

                {/* Custom Markers */}
                {results.map((shop) => (
                    <div
                        key={shop.id}
                        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: shop.coords.top, left: shop.coords.left }}
                    >
                        <div className="bg-card text-[10px] font-bold px-2 py-1 rounded-md mb-1 shadow-md whitespace-nowrap border border-white/10 text-foreground">
                            {shop.price}
                        </div>
                        <div className="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            <MapPin size={40} fill="currentColor" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Sheet / List Results */}
            <div className="absolute bottom-20 left-0 right-0 z-10">
                <div className="px-6 pb-4 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                    {results.map((shop) => (
                        <motion.div
                            key={shop.id}
                            className="snap-center w-[85%] flex-shrink-0 bg-card/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-secondary rounded-2xl relative overflow-hidden flex-shrink-0">
                                    {/* Image Placeholder */}
                                    <div className="absolute inset-0 bg-secondary flex items-center justify-center text-xs text-muted-foreground font-bold">IMAGE</div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="font-bold text-foreground text-lg leading-tight">{shop.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Navigation size={10} /> {shop.distance}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                                            <Star size={10} fill="currentColor" className="mb-[1px]" />
                                            {shop.rating}
                                        </div>
                                        <div className="text-xs font-medium text-foreground bg-white/10 px-2 py-0.5 rounded-full">
                                            Desde {shop.price}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
