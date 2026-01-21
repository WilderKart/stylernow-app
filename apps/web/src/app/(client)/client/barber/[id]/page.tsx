"use client";

import { use, useState } from "react";
import { ArrowLeft, Star, MapPin, Share2, Heart, Clock, ChevronRight, Scissors } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BarberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState("servicios");

    const services = [
        { id: 1, name: "Corte Clásico", duration: "45 min", price: "25€", description: "Corte tradicional a tijera o máquina con acabado premium." },
        { id: 2, name: "Afeitado Royal", duration: "30 min", price: "20€", description: "Afeitado con toalla caliente, masaje y aceites esenciales." },
        { id: 3, name: "Pack Completo", duration: "75 min", price: "40€", description: "Corte de cabello + Afeitado Royal + Masaje capilar." },
        { id: 4, name: "Diseño de Barba", duration: "20 min", price: "15€", description: "Perfilado y diseño de barba con navaja." },
    ];

    const portfolio = [
        "/images/cut1.jpg", "/images/cut2.jpg", "/images/cut3.jpg", "/images/cut4.jpg"
    ];

    return (
        <div className="min-h-screen bg-background pb-24 relative">
            {/* Header Image */}
            <div className="h-80 w-full relative">
                {/* Placeholder for Cover Image */}
                <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground">COVER IMAGE</div>
                {/* Real Image: <Image src="/images/barbershop-cover.jpg" fill className="object-cover" alt="Cover" /> */}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

                {/* Top Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center mt-8">
                    <Link href="/client/home" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Info Card (Overlapping) */}
            <div className="px-6 -mt-20 relative z-10">
                <div className="flex justify-between items-end mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-background bg-secondary relative overflow-hidden shadow-xl">
                        {/* Avatar Placeholder */}
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">AVATAR</div>
                    </div>
                    <div className="flex gap-4 mb-2">
                        <div className="text-center">
                            <p className="font-bold text-lg text-foreground">4.9</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-foreground">125</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reseñas</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-foreground">5+</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Años</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold font-heading text-foreground">Wade Warren</h1>
                    <p className="text-primary font-medium text-sm mb-1">Master Barber • Especialista en Cortes Clásicos</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin size={12} />
                        <p>Calle Serrano 45, Madrid (A 1.2km)</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-20">
                <div className="flex px-6 gap-8">
                    {['servicios', 'portafolio', 'reseñas'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? "text-foreground" : "text-muted-foreground"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 mt-6 min-h-[300px]">
                {activeTab === 'servicios' && (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div key={service.id} className="bg-card rounded-2xl p-4 border border-border/50 flex justify-between items-center hover:border-primary/50 transition-colors cursor-pointer group">
                                <div>
                                    <h3 className="font-bold text-foreground text-lg">{service.name}</h3>
                                    <p className="text-muted-foreground text-xs mt-1 max-w-[200px]">{service.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock size={12} className="text-primary" />
                                        <span className="text-xs text-muted-foreground">{service.duration}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-lg font-bold text-primary">{service.price}</span>
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'portafolio' && (
                    <div className="grid grid-cols-2 gap-4">
                        {portfolio.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-secondary rounded-2xl overflow-hidden relative">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">FOTO {idx + 1}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'reseñas' && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Las reseñas se cargarán aquí.</p>
                    </div>
                )}
            </div>

            {/* Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-30">
                <button className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] shadow-primary/20 text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                    <Scissors size={20} />
                    Reservar Cita
                </button>
            </div>

        </div>
    );
}
