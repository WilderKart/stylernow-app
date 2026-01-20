"use client";

import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { signIn, loading } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
            <div className="mb-12 text-center">
                <div className="w-20 h-20 bg-brand rounded-3xl mx-auto mb-6 shadow-xl flex items-center justify-center">
                    {/* Logo Placeholder */}
                    <span className="text-white text-3xl font-bold">S</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Stylernow</h1>
                <p className="text-gray-500">Reserva tu estilo.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <p className="text-xs text-center text-gray-400 uppercase tracking-widest font-semibold mb-4">
                    Simular Rol (Dev Mode)
                </p>

                <button
                    onClick={() => signIn('cliente')}
                    disabled={loading}
                    className="w-full py-4 bg-brand text-white font-semibold rounded-2xl shadow-lg shadow-brand/20 active:scale-95 transition-transform"
                >
                    {loading ? "Cargando..." : "Ingresar como Cliente"}
                </button>

                <button
                    onClick={() => signIn('staff')}
                    disabled={loading}
                    className="w-full py-4 bg-white border border-gray-200 text-gray-900 font-semibold rounded-2xl shadow-sm active:scale-95 transition-transform"
                >
                    {loading ? "Cargando..." : "Ingresar como Staff"}
                </button>

                <button
                    onClick={() => signIn('barberia')}
                    disabled={loading}
                    className="w-full py-4 bg-gray-900 text-white font-semibold rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                    {loading ? "Cargando..." : "Ingresar como Barbería"}
                </button>
            </div>
        </div>
    );
}
