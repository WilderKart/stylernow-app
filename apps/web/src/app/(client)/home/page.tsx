"use client";

import { useEffect, useState } from "react";
import { getBarberias } from "@/lib/api";
import { Barberia } from "@/types/db";
import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ClientHomePage() {
    const [barberias, setBarberias] = useState<Barberia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBarberias().then((data) => {
            setBarberias(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-full pb-6">
            {/* Header */}
            <header className="px-6 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
                <h1 className="text-3xl font-bold font-display text-gray-900">Explorar</h1>
                <div className="mt-4 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Barberías, servicios..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:font-medium"
                    />
                </div>
            </header>

            {/* Content */}
            <div className="px-6 mt-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Barberías Top</h2>
                    <button className="text-brand font-semibold text-sm">Ver todo</button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {barberias.map((barberia) => (
                            <Link key={barberia.id} href={`/barberia/${barberia.id}`}>
                                <div className="bg-white rounded-3xl shadow-ios overflow-hidden active:scale-[0.98] transition-transform duration-200">
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={barberia.banner_url || "/placeholder.jpg"}
                                            alt={barberia.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            4.8 ★
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900">{barberia.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                                            <MapPin size={14} /> Bogotá, Chicó Norte
                                        </p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-lg text-gray-600">Corte</span>
                                            <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-lg text-gray-600">Barba</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
