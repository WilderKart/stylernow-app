import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6">
                <ShieldAlert size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                No tienes los permisos necesarios para visualizar esta sección. Si crees que es un error, contacta a soporte.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/login"
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Cambiar cuenta
                </Link>
                <Link
                    href="/"
                    className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
